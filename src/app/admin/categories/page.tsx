"use client";
import { useState, useEffect } from "react";
import type { Category } from "@/app/_types/Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "isomorphic-dompurify";

// カテゴリ一覧表示 /admin/categories
const Page: React.FC = () => {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    
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
    
    if (fetchError) {
        return <div>{fetchError}</div>;
    }
    
    if (!categories) {
        return (
        <div className="text-gray-500">
            <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
            Loading...
        </div>
        );
    }
    
    return (
        <main>
        <div className="mb-2 text-2xl font-bold">カテゴリ一覧</div>
        <div className="space-y-3">
            {categories.map((category) => (
            <div key={category.id} className="p-3 border border-gray-300 rounded-md">
                <div className="text-lg font-bold">{category.name}</div>
            </div>
            ))}
        </div>
        </main>
    );
};

export default Page;