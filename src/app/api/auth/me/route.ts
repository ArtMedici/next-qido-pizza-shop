import { getUserSession } from "@/lib/get-user-session";
import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function GET() {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json(
        { message: "Вы не авторизованы" },
        { status: 401 },
      );
    }

    const data = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
      select: {
        fullName: true,
        email: true,
        password: true,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log("Exception " + error);
    return NextResponse.json(
      { message: "[USER_GET] Server error" },
      { status: 500 },
    );
  }
}
