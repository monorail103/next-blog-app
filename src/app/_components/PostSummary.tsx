"use client";
import type { Post } from "@/app/_types/Post";
import Link from "next/link";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = (props) => {
  const { post } = props;
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="border border-slate-400 p-3">
        <div className="font-bold">{post.title}</div>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </Link>
  );
};

export default PostSummary;