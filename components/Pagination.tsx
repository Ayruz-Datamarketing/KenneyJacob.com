import Link from "next/link";

export default function Pagination({
  current,
  total,
  basePath,
}: {
  current: number;
  total: number;
  basePath: string; // e.g. "/" or "/category/tech/"
}) {
  if (total <= 1) return null;

  const href = (p: number) => {
    if (p <= 1) return basePath;
    return `${basePath}page/${p}/`;
  };

  return (
    <nav className="mt-10 flex items-center justify-between text-sm">
      <div>
        {current > 1 && (
          <Link
            href={href(current - 1)}
            className="rounded border border-stone-300 px-3 py-2 text-stone-700 hover:border-accent hover:text-accent"
          >
            &larr; Newer
          </Link>
        )}
      </div>
      <span className="text-stone-500">
        Page {current} of {total}
      </span>
      <div>
        {current < total && (
          <Link
            href={href(current + 1)}
            className="rounded border border-stone-300 px-3 py-2 text-stone-700 hover:border-accent hover:text-accent"
          >
            Older &rarr;
          </Link>
        )}
      </div>
    </nav>
  );
}
