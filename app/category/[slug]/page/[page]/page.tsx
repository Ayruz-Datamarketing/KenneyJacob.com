import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import {
  categories,
  postsByCategory,
  pageCount,
  slicePage,
} from "@/lib/content";

export function generateStaticParams() {
  const params: { slug: string; page: string }[] = [];
  for (const c of categories) {
    const total = pageCount(postsByCategory(c.slug).length);
    for (let p = 2; p <= total; p++) {
      params.push({ slug: c.slug, page: String(p) });
    }
  }
  return params;
}

export default function CategoryPaged({
  params,
}: {
  params: { slug: string; page: string };
}) {
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) notFound();
  const page = Number(params.page);
  const list = postsByCategory(cat.slug);
  const totalPages = pageCount(list.length);
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();

  return (
    <PostList
      posts={slicePage(list, page)}
      page={page}
      totalPages={totalPages}
      basePath={`/category/${cat.slug}/`}
      heading={
        <header className="mb-8 border-b border-stone-200 pb-4">
          <p className="text-sm uppercase tracking-wide text-stone-500">
            Category
          </p>
          <h1 className="text-3xl font-bold text-ink">{cat.name}</h1>
        </header>
      }
    />
  );
}
