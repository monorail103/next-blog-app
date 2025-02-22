"use client";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/utils/supabase"; // ◀ 追加
import { useAuth } from "@/app/_hooks/useAuth"; // ◀ 追加
import { useRouter } from "next/navigation"; // ◀ 追加
import Link from "next/link";

const Header: React.FC = () => {
  const router = useRouter();
  const { isLoading, session } = useAuth();
  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <header>
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-4 shadow-md">
        <div
          className={twMerge(
            "mx-4 max-w-4xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white"
          )}
        >
          {/* 左側のロゴ */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="mr-2 text-2xl text-white"
            />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400">
              My Blog
            </span>
          </Link>



          {/* ナビゲーション */}
          <nav className="flex space-x-6 text-white">
            <Link
              href="/about"
              className="relative transition-all duration-300 hover:underline hover:text-blue-200"
            >
              About
            </Link>
            {!isLoading &&
              (session ? (
                <button onClick={logout}>Logout</button>
              ) : (
                <Link href="/login">Login</Link>
              ))}
          </nav>
        </div>
      </div>
    </header>

  );
};

export default Header;