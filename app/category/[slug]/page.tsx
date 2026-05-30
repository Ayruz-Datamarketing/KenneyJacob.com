import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import {
  categories,
  postsByCategory,
  pageCount,
  slicePage,
} from "@/lib/content";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const cat = categories.find((c) => c.slug === params.slug);
  return { title: cat ? `Category: ${cat.name}` : "Category" };
}

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) notFound();

  const list = postsByCategory(cat.slug);
  const totalPages = pageCount(list.length);

  return (
    <PostList
      posts={slicePage(list, 1)}
      page={1}
      totalPages={totalPages}
      basePath={`/category/${cat.slug}/`}
      heading={
        <header className="mb-8 border-b border-stone-200 pb-4">
          <p className="text-sm uppercase tracking-wide text-stone-500">
            Category
          </p>
          <h1 className="text-3xl font-bold text-ink">{cat.name}</h1>
          <p className="mt-1 text-sm text-stone-500">{list.length} posts</p>
        </header>
      }
    />
  );
}
