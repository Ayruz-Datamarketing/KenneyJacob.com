import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import { tags, postsByTag, pageCount, slicePage } from "@/lib/content";

export function generateStaticParams() {
  const params: { slug: string; page: string }[] = [];
  for (const t of tags) {
    const total = pageCount(postsByTag(t.slug).length);
    for (let p = 2; p <= total; p++) {
      params.push({ slug: t.slug, page: String(p) });
    }
  }
  return params;
}

export default function TagPaged({
  params,
}: {
  params: { slug: string; page: string };
}) {
  const tag = tags.find((t) => t.slug === params.slug);
  if (!tag) notFound();
  const page = Number(params.page);
  const list = postsByTag(tag.slug);
  const totalPages = pageCount(list.length);
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();

  return (
    <PostList
      posts={slicePage(list, page)}
      page={page}
      totalPages={totalPages}
      basePath={`/tag/${tag.slug}/`}
      heading={
        <header className="mb-8 border-b border-stone-200 pb-4">
          <p className="text-sm uppercase tracking-wide text-stone-500">Tag</p>
          <h1 className="text-3xl font-bold text-ink">#{tag.name}</h1>
        </header>
      }
    />
  );
}
