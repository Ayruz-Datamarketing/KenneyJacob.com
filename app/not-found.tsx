import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl py-20 text-center">
      <h1 className="text-4xl font-bold text-ink">404</h1>
      <p className="mt-3 text-stone-600">
        That page isn&rsquo;t part of this archive.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-accent hover:underline"
      >
        &larr; Back to home
      </Link>
    </div>
  );
}
