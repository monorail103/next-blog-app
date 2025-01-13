"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";

const PostEditPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error("記事の取得に失敗しました");
                }

                const data = await res.json();
                setTitle(data.title);
                setContent(data.content);
            } catch (e) {
                setMessage(e instanceof Error ? e.message : "予期せぬエラーが発生しました");
            }
        };

        fetchPost();
    }, [id]);

    const handleUpdate = async () => {
        setMessage("");
        try {
            const res = await fetch(`/api/admin/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content }),
            });

            if (res.ok) {
                const updatedPost = await res.json();
                setMessage(`投稿「${updatedPost.title}」が更新されました。`);
            } else {
                const error = await res.json();
                setMessage(error.error || "更新に失敗しました。");
            }
        } catch (error) {
            setMessage("投稿の更新に失敗しました。");
        }
    };

    const handleDelete = async () => {
        setMessage("");
        try {
            const res = await fetch(`/api/admin/posts/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                const result = await res.json();
                setMessage(result.msg || "投稿が削除されました。");
                router.push("/admin/posts");
            } else {
                const error = await res.json();
                setMessage(error.error || "削除に失敗しました。");
            }
        } catch (error) {
            setMessage("投稿の削除に失敗しました。");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-6">
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg">
                {/* タイトル */}
                <h1 className="text-2xl font-extrabold text-indigo-600 mb-6">投稿の編集</h1>

                {/* メッセージ */}
                {message && (
                    <p className={`mb-4 text-sm font-semibold ${message.includes("失敗") ? "text-red-500" : "text-green-500"}`}>
                        {message}
                    </p>
                )}

                {/* フォーム */}
                <div className="space-y-6">
                    {/* タイトル */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
                            placeholder="タイトルを入力してください"
                        />
                    </div>

                    {/* 内容 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-40 rounded-md border border-gray-300 px-4 py-2 text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
                            placeholder="内容を入力してください"
                        />
                    </div>

                    {/* ボタン群 */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="rounded-md bg-indigo-600 px-6 py-2 text-white font-bold shadow-md transition-all duration-300 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300"
                        >
                            更新
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="rounded-md bg-red-500 px-6 py-2 text-white font-bold shadow-md transition-all duration-300 hover:bg-red-400 focus:ring-2 focus:ring-red-300"
                        >
                            削除
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostEditPage;
