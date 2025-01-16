"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import type { Category } from "@/app/_types/Category";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faBell } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [notification, setNotification] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const postsPerPage = 9;

  // Fetch posts and categories
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("記事の取得に失敗しました");
        }

        const data: Post[] = await res.json();
        setPosts(data);
        setCategories(data.flatMap((post) => post.categories));
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : "予期せぬエラーが発生しました");
      }
    };
    fetchPosts();
  }, []);

  // Handle delete post
  const handleDelete = async (id: string) => {
    if (!confirm("この投稿を削除してよろしいですか？")) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotification("投稿が削除されました。");
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      } else {
        setNotification("削除に失敗しました。");
      }
    } catch (error) {
      setNotification("削除中にエラーが発生しました。");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const displayedPosts = posts
    .filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((post) =>
      selectedCategory === "" ||
      post.categories.some((cat) => cat.name === selectedCategory)
    )
    .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  // Notification handler
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  if (fetchError) {
    return (
      <div className="text-red-500 text-center mt-6">
        <p>エラー: {fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded"
        >
          再読み込み
        </button>
      </div>
    );
  }

  return (
    <main
      className={`p-8 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold mb-4">
          管理画面
        </h1>
        <p className="text-lg">投稿一覧</p>

        <div className="flex justify-center gap-4 mt-4">
          <input
            type="text"
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">すべてのカテゴリ</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {notification && (
          <div className="mt-4 p-2 bg-green-500 text-white rounded">
            <FontAwesomeIcon icon={faBell} className="mr-2" />
            {notification}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedPosts.map((post) => (
          <div
            key={post.id}
            className="group relative overflow-hidden rounded-lg bg-white shadow-xl"
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {post.title}
              </h2>
              <p className="text-sm mb-4">
                カテゴリ: {post.categories.map((cat) => cat.name).join(", ") || "なし"}
              </p>
              <p className="text-sm mb-6">
                作成日: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between">
                <Link href={`/admin/posts/${post.id}`} className="text-indigo-600">編集</Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-500"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 mx-1 ${page === currentPage ? "bg-indigo-500 text-white" : "bg-gray-200"}`}
          >
            {page}
          </button>
        ))}
      </div>
    </main>
  );
};

export default Page;
