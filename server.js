import 'dotenv/config';
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadSiteData } from './lib/data.js';
import { loadPosts, getPost } from './lib/content.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.static(join(__dirname, 'public')));

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatYearMonth(ym) {
  if (!ym) return '';
  const [year, month] = ym.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return month ? `${months[parseInt(month, 10) - 1]} ${year}` : year;
}

function locals(req, extra = {}) {
  const data = loadSiteData();
  return {
    profile: data.profile,
    site: data.site,
    formatDate,
    formatYearMonth,
    isDev,
    preview: req.query.preview === '1' && isDev,
    ...extra,
  };
}

function allowDrafts(req) {
  return isDev && req.query.preview === '1';
}

function absoluteUrl(req, path) {
  const proto = req.get('x-forwarded-proto') || req.protocol;
  return `${proto}://${req.get('host')}${path}`;
}

function sortCareerEntries(entries) {
  return [...entries].sort((a, b) => b.start.localeCompare(a.start));
}

function sortTimelineEntries(entries) {
  const sortKey = (entry) => entry.end || entry.start;
  return [...entries].sort((a, b) => {
    const aCurrent = !a.end && (a.type === 'role' || a.type === 'project');
    const bCurrent = !b.end && (b.type === 'role' || b.type === 'project');
    if (aCurrent && !bCurrent) return -1;
    if (!aCurrent && bCurrent) return 1;
    if (aCurrent && bCurrent) {
      if (a.type === 'role' && b.type !== 'role') return -1;
      if (a.type !== 'role' && b.type === 'role') return 1;
      return b.start.localeCompare(a.start);
    }
    return sortKey(b).localeCompare(sortKey(a));
  });
}

function getFeaturedExperience(workExperience) {
  const { entries, homeFeaturedIds } = workExperience;
  if (homeFeaturedIds?.length) {
    const byId = Object.fromEntries(entries.map((e) => [e.id, e]));
    return homeFeaturedIds.map((id) => byId[id]).filter(Boolean);
  }
  return sortCareerEntries(entries).slice(0, 3);
}

function renderPage(res, layout, template, data) {
  res.render(template, data, (err, body) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Render error');
    }
    res.render(layout, { ...data, body });
  });
}

// ── Root redirect ──────────────────────────────────────────────
app.get('/', (_req, res) => res.redirect('/tech'));

// ── Tech routes ────────────────────────────────────────────────
app.get('/tech', (req, res) => {
  const data = loadSiteData();
  const recentExperience = getFeaturedExperience(data.workExperience);
  renderPage(res, 'tech/layout', 'tech/home', locals(req, {
    pageTitle: 'Home',
    recentExperience,
  }));
});

app.get('/tech/experience', (req, res) => {
  const data = loadSiteData();
  const experience = sortCareerEntries(data.workExperience.entries);
  renderPage(res, 'tech/layout', 'tech/experience', locals(req, {
    experience,
    pageTitle: 'Work Experience',
  }));
});

app.get('/tech/projects', (req, res) => {
  const data = loadSiteData();
  renderPage(res, 'tech/layout', 'tech/projects', locals(req, {
    projects: data.projects.projects,
    pageTitle: 'Projects',
  }));
});

app.get('/tech/blog', (req, res) => {
  const posts = loadPosts('tech', { includeDrafts: allowDrafts(req) });
  renderPage(res, 'tech/layout', 'tech/blog-list', locals(req, {
    posts,
    pageTitle: 'Blog',
  }));
});

const BLOG_SLUG_REDIRECTS = {
  'bit-exact-replay-anti-cheat': 'verifying-paid-game-runs',
  'gloomhunt-verifying-runs-on-the-server': 'verifying-paid-game-runs',
  'canvas-game-no-engine': 'canvas-game-feel',
  'gloomhunt-engine-audio-and-vfx': 'canvas-game-feel',
  'gps-matching-rewrite': 'gps-street-matching',
  'street-keeper-gps-is-harder-than-it-looks': 'gps-street-matching',
  'kevvlar-on-a-budget': 'live-kanban-websockets',
  'kevvlar-realtime-kanban-websockets': 'live-kanban-websockets',
  'kevvlar-video-calls-in-an-iframe': 'video-calls-in-an-iframe',
  'city-sync-free-tier': 'syncing-a-city-on-free-tier',
  'strava-webhook-two-seconds': 'strava-two-second-deadline',
  'millions-of-call-records': '/tech/blog',
  'chatbot-four-million-savings': 'intent-accuracy-production-gate',
  'double-entry-wallet-ledger': 'wallet-balances-should-be-a-ledger',
  'bounties-without-new-code': 'ship-challenges-without-code',
};

app.get('/tech/blog/:slug', (req, res, next) => {
  const target = BLOG_SLUG_REDIRECTS[req.params.slug];
  if (target) {
    const dest = target.startsWith('/') ? target : `/tech/blog/${target}`;
    return res.redirect(301, dest);
  }
  next();
});

app.get('/tech/blog/:slug', (req, res) => {
  const post = getPost('tech', req.params.slug, { includeDrafts: allowDrafts(req) });
  if (!post) {
    res.status(404);
    return renderPage(res, 'tech/layout', '404', locals(req, { pageTitle: 'Not found' }));
  }
  renderPage(res, 'tech/layout', 'tech/blog-post', locals(req, {
    post,
    pageTitle: post.title,
    canonicalUrl: absoluteUrl(req, `/tech/blog/${post.slug}`),
    postSummary: post.summary,
  }));
});

// Legacy redirects
app.get('/tech/snippets', (_req, res) => res.redirect(301, '/tech/blog'));
app.get('/tech/snippets/:slug', (req, res) => res.redirect(301, `/tech/blog/${req.params.slug}`));
app.get('/tech/writing', (_req, res) => res.redirect(301, '/tech/blog'));
app.get('/tech/writing/:slug', (req, res) => res.redirect(301, `/tech/blog/${req.params.slug}`));

app.get('/tech/timeline', (req, res) => {
  const data = loadSiteData();
  renderPage(res, 'tech/layout', 'tech/timeline', locals(req, {
    career: { ...data.career, entries: sortTimelineEntries(data.career.entries) },
    pageTitle: 'Career Timeline',
  }));
});

// ── Civic routes (unchanged) ───────────────────────────────────
app.get('/civic', (req, res) => {
  const posts = loadPosts('civic', { includeDrafts: allowDrafts(req) }).slice(0, 2);
  renderPage(res, 'civic/layout', 'civic/landing', locals(req, { posts, pageTitle: 'Civic Writing' }));
});

app.get('/civic/writing', (req, res) => {
  const posts = loadPosts('civic', { includeDrafts: allowDrafts(req) });
  renderPage(res, 'civic/layout', 'civic/writing-list', locals(req, { posts, pageTitle: 'Essays' }));
});

app.get('/civic/writing/:slug', (req, res) => {
  const post = getPost('civic', req.params.slug, { includeDrafts: allowDrafts(req) });
  if (!post) {
    res.status(404);
    return renderPage(res, 'civic/layout', '404', locals(req, { pageTitle: 'Not found' }));
  }
  renderPage(res, 'civic/layout', 'civic/post', locals(req, { post, pageTitle: post.title }));
});

// ── 404 ────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404);
  renderPage(res, 'tech/layout', '404', locals(_req, { pageTitle: 'Not found' }));
});

const server = app.listen(PORT, () => {
  console.log(`Site running at ${PORT}`);
  console.log(`  Tech:  ${PORT}/tech`);
  console.log(`  Civic: ${PORT}/civic`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use. Either:`);
    console.error(`  • Stop the other process:  npx kill-port ${PORT}`);
    console.error(`  • Or use a different port in your .env file\n`);
    process.exit(1);
  }
  throw err;
});
