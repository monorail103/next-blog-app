"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { twMerge } from "tailwind-merge";

const Page: React.FC = () => {
  return (
    <main className="min-h-screen py-10">
      {/* セクションタイトル */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
          About the Author
        </h1>
      </div>

      {/* アバター */}
      <div className="flex flex-col items-center">
        <div
          className="relative mx-auto mb-5 w-48 h-48 md:w-64 md:h-64"
        >
          <Image
            src="/images/avatar.jpg"
            alt="Author's Avatar"
            width={350}
            height={350}
            priority
            className="rounded-full border-4 border-indigo-500 p-2 shadow-lg transition-transform duration-300 hover:scale-105"
          />
          {/* アバターの背景エフェクト */}
          <div className="absolute inset-0 z-[-1] rounded-full bg-gradient-to-r from-indigo-400 to-pink-400 blur-lg"></div>
        </div>
      </div>

      {/* 著者の情報 */}
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="text-lg text-slate-600 leading-relaxed">
          Hi there! I'm <span className="font-bold text-indigo-600">monorail103</span>, the author of this blog.
          I love sharing knowledge about technology, design, and everything in between. When I'm not coding, you can find me enjoying a cup of coffee or exploring new places.
        </p>
      </div>

      {/* ソーシャルリンク */}
      <div className="mt-10 flex justify-center space-x-6">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-400 transition-colors"
        >
          <FontAwesomeIcon icon={faTwitter as IconProp} className="text-2xl" />
        </a>
        <a
          href="https://github.com/monorail103"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-400 transition-colors"
        >
          <FontAwesomeIcon icon={faGithub as IconProp} className="text-2xl" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-400 transition-colors"
        >
          <FontAwesomeIcon icon={faLinkedin as IconProp} className="text-2xl" />
        </a>
      </div>
    </main>

  );
};

export default Page;