"use client";
import { useState, useEffect } from "react";
import type { Category } from "@/app/_types/Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`/api/categories`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error("カテゴリの取得に失敗しました");
                }

                const data: Category[] = await res.json();
                setCategories(data);
            } catch (e) {
                setFetchError(
                    e instanceof Error ? e.message : "予期せぬエラーが発生しました"
                );
            }
        };
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("このカテゴリを削除してよろしいですか？")) return;

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("カテゴリの削除に失敗しました");
            }

            setCategories(categories?.filter((category) => category.id !== id) || null);
        } catch (e) {
            setFetchError(
                e instanceof Error ? e.message : "予期せぬエラーが発生しました"
            );
        }
    };

    const filteredCategories = categories?.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 min-h-screen">
            {fetchError && (
                <p className="text-red-500 text-center font-semibold text-lg mb-4">
                    {fetchError}
                </p>
            )}

            {!categories ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-gray-500 text-4xl" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Categories</h1>
                    <a href="/admin/categories/new" className="text-blue-500 hover:text-blue-700 transition mb-4 block">
                        カテゴリを追加
                    </a>
                    <input
                        type="text"
                        placeholder="検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    />
                    <ul className="divide-y divide-gray-200">
                        {filteredCategories?.length ? (
                            filteredCategories.map((category) => (
                                <li
                                    key={category.id}
                                    className="flex justify-between items-center py-4 hover:bg-gray-50 transition duration-150 ease-in-out"
                                >
                                    <span className="text-gray-700 font-medium text-lg">
                                        {category.name}
                                    </span>
                                    <div className="flex items-center space-x-4">
                                        <a
                                            href={`/admin/categories/${category.id}`}
                                            className="text-blue-500 hover:text-blue-700 transition font-medium"
                                        >
                                            編集
                                        </a>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
                                        >
                                            削除
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">該当するカテゴリがありません。</p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Page;
