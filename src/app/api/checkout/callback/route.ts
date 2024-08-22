import { NextRequest, NextResponse } from "next/server";
import { PaymentCallbackData } from "@/@types/yookassa";
import { prisma } from "@/prisma/prisma-client";
import { OrderStatus } from "@prisma/client";
import { CartItemDTO } from "@/services/dto/cart.dto";
import { sendEmail } from "@/shared/lib";
import { OrderFailedTemplate, OrderSuccessTemplate } from "@/shared/components";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PaymentCallbackData;

    const resp = NextResponse.json(body);

    const order = await prisma.order.findFirst({
      where: {
        id: Number(body.object.metadata.order_id),
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" });
    }

    const isSucceeded = body.object.status === "succeeded";

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
      },
    });

    const items = JSON.parse(
      order?.items as unknown as string,
    ) as CartItemDTO[];

    if (isSucceeded) {
      await sendEmail(
        order.email,
        "QIDO Пицца | Зака успешно оформлен",
        OrderSuccessTemplate({ orderId: order.id, items }),
      );

      console.log("[Checkout Callback] Success!");
      return resp;
    } else {
      await sendEmail(
        order.email,
        "QIDO Пицца | Заказ отменен",
        OrderFailedTemplate({ orderId: order.id }),
      );

      console.log("[Checkout Callback] Failed!");
      return resp;
    }
  } catch (err) {
    console.log("[Checkout Callback] Error: ", err);
    return NextResponse.json({ error: "Server error" });
  }
}
