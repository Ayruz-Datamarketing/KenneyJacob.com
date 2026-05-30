import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { type Post } from "@/lib/content";

export default function PostList({
  posts,
  page,
  totalPages,
  basePath,
  heading,
}: {
  posts: Post[];
  page: number;
  totalPages: number;
  basePath: string;
  heading?: React.ReactNode;
}) {
  return (
    <div>
      {heading}
      <div className="space-y-8">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      <Pagination current={page} total={totalPages} basePath={basePath} />
    </div>
  );
}
