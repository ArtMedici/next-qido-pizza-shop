import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }

    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        code: code,
      },
    });

    if (!verificationCode) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }

    await prisma.user.update({
      where: {
        id: verificationCode.userId,
      },
      data: {
        verified: new Date(),
      },
    });

    await prisma.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    });

    const cookieStore = cookies();
    cookieStore.set("verified", "true");

    return NextResponse.redirect(new URL("/?verified", req.url));
  } catch (error) {
    console.log("Error [VERIFY_GET] " + error);

    return NextResponse.json(
      { error: "Ошибка в процессе верификации" },
      { status: 500 },
    );
  }
}
