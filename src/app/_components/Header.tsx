"use client";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"; 
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header>
      <div className="bg-slate-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-2xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white"
          )}
        >
          <Link href="/">
            <a>
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              My Blog
            </a>
          </Link>
          <nav>
            <Link href="/about">
              <a className="mr-4">About</a>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;