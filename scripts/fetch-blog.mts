#!/usr/bin/env node
// @ts-nocheck
/* eslint-disable */
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const POSTS_DIR = path.resolve(process.cwd(), 'posts');
const OUT_DIR = path.resolve(process.cwd(), 'data/sources');

async function readMarkdownFiles(dir: string) {
  let entries: any[] = [];
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx') && !file.endsWith('.markdown')) continue;
      const full = path.join(dir, file);
      const raw = await fs.readFile(full, 'utf8');
      const parsed = matter(raw);
      const fm: any = parsed.data ?? {};
      const content = parsed.content ?? '';
      const html = marked.parse(content) as string;
      const slug = fm.slug || file.replace(/\.(md|mdx|markdown)$/i, '');
      const timestamp = fm.date || fm.published || fm.created || new Date().toISOString();
      const url = fm.permalink || `/posts/${slug}`;
      entries.push({
        id: `blog:${slug}`,
        type: 'blog',
        source: 'markdown',
        timestamp,
        title: fm.title || slug,
        summary: fm.description || '',
        url,
        tags: fm.tags || [],
        content_html: html,
        author: fm.author ? { name: fm.author } : undefined,
      });
    }
  } catch (err: any) {
    if (err?.code === 'ENOENT') return entries;
    throw err;
  }
  return entries;
}

await fs.mkdir(OUT_DIR, { recursive: true });
const posts = await readMarkdownFiles(POSTS_DIR);
await fs.writeFile(path.join(OUT_DIR, 'blog.json'), JSON.stringify(posts, null, 2));
console.log(`Saved ${posts.length} blog entries.`);

