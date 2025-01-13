"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import PostSummary from "@/app/_components/PostSummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { headers } from "next/headers";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 環境変数から「APIキー」と「エンドポイント」を取得
  const apiBaseEp = process.env.NEXT_PUBLIC_MICROCMS_BASE_EP!;
  const apiKey = process.env.NEXT_PUBLIC_MICROCMS_API_KEY!;

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
  }, [apiBaseEp, apiKey]);

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
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 leading-tight mb-6">
        main
      </h1>
      <div className="space-y-3">
        {posts.map((post) => (
          <PostSummary key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Page;