import postsData from "@/data/posts.json";
import pagesData from "@/data/pages.json";
import categoriesData from "@/data/categories.json";
import tagsData from "@/data/tags.json";
import siteData from "@/data/site.json";

export type Term = { name: string; slug: string };

export type Post = {
  id: number;
  title: string;
  slug: string;
  date: string;
  modified: string;
  author: string;
  content: string;
  excerpt: string;
  commentCount: number;
  categories: Term[];
  tags: Term[];
};

export type Page = {
  id: number;
  title: string;
  slug: string;
  date: string;
  modified: string;
  author: string;
  content: string;
  excerpt: string;
  commentCount: number;
};

export type TermWithCount = Term & { count: number };

export const site = siteData as {
  title: string;
  description: string;
  author: string;
  originalUrl: string;
  postsPerPage: number;
  years: string[];
  counts: { posts: number; pages: number; categories: number; tags: number };
};

export const posts = postsData as Post[];
export const pages = pagesData as Page[];
export const categories = categoriesData as TermWithCount[];
export const tags = tagsData as TermWithCount[];

export const POSTS_PER_PAGE = site.postsPerPage || 10;

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPage(slug: string): Page | undefined {
  return pages.find((p) => p.slug === slug);
}

export function postsByCategory(slug: string): Post[] {
  return posts.filter((p) => p.categories.some((c) => c.slug === slug));
}

export function postsByTag(slug: string): Post[] {
  return posts.filter((p) => p.tags.some((t) => t.slug === slug));
}

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
}

export function slicePage(list: Post[], page: number): Post[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return list.slice(start, start + POSTS_PER_PAGE);
}

export function formatDate(d: string): string {
  const date = new Date(d.replace(" ", "T"));
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function postsByYear(): Record<string, Post[]> {
  const out: Record<string, Post[]> = {};
  for (const p of posts) {
    const y = p.date.slice(0, 4);
    (out[y] ||= []).push(p);
  }
  return out;
}
