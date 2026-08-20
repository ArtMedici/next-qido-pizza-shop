import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();

  const stories = await prisma.story.findMany({
    where: {
      enabled: true,
      AND: [
        {
          OR: [
            { publishDate: null },
            { publishDate: { lte: now } },
          ],
        },
        {
          OR: [
            { expireDate: null },
            { expireDate: { gt: now } },
          ],
        },
      ],
    },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(stories);
}
