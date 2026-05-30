import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import { posts, pageCount, slicePage } from "@/lib/content";

export function generateStaticParams() {
  const total = pageCount(posts.length);
  // page 1 is served by the root route
  return Array.from({ length: total - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
}

export default function PaginatedHome({
  params,
}: {
  params: { page: string };
}) {
  const page = Number(params.page);
  const totalPages = pageCount(posts.length);
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();

  return (
    <PostList
      posts={slicePage(posts, page)}
      page={page}
      totalPages={totalPages}
      basePath="/"
    />
  );
}
