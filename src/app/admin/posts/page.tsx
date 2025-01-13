"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if(!res.ok) {
          throw new Error("記事の取得に失敗しました");
        }

        const data: Post[] = await res.json();
        setPosts(data);

      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      }
    };
    fetchPosts();
  }, []);
    
    const handleDelete = async (id: string) => {
        try {
        const res = await fetch(`/api/admin/posts/${id}`, {
            method: "DELETE",
        });
    
        if (res.ok) {
            const result = await res.json();
            console.log(result.msg || "投稿が削除されました。");
            setPosts((prevPosts) => prevPosts ? prevPosts.filter((post) => post.id !== id) : null);
        } else {
            const error = await res.json();
            console.error(error.error || "削除に失敗しました。");
        }
        } catch (error) {
            console.error("投稿の削除に失敗しました", error);
        }
    }

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!posts) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <main>
        {posts.map((post) => (
          <div className="group relative cursor-pointer overflow-hidden rounded-md border border-gray-300 bg-gray-50 shadow-sm transition-transform duration-150 hover:scale-[1.02] hover:shadow-md">
            {/* 背景装飾 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 opacity-20"></div>

            {/* コンテンツ */}
            <div className="relative p-4">
                {/* タイトル */}
                <div className="mb-3 text-lg font-bold text-gray-700 transition-colors group-hover:text-indigo-600">
                {post.title}
                </div>

                {/* 管理画面へのリンク */}
                <div className="flex items-center justify-between">
                <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-sm text-gray-600 underline hover:text-indigo-600"
                >
                    編集
                </Link>

                {/* 削除ボタン */}
                <button
                    onClick={() => handleDelete(post.id)}
                    className="rounded-md bg-red-500 px-3 py-1 text-sm text-white font-semibold shadow-sm hover:bg-red-400 transition duration-200"
                >
                    削除
                </button>
                </div>

                {/* 下部のライン装飾 */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 to-pink-400 group-hover:h-1 transition-all duration-300"></div>
            </div>
            </div>

        ))}
    </main>
  );
};

export default Page;