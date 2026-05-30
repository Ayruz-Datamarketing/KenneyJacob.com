import Link from "next/link";
import { postsByYear, tags, formatDate } from "@/lib/content";

export const metadata = { title: "Archive" };

export default function ArchivePage() {
  const byYear = postsByYear();
  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-ink">Archive</h1>
      <p className="mt-2 text-stone-500">
        Every post, oldest themes to newest, organised by year.
      </p>

      {years.map((year) => (
        <section key={year} className="mt-10">
          <h2 className="mb-3 border-b border-stone-200 pb-1 text-2xl font-bold text-accent">
            {year}
          </h2>
          <ul className="space-y-2">
            {byYear[year].map((p) => (
              <li key={p.id} className="flex gap-3 text-sm">
                <span className="w-28 shrink-0 text-stone-400">
                  {formatDate(p.date)}
                </span>
                <Link
                  href={`/posts/${p.slug}/`}
                  className="text-stone-800 hover:text-accent"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mt-12">
        <h2 className="mb-3 border-b border-stone-200 pb-1 text-xl font-bold text-ink">
          Tags
        </h2>
        <div className="flex flex-wrap gap-2 text-sm">
          {tags.map((t) => (
            <Link
              key={t.slug}
              href={`/tag/${t.slug}/`}
              className="rounded border border-stone-200 px-2 py-0.5 text-stone-600 hover:border-accent hover:text-accent"
            >
              {t.name}
              <span className="ml-1 text-stone-400">{t.count}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
