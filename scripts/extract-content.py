#!/usr/bin/env python3
"""Extract WordPress content from the wpau DB backup zip into JSON data files
for the Next.js site.

Reads:  wpau-db-backuptwtDABDB.zip  (database-only WordPress backup, 2009)
Writes: data/site.json, data/posts.json, data/pages.json,
        data/categories.json, data/tags.json

Notes
-----
* The backup contains no image binaries (DB only), so image/asset URLs that
  point at the now-dead original domains are rewritten to the Wayback Machine
  so they still render in a browser.
* WordPress stores post_content without paragraph tags (wpautop runs at render
  time), so a lightweight wpautop is applied here.
"""
import gzip
import io
import json
import os
import re
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZIP = os.path.join(ROOT, "wpau-db-backuptwtDABDB.zip")
DATA = os.path.join(ROOT, "data")

WAYBACK = "https://web.archive.org/web/2012id_/"      # raw asset replay
WAYBACK_PAGE = "https://web.archive.org/web/2012/"    # page replay
DEAD_DOMAINS = ("kenneyjacob.com",)


def load_sql():
    with zipfile.ZipFile(ZIP) as z:
        name = [n for n in z.namelist() if n.endswith(".sql.gz")][0]
        with z.open(name) as f:
            return gzip.decompress(f.read()).decode("latin-1")


# ---------------------------------------------------------------------------
# Minimal but robust MySQL-dump INSERT parser
# ---------------------------------------------------------------------------
def parse_insert(data, table):
    rows = []
    pat = "INSERT INTO `%s` VALUES " % table
    idx = 0
    while True:
        start = data.find(pat, idx)
        if start == -1:
            break
        i = start + len(pat)
        while i < len(data):
            c = data[i]
            if c == "(":
                tup, i = _parse_tuple(data, i)
                rows.append(tup)
            elif c == ";":
                i += 1
                break
            else:
                i += 1
        idx = i
    return rows


def _parse_tuple(s, i):
    i += 1  # skip '('
    vals = []
    while i < len(s):
        c = s[i]
        if c in " \n\r\t":
            i += 1
            continue
        if c == "'":
            i += 1
            buf = []
            while i < len(s):
                cc = s[i]
                if cc == "\\":
                    nxt = s[i + 1]
                    buf.append({"n": "\n", "r": "\r", "t": "\t", "0": "\0",
                                "\\": "\\", "'": "'", '"': '"'}.get(nxt, nxt))
                    i += 2
                    continue
                if cc == "'":
                    i += 1
                    break
                buf.append(cc)
                i += 1
            vals.append("".join(buf))
            while i < len(s) and s[i] in " \n\r\t":
                i += 1
            if i < len(s) and s[i] == ",":
                i += 1
            continue
        if c == ")":
            i += 1
            return vals, i
        buf = []
        while i < len(s) and s[i] not in ",)":
            buf.append(s[i])
            i += 1
        tok = "".join(buf).strip()
        vals.append(None if tok == "NULL" else tok)
        if i < len(s) and s[i] == ",":
            i += 1
    return vals, i


POST_COLS = ["ID", "post_author", "post_date", "post_date_gmt", "post_content",
             "post_title", "post_category", "post_excerpt", "post_status",
             "comment_status", "ping_status", "post_password", "post_name",
             "to_ping", "pinged", "post_modified", "post_modified_gmt",
             "post_content_filtered", "post_parent", "guid", "menu_order",
             "post_type", "post_mime_type", "comment_count"]


# ---------------------------------------------------------------------------
# Content transforms
# ---------------------------------------------------------------------------
def rewrite_urls(html):
    """Point dead-domain assets/links at the Wayback Machine."""
    def repl(m):
        attr, url = m.group(1), m.group(2)
        if any(d in url for d in DEAD_DOMAINS) and url.startswith("http"):
            base = WAYBACK if attr == "src" else WAYBACK_PAGE
            return '%s="%s%s"' % (attr, base, url)
        return m.group(0)

    return re.sub(r'(src|href)="([^"]+)"', repl, html)


BLOCK_RE = re.compile(r"</?(p|div|ul|ol|li|blockquote|pre|h[1-6]|table|tr|td|"
                      r"th|thead|tbody|img|figure|iframe|object|embed|hr|"
                      r"script|style)\b", re.I)


def wpautop(text):
    """A small subset of WordPress' wpautop: turn blank-line-separated blocks
    into <p>, single newlines into <br>, while leaving existing block markup
    alone."""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # protect existing block-level chunks by not wrapping them
    blocks = re.split(r"\n\s*\n", text.strip())
    out = []
    for b in blocks:
        b = b.strip()
        if not b:
            continue
        if BLOCK_RE.search(b) and re.match(r"^\s*<", b):
            out.append(b)
        else:
            out.append("<p>" + b.replace("\n", "<br />\n") + "</p>")
    return "\n\n".join(out)


def excerpt_from(html, n=55):
    txt = re.sub(r"<[^>]+>", " ", html)
    txt = re.sub(r"\s+", " ", txt).strip()
    words = txt.split(" ")
    return " ".join(words[:n]) + ("…" if len(words) > n else "")


# ---------------------------------------------------------------------------
def main():
    os.makedirs(DATA, exist_ok=True)
    data = load_sql()

    posts_raw = [dict(zip(POST_COLS, r)) for r in parse_insert(data, "wp_posts")
                 if len(r) == len(POST_COLS)]

    # options -> site meta
    opts = {r[2]: r[3] for r in parse_insert(data, "wp_options") if len(r) >= 4}

    # users -> author display names
    users = parse_insert(data, "wp_users")
    authors = {r[0]: (r[-1] or r[3] or r[1]) for r in users if r}

    # taxonomy
    terms = parse_insert(data, "wp_terms")        # term_id, name, slug, group
    tname = {r[0]: r[1] for r in terms}
    tslug = {r[0]: r[2] for r in terms}
    tt = parse_insert(data, "wp_term_taxonomy")   # ttid, term_id, tax, desc, parent, count
    tt_by_id = {}
    cats, tags = {}, {}
    for r in tt:
        ttid, term_id, tax = r[0], r[1], r[2]
        tt_by_id[ttid] = (term_id, tax)
        rec = {"name": tname.get(term_id, ""), "slug": tslug.get(term_id, ""),
               "count": 0}
        if tax == "category":
            cats[ttid] = rec
        elif tax == "post_tag":
            tags[ttid] = rec

    rel = parse_insert(data, "wp_term_relationships")  # object_id, ttid, order
    post_terms = {}
    for r in rel:
        oid, ttid = r[0], r[1]
        post_terms.setdefault(oid, []).append(ttid)

    # build posts / pages
    posts, pages = [], []
    for p in posts_raw:
        if p["post_status"] not in ("publish",):
            continue
        if p["post_type"] not in ("post", "page"):
            continue
        content = wpautop(rewrite_urls(p["post_content"]))
        excerpt = (p["post_excerpt"].strip() and
                   wpautop(rewrite_urls(p["post_excerpt"]))) or None
        item = {
            "id": int(p["ID"]),
            "title": p["post_title"] or "(untitled)",
            "slug": p["post_name"] or ("post-" + p["ID"]),
            "date": p["post_date"],
            "modified": p["post_modified"],
            "author": authors.get(p["post_author"], "Kenney Jacob"),
            "content": content,
            "excerpt": excerpt or excerpt_from(content),
            "commentCount": int(p["comment_count"] or 0),
        }
        if p["post_type"] == "page":
            pages.append(item)
            continue

        pcats, ptags = [], []
        for ttid in post_terms.get(p["ID"], []):
            if ttid in cats:
                cats[ttid]["count"] += 1
                pcats.append({"name": cats[ttid]["name"], "slug": cats[ttid]["slug"]})
            elif ttid in tags:
                tags[ttid]["count"] += 1
                ptags.append({"name": tags[ttid]["name"], "slug": tags[ttid]["slug"]})
        item["categories"] = pcats
        item["tags"] = ptags
        posts.append(item)

    posts.sort(key=lambda x: x["date"], reverse=True)
    pages.sort(key=lambda x: x["slug"])

    cat_list = sorted((c for c in cats.values() if c["count"]),
                      key=lambda x: -x["count"])
    tag_list = sorted((t for t in tags.values() if t["count"]),
                      key=lambda x: -x["count"])

    site = {
        "title": opts.get("blogname", "Kenney Jacob"),
        "description": opts.get("blogdescription", ""),
        "author": "Kenney Jacob",
        "originalUrl": opts.get("siteurl", "http://www.kenneyjacob.com"),
        "postsPerPage": 10,
        "years": sorted({p["date"][:4] for p in posts}),
        "counts": {"posts": len(posts), "pages": len(pages),
                   "categories": len(cat_list), "tags": len(tag_list)},
    }

    def dump(name, obj):
        with open(os.path.join(DATA, name), "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=1)

    dump("site.json", site)
    dump("posts.json", posts)
    dump("pages.json", pages)
    dump("categories.json", cat_list)
    dump("tags.json", tag_list)

    print("posts:", len(posts), "pages:", len(pages),
          "categories:", len(cat_list), "tags:", len(tag_list))


if __name__ == "__main__":
    main()
