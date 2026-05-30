import Link from "next/link";
import { site, categories } from "@/lib/content";

export default function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col gap-1">
          <Link href="/" className="text-2xl font-bold tracking-tight text-ink">
            {site.title}
          </Link>
          {site.description && (
            <p className="text-sm text-stone-500">{site.description}</p>
          )}
        </div>
        <nav className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
          <Link href="/" className="text-stone-700 hover:text-accent">
            Home
          </Link>
          <Link href="/about/" className="text-stone-700 hover:text-accent">
            About
          </Link>
          <Link href="/archive/" className="text-stone-700 hover:text-accent">
            Archive
          </Link>
          <span className="text-stone-300">|</span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}/`}
              className="text-stone-600 hover:text-accent"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
