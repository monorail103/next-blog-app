"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Post } from "@/app/_types/Post";
import type { Category } from "@/app/_types/Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import DOMPurify from "isomorphic-dompurify";

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // 動的ルートパラメータから 記事id を取得 （URL:/posts/[id]）
  const { id } = useParams<{ id: string }>();

  // コンポーネントが読み込まれたときに「1回だけ」実行する処理
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        // microCMS から記事データを取得
        const requestUrl = `/api/posts/${id}`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data = await response.json();
        setPost(data as Post);

        // 日付のパースを確認
        const parsedDate = new Date(data.createdAt);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("日付のパースに失敗しました");
        }

        // カテゴリの処理
        const categories = data.categories.map((cat: any) => cat.category);
        setCategories(categories);
        console.log(categories);

        // 画像のサイズを取得
        const img = new window.Image();
        img.src = data.coverImageURL;
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });
        };
      } catch (e) {
        console.error(e);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 投稿データの取得中は「Loading...」を表示
  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  // 投稿データが取得できなかったらエラーメッセージを表示
  if (!post) {
    return <div>指定idの投稿の取得に失敗しました。</div>;
  }

  // HTMLコンテンツのサニタイズ
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  return (
    <main className="min-h-screen py-10 px-6">
      {/* 記事タイトル */}
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
          {post.title}
        </h1>

        {/* 投稿日時 */}
        <time className="text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </time>

        {/* カテゴリ */}
        <div className="mt-4">
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  className="inline-block rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-sm font-semibold text-white shadow-sm transition-transform duration-300 hover:scale-105"
                >
                  {category.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-100 py-4">
              <span className="text-sm text-gray-500">カテゴリなし</span>
            </div>
          )}
        </div>


        {/* カバー画像 */}
        {imageSize && (
          <div className="relative mx-auto overflow-hidden rounded-2xl shadow-lg">
            <img
              src={post.coverImageURL}
              alt="Cover Image"
              width={imageSize.width}
              height={imageSize.height}
              className="w-full h-auto transition-transform duration-300 hover:scale-105"
            />
            {/* 背景のぼかしエフェクト */}
            <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-indigo-400 to-pink-400 blur-2xl opacity-30"></div>
          </div>
        )}

        {/* 記事本文 */}
        <div
          dangerouslySetInnerHTML={{ __html: safeHTML }}
          className="prose prose-lg mx-auto max-w-none text-slate-700 leading-relaxed"
        />
      </div>
    </main>

  );
};

export default Page;