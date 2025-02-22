"use client";
import type { Post } from "@/app/_types/Post";
import Link from "next/link";

type Props = {
  post: Post;
};

const AdminPostSummary: React.FC<Props> = (props) => {
    const { post } = props;
    return (
        <div className="group relative cursor-pointer overflow-hidden rounded-md border border-gray-200 bg-white shadow-md transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
            {/* 背景装飾 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-10 group-hover:opacity-15"></div>
    
            {/* コンテンツ */}
            <div className="relative p-4">
                {/* タイトル */}
                <div className="mb-2 text-lg font-bold text-gray-800 transition-colors group-hover:text-indigo-600">
                    {post.title}
                </div>
        
                {/* 管理画面へのリンク */}
                <Link href={`/admin/posts/${post.id}`} className="text-sm text-gray-600 underline hover:text-indigo-600">
                        管理画面で編集する
                </Link>
        
                {/* 下部のライン装飾 */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 group-hover:h-1 transition-all duration-300"></div>
            </div>
        </div>
    );
}

export default AdminPostSummary;