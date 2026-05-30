import Link from "next/link";
import { site } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-stone-500">
        <p>
          {site.counts.posts} posts &middot; {site.counts.pages} pages &middot;{" "}
          {site.years[0]}&ndash;{site.years[site.years.length - 1]}
        </p>
        <p className="mt-2">
          A static archive of{" "}
          <span className="font-medium text-stone-700">{site.title}</span> by{" "}
          {site.author}, rebuilt with Next.js from the original WordPress
          database. Images are served via the{" "}
          <a
            href="https://web.archive.org/"
            className="text-accent hover:underline"
          >
            Internet Archive
          </a>
          .
        </p>
        <p className="mt-2">
          <Link href="/guest-bloggers/" className="text-accent hover:underline">
            Guest Bloggers
          </Link>{" "}
          &middot;{" "}
          <Link href="/archive/" className="text-accent hover:underline">
            Full archive
          </Link>
        </p>
      </div>
    </footer>
  );
}
