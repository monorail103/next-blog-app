import prisma from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Category } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  try {
    const categories: Category[] = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    throw new Error("意図的にエラーを発生させる!!!"); // ◀ 追加
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "カテゴリの取得に失敗しました" },
      { status: 500 } // 500: Internal Server Error
    );
  }
};