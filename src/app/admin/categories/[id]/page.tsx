"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Category } from "@/app/_types/Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Page: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("カテゴリの更新に失敗しました");
      }

      const updatedCategory = (await res.json()) as Category;
      alert("カテゴリが更新されました");
      router.push(`/admin/categories`);

    } catch (e) {
      alert(e instanceof Error ? e.message : "予期せぬエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("カテゴリの削除に失敗しました");
      }

      alert("カテゴリが削除されました");
      router.push("/admin/categories");
    } catch (e) {
      alert(e instanceof Error ? e.message : "予期せぬエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  return (
    <main className="min-h-screen py-10 px-6">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        {/* タイトル */}
        <h1 className="text-2xl font-extrabold text-indigo-600 mb-6">カテゴリ編集</h1>

        {/* フォーム */}
        <form>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              名前:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="カテゴリ名を入力"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* ボタン群 */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleUpdate}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-bold shadow-md transition-all duration-300 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300"
            >
              更新
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full rounded-md bg-red-500 px-4 py-2 text-white font-bold shadow-md transition-all duration-300 hover:bg-red-400 focus:ring-2 focus:ring-red-300"
            >
              削除
            </button>
          </div>
        </form>
      </div>
      <Link href="/admin/categories/new">
        <div className="mt-6 flex justify-center">
          <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 font-bold shadow-md transition-all duration-300 hover:bg-gray-300 focus:ring-2 focus:ring-gray-300">
            カテゴリ一覧に戻る
          </button>
        </div>
      </Link>
    </main>

  );
};

export default Page;