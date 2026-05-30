import Link from "next/link";
import { type Post, formatDate } from "@/lib/content";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="border-b border-stone-200 pb-8">
      <h2 className="text-xl font-bold leading-snug">
        <Link
          href={`/posts/${post.slug}/`}
          className="text-ink hover:text-accent"
        >
          {post.title}
        </Link>
      </h2>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-stone-500">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.author && <span>by {post.author}</span>}
        {post.categories.length > 0 && (
          <span className="flex flex-wrap gap-x-2">
            {post.categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}/`}
                className="hover:text-accent"
              >
                {c.name}
              </Link>
            ))}
          </span>
        )}
      </div>
      <p className="mt-3 text-stone-700">{post.excerpt}</p>
      <Link
        href={`/posts/${post.slug}/`}
        className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
      >
        Read more &rarr;
      </Link>
    </article>
  );
}
