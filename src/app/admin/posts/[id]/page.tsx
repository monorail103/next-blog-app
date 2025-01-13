"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const schema = z.object({
    title: z.string().min(5, "タイトルは5文字以上必要です").max(100, "タイトルは100文字以内で入力してください"),
    content: z.string().min(20, "内容は20文字以上必要です"),
    coverImageURL: z.string().url("有効なURLを入力してください"),
    categoryIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

const PostEditPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            content: "",
            coverImageURL: "",
            categoryIds: [],
        },
    });

    useEffect(() => {
        const fetchPostAndCategories = async () => {
            try {
                const [postResponse, categoriesResponse] = await Promise.all([
                    axios.get(`/api/posts/${id}`),
                    axios.get("/api/categories"),
                ]);

                const { title, content, coverImageURL, categories: postCategories } = postResponse.data;
                const selectedCategoryIds = postCategories.map((cat: { category: { id: string } }) => cat.category.id);

                setValue("title", title);
                setValue("content", content);
                setValue("coverImageURL", coverImageURL);
                setValue("categoryIds", selectedCategoryIds);

                setCategories(categoriesResponse.data);
            } catch (error) {
                console.error("データの取得に失敗しました", error);
            }
        };

        fetchPostAndCategories();
    }, [id, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.put(`/api/admin/posts/${id}`, data);
            alert(`投稿「${response.data.title}」が更新されました。`);
        } catch (error) {
            console.error("更新に失敗しました", error);
            alert("更新に失敗しました。");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-6">
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg">
                <h1 className="text-2xl font-extrabold text-indigo-600 mb-6">投稿の編集</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
                                    placeholder="タイトルを入力してください"
                                />
                            )}
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="w-full h-40 rounded-md border border-gray-300 px-4 py-2 text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
                                    placeholder="内容を入力してください"
                                />
                            )}
                        />
                        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">カバー画像URL</label>
                        <Controller
                            name="coverImageURL"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
                                    placeholder="カバー画像のURLを入力してください"
                                />
                            )}
                        />
                        {errors.coverImageURL && <p className="text-red-500 text-sm">{errors.coverImageURL.message}</p>}
                        {watch("coverImageURL") && (
                            <img
                                src={watch("coverImageURL")}
                                alt="Cover"
                                className="mt-4 w-full rounded-md shadow-md"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">カテゴリ</label>
                        <div className="grid grid-cols-2 gap-4">
                            {categories.map((category) => {
                                const selectedCategories = watch("categoryIds") || [];
                                return (
                                    <div key={category.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={category.id}
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={(e) => {
                                                const currentValues = getValues("categoryIds") || [];
                                                const newValue = e.target.checked
                                                    ? [...currentValues, category.id]
                                                    : currentValues.filter((id) => id !== category.id);
                                                setValue("categoryIds", newValue);
                                            }}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring"
                                        />
                                        <label className="ml-2 text-gray-700">{category.name}</label>
                                    </div>
                                );
                            })}
                        </div>
                        {errors.categoryIds && <p className="text-red-500 text-sm">{errors.categoryIds.message}</p>}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-6 py-2 text-white font-bold shadow-md transition-all duration-300 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300"
                        >
                            更新
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostEditPage;
