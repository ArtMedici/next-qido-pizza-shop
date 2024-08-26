"use server";

import { CheckoutFormValues } from "@/shared/constants";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { calcOrderPrice, createPayment, sendEmail } from "@/shared/lib";
import {
  PayOrderTemplate,
  VerificationUserTemplate,
} from "@/shared/components";
import { OrderStatus, Prisma } from "@prisma/client";
import { getUserSession } from "@/lib/get-user-session";
import { hashSync } from "bcrypt";

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = cookies();
    const cartToken = cookieStore.get("cartToken")?.value;

    if (!cartToken) {
      throw new Error("Cart token not found");
    }

    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            ingredients: true,
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        token: cartToken,
      },
    });

    if (!userCart) {
      throw new Error("Cart not found");
    }

    if (userCart?.totalAmount === 0) {
      throw new Error("Cart is empty");
    }

    const { totalPrice } = calcOrderPrice(userCart.totalAmount);

    const order = await prisma.order.create({
      data: {
        token: cartToken,
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: totalPrice,
        items: JSON.stringify(userCart.items),
      },
    });

    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    const paymentData = await createPayment({
      orderId: order.id,
      amount: order.totalAmount,
      description: "Оплата заказа #" + order.id,
    });

    if (!paymentData) {
      throw new Error("Payment data not found");
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentId: paymentData.id,
      },
    });

    const paymentUrl = paymentData.confirmation.confirmation_url;
    const paymentId = paymentData.id;

    if (!paymentUrl) {
      throw new Error("Payment url not found");
    }

    if (!paymentId) {
      throw new Error("Payment id not found");
    }

    cookieStore.set("paymentToken", paymentId);

    await sendEmail(
      data.email,
      "QIDO Пицца | Оплата заказа #" + order.id,
      PayOrderTemplate({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl,
      }),
    );

    return paymentUrl;
  } catch (error) {
    console.log("[CreateOrder] Server error: ", error);
  }
}

export async function getOrderStatus() {
  try {
    const cookieStore = cookies();
    const cartToken = cookieStore.get("cartToken")?.value;
    const paymentToken = cookieStore.get("paymentToken")?.value;

    if (!paymentToken) {
      throw new Error("Payment token not found");
    }

    const order = await prisma.order.findFirst({
      where: {
        token: cartToken,
        paymentId: paymentToken,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (
      order.status === OrderStatus.SUCCEEDED ||
      order.status === OrderStatus.CANCELLED
    ) {
      cookieStore.delete("paymentToken");
    }

    return order.status;
  } catch (error) {
    console.log("Error [GetOrderStatus] ", error);
    throw error;
  }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("User not found");
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password
          ? hashSync(body.password as string, 10)
          : findUser?.password,
      },
    });
  } catch (error) {
    console.log("Error [UPDATE_USER] " + error);
    throw error;
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      if (!user.verified) {
        throw new Error("Почта не подтверждена");
      }

      throw new Error("Пользователь уже существует");
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        userId: createdUser.id,
        code,
      },
    });

    await sendEmail(
      createdUser.email,
      "QIDO Пицца | ✅ Подтверждение регистрации",
      VerificationUserTemplate({
        code,
      }),
    );
  } catch (error) {
    console.log("Error [CREATE_USER] " + error);
    throw error;
  }
}

export async function verifyUser() {
  try {
    const cookieStore = cookies();
    const verify = cookieStore.get("verified")?.value;
    const currentUser = await getUserSession();
    let verified: boolean;
    let message: string = "";

    if (!verify && !currentUser) {
      throw new Error("Verification not found");
    } else if (verify === "true") {
      cookieStore.delete("verified");
      message = "Ваш профиль успешно подтвержден!";
      verified = true;
      return { verified, message };
    } else if (currentUser) {
      const findUser = await prisma.user.findFirst({
        where: {
          id: Number(currentUser.id),
        },
      });

      if (!findUser) {
        throw new Error("User not found");
      }

      if (!findUser.verified) {
        throw new Error("Profile not verified");
      }

      message = "Ваш профиль уже подтвержден";
      verified = true;
      return { verified, message };
    }
  } catch (error) {
    console.log("Error [VERIFY_USER] " + error);
    throw error;
  }
}
