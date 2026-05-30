import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost, formatDate } from "@/lib/content";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8 border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold leading-tight text-ink">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 text-sm text-stone-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.author && <span>by {post.author}</span>}
          {post.commentCount > 0 && <span>{post.commentCount} comments</span>}
        </div>
        {post.categories.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {post.categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}/`}
                className="rounded bg-stone-100 px-2 py-0.5 text-stone-600 hover:text-accent"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-stone prose-img:mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags.length > 0 && (
        <div className="mt-10 border-t border-stone-200 pt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {post.tags.map((t) => (
              <Link
                key={t.slug}
                href={`/tag/${t.slug}/`}
                className="rounded border border-stone-200 px-2 py-0.5 text-stone-600 hover:border-accent hover:text-accent"
              >
                #{t.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link href="/" className="text-sm font-medium text-accent hover:underline">
          &larr; Back to home
        </Link>
      </div>
    </article>
  );
}
