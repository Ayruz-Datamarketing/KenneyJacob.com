import PostList from "@/components/PostList";
import { posts, pageCount, slicePage } from "@/lib/content";

export default function Home() {
  const totalPages = pageCount(posts.length);
  return (
    <PostList
      posts={slicePage(posts, 1)}
      page={1}
      totalPages={totalPages}
      basePath="/"
    />
  );
}
