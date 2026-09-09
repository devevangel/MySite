import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { estimateReadMinutes } from './readtime.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, '..', 'content');

marked.setOptions({ gfm: true, breaks: false });

function linkifyCitations(html) {
  return html.replace(/\[(\d+)\]/g, '<sup class="citation"><a href="#ref-$1">[$1]</a></sup>');
}

function sortByDateDesc(a, b) {
  return new Date(b.published) - new Date(a.published);
}

function parsePostFile(filePath, section) {
  const raw = readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(raw);

  const slug = frontmatter.slug || filePath.split(/[/\\]/).pop().replace(/\.md$/, '');
  const status = frontmatter.status || 'draft';
  const readMinutes = estimateReadMinutes(content);

  let html = marked.parse(content);
  if (section === 'civic') {
    html = linkifyCitations(html);
  }

  return {
    ...frontmatter,
    slug,
    section: frontmatter.section || section,
    status,
    content,
    html,
    readMinutes,
    published: frontmatter.published || '1970-01-01',
    summary: frontmatter.summary || '',
    title: frontmatter.title || slug,
    sources: frontmatter.sources || [],
    tags: frontmatter.tags || [],
  };
}

export function loadPosts(section, { includeDrafts = false } = {}) {
  const dir = join(contentDir, section);
  if (!existsSync(dir)) return [];

  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  return files
    .map((f) => parsePostFile(join(dir, f), section))
    .filter((p) => includeDrafts || p.status === 'published')
    .sort(sortByDateDesc);
}

export function getPost(section, slug, { includeDrafts = false } = {}) {
  const posts = loadPosts(section, { includeDrafts });
  return posts.find((p) => p.slug === slug) || null;
}

export function loadAllPosts(options = {}) {
  return [...loadPosts('tech', options), ...loadPosts('civic', options)];
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function collectPostTags(posts) {
  const counts = new Map();
  for (const post of posts) {
    for (const tag of post.tags || []) {
      const label = String(tag).trim();
      if (!label) continue;
      counts.set(label, (counts.get(label) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }));
}

export function resolvePostTag(tags, raw) {
  const wanted = String(raw || '').trim().toLowerCase();
  if (!wanted) return '';
  const match = tags.find((entry) => entry.tag.toLowerCase() === wanted);
  return match ? match.tag : String(raw).trim();
}

export function filterPosts(posts, { q = '', tag = '' } = {}) {
  const words = normalizeSearchText(q).split(/\s+/).filter(Boolean);
  const wanted = String(tag || '').trim().toLowerCase();

  return posts.filter((post) => {
    if (wanted && !(post.tags || []).some((item) => String(item).trim().toLowerCase() === wanted)) {
      return false;
    }
    if (!words.length) return true;
    const hay = normalizeSearchText([
      post.title,
      post.summary,
      ...(post.tags || []),
    ].join(' '));
    return words.every((word) => hay.includes(word));
  });
}

export function paginateItems(items, page, perPage) {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage) || 1);
  const current = Math.min(Math.max(1, Number(page) || 1), pageCount);
  const start = (current - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: current,
    pageCount,
    total,
    perPage,
  };
}
