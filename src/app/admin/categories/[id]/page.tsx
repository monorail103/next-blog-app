"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Category } from "@/app/_types/Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

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

      const data: Category = await res.json();
      setName(data.name);
      alert("カテゴリが更新されました");
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
    <main>
      <h1>カテゴリ編集</h1>
      <div>
        <label>
          名前:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleUpdate}>更新</button>
      <button onClick={handleDelete}>削除</button>
    </main>
  );
};

export default Page;