"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const schema = z.object({
  title: z.string().min(5, "タイトルは5文字以上必要です").max(100, "タイトルは100文字以内で入力してください"),
  content: z.string().min(20, "内容は20文字以上必要です"),
  coverImageURL: z.string().url("有効なURLを入力してください"),
  categoryIds: z.array(z.string()).min(1, "少なくとも1つのカテゴリを選択してください"),
});

type FormData = z.infer<typeof schema>;

const NewPostPage = () => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
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

  const selectedCategories = watch("categoryIds");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("カテゴリの取得に失敗しました", error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: FormData) => {
    setSuccessMessage("");

    try {
      const response = await axios.post("/api/admin/posts", data);
      if (response.status === 200) {
        setSuccessMessage("投稿が成功しました");
      }
    } catch (error) {
      console.error("投稿に失敗しました", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-6">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-extrabold text-indigo-600 mb-6">新しい投稿を作成</h1>

        {successMessage && <p className="mb-4 text-green-500 font-semibold">{successMessage}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">タイトル</label>
            <input
              type="text"
              {...register("title")}
              className="w-full rounded-md border px-4 py-2 focus:border-indigo-500 focus:ring"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">内容</label>
            <textarea
              {...register("content")}
              className="w-full h-40 rounded-md border px-4 py-2 focus:border-indigo-500 focus:ring"
            ></textarea>
            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">カバー画像URL</label>
            <input
              type="text"
              {...register("coverImageURL")}
              className="w-full rounded-md border px-4 py-2 focus:border-indigo-500 focus:ring"
            />
            {errors.coverImageURL && <p className="text-red-500 text-sm">{errors.coverImageURL.message}</p>}
            {watch("coverImageURL") && (
              <img
                src={watch("coverImageURL")}
                alt="Preview"
                className="mt-4 w-full rounded-md shadow-md"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">カテゴリ</label>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <Controller
                    name="categoryIds"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        value={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...field.value, category.id]
                            : field.value.filter((id) => id !== category.id);
                          setValue("categoryIds", newValue);
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring"
                      />
                    )}
                  />
                  <label className="ml-2 text-gray-700">{category.name}</label>
                </div>
              ))}
            </div>
            {errors.categoryIds && <p className="text-red-500 text-sm">{errors.categoryIds.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-bold shadow-md hover:bg-indigo-500"
          >
            投稿
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPostPage;
