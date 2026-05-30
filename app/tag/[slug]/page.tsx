import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import { tags, postsByTag, pageCount, slicePage } from "@/lib/content";

export function generateStaticParams() {
  return tags.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const tag = tags.find((t) => t.slug === params.slug);
  return { title: tag ? `Tag: ${tag.name}` : "Tag" };
}

export default function TagPage({ params }: { params: { slug: string } }) {
  const tag = tags.find((t) => t.slug === params.slug);
  if (!tag) notFound();

  const list = postsByTag(tag.slug);
  const totalPages = pageCount(list.length);

  return (
    <PostList
      posts={slicePage(list, 1)}
      page={1}
      totalPages={totalPages}
      basePath={`/tag/${tag.slug}/`}
      heading={
        <header className="mb-8 border-b border-stone-200 pb-4">
          <p className="text-sm uppercase tracking-wide text-stone-500">Tag</p>
          <h1 className="text-3xl font-bold text-ink">#{tag.name}</h1>
          <p className="mt-1 text-sm text-stone-500">{list.length} posts</p>
        </header>
      }
    />
  );
}
