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
