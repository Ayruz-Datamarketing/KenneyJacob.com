# kenneyjacob.com — static archive

A faithful **static rebuild** of the blog *“Disruptive Technologies, Education
and Some Social Issues”* by **Kenney Jacob** (2007–2009), generated from the
original WordPress database backup (`wpau-db-backuptwtDABDB.zip`) and rendered
with **Next.js** (App Router, static export) + **Tailwind CSS**.

## What was in the backup

The archive is a **database-only** WordPress backup (the `wpau` /
*WordPress Database Backup* plugin) — a single gzipped MySQL dump from
`2009-03-29`. It contains **no image binaries**. Parsing the dump yielded:

| Content        | Count |
| -------------- | ----- |
| Published posts| 519   |
| Pages          | 3 (About Me, Guest Bloggers, Sitemap) |
| Categories     | 9     |
| Tags           | 692   |
| Image attachments referenced | 441 |
| (skipped) revisions / drafts | 1053 / 26 |

### Images

Because the dump has no media files and the original domain is offline, every
asset/link that pointed at the dead `kenneyjacob.com` domain is rewritten to the
**Internet Archive (Wayback Machine)** so it still renders in a browser
(`https://web.archive.org/web/2012id_/<original-url>`).

## Project layout

```
wpau-db-backuptwtDABDB.zip   # original backup (source of truth)
scripts/extract-content.py   # parses the SQL dump -> data/*.json
data/                        # generated content (committed)
  site.json posts.json pages.json categories.json tags.json
lib/content.ts               # typed loaders + helpers
components/                  # Header, Footer, PostCard, PostList, Pagination
app/                         # App Router routes (static export)
  page.tsx                   # home (paginated)
  page/[page]/               # home pagination
  posts/[slug]/              # single post  (519)
  [slug]/                    # WordPress pages (about, guest-bloggers, sitemap)
  category/[slug]/(page/..)  # category archives + pagination
  tag/[slug]/(page/..)       # tag archives + pagination
  archive/                   # full index by year + tag cloud
```

## Develop / build

```bash
npm install
npm run content     # regenerate data/*.json from the backup zip
npm run dev         # local dev server
npm run build       # static export -> ./out  (1300+ HTML pages)
```

The build emits a fully static site in `out/` that can be hosted on any static
host (GitHub Pages, Netlify, S3, …).

## On the SQL parser

The MySQL dump is parsed by a small, dependency-free tokenizer in
`scripts/extract-content.py` (handles quoted strings, escape sequences and
multi-row `INSERT … VALUES` statements). It parsed all 2045 `wp_posts` rows
cleanly, so no third-party parser was required. If a more complex dump ever
breaks it, well-maintained open-source alternatives include:

- **`wordpress-export-to-markdown`** — converts a WordPress WXR/XML export.
- **`mysqldump-to-csv` / `sql-dump-parser`** — generic dump parsers.
- Loading the dump into a throwaway **MariaDB/SQLite** instance and querying it.
