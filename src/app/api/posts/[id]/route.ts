import prisma from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "IDが指定されていません" },
      { status: 400 }
    );
  }
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        coverImageURL: true,
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!post) {
      return NextResponse.json(
        { error: `ID: ${id} の記事は見つかりませんでした` },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "記事の取得に失敗しました" },
      { status: 500 }
    );
  }
};