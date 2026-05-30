import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pages, getPage, formatDate } from "@/lib/content";

export function generateStaticParams() {
  return pages.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getPage(params.slug);
  if (!page) return {};
  return { title: page.title, description: page.excerpt };
}

export default function StaticPage({ params }: { params: { slug: string } }) {
  const page = getPage(params.slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8 border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold leading-tight text-ink">
          {page.title}
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Last updated {formatDate(page.modified)}
        </p>
      </header>
      <div
        className="prose prose-stone"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </article>
  );
}
