#!/usr/bin/env node
/**
 * Post-build SEO step:
 *  1) Generates a complete sitemap.xml (templates + blog + legal + static) into dist/.
 *  2) Prerenders SEO-critical routes by copying dist/index.html into per-route
 *     dist/<route>/index.html files with route-specific <title>, <meta>, <link
 *     rel=canonical>, OpenGraph/Twitter tags and JSON-LD structured data.
 *
 * Vue still mounts and hydrates client-side after the static HTML is served.
 * Firebase Hosting will pick up the per-route index.html files automatically.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

if (!existsSync(distDir)) {
  console.error('[build-seo] dist/ not found - run vite build first.');
  process.exit(1);
}

const SITE_URL = 'https://reaitro.com';
const TODAY = new Date().toISOString().slice(0, 10);

// ----- Load content ---------------------------------------------------------
const templates = JSON.parse(readFileSync(resolve(root, 'src/templates.json'), 'utf8'));

const slugify = value =>
  String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const titleOf = name => name.split(' ').slice(1).join(' ').trim() || name;
const emojiOf = name => name.split(' ')[0] || '';

const templateRoutes = templates.map(tpl => {
  const displayName = titleOf(tpl.name);
  const slug = slugify(displayName);
  return {
    slug,
    displayName,
    emoji: emojiOf(tpl.name),
    shortDescription: tpl.shortDescription,
    description: tpl.description,
    columns: tpl.columns,
    url: `/templates/${slug}`
  };
});

// Blog posts - kept in sync with src/content/blog.ts (manual extract; the
// frontend module is TypeScript so we re-declare the post metadata here).
const blogPosts = [
  {
    slug: 'how-to-run-an-agile-retrospective',
    title: 'How to Run an Agile Retrospective: A Complete Step-by-Step Guide (2026)',
    description:
      'Plan, facilitate and follow up on an agile retrospective that actually produces change. Prep, format, facilitation, AI summaries, action tracking.',
    publishedAt: '2026-04-21',
    updatedAt: '2026-05-12'
  },
  {
    slug: 'how-ai-improves-retrospectives',
    title: 'How AI Improves Retrospectives: From Stickies to SMART Action Items in Seconds',
    description:
      'How AI changes the way teams run retrospectives - one-click summaries, action items, AI-generated templates and sentiment analysis.',
    publishedAt: '2026-03-18',
    updatedAt: '2026-05-12'
  },
  {
    slug: 'how-to-choose-a-retrospective-template',
    title: 'How to Choose the Right Retrospective Template for Your Team',
    description:
      'A practical decision guide for choosing the right retrospective format based on team mood, sprint outcome, and what you want to change.',
    publishedAt: '2026-02-09',
    updatedAt: '2026-05-12'
  },
  {
    slug: 'retrospective-action-items-that-stick',
    title: 'Writing Retrospective Action Items That Actually Get Done',
    description: 'Stop generating retro action items that vanish by next sprint. How to write items that are owned, tracked and finished.',
    publishedAt: '2026-01-15',
    updatedAt: '2026-05-12'
  },
  {
    slug: 'remote-and-async-retrospectives',
    title: 'Running Remote and Async Retrospectives That Don\'t Suck',
    description:
      'A practical playbook for facilitating remote, hybrid and async retrospectives - silent writing, voting, time zones and AI summaries.',
    publishedAt: '2025-12-04',
    updatedAt: '2026-05-12'
  },
  {
    slug: 'sprint-retrospective-ideas',
    title: '35 Sprint Retrospective Ideas to Re-Energize Your Team in 2026',
    description:
      '35 creative sprint retrospective ideas, formats and activities to break the routine, surface real issues and run retros your team actually looks forward to.',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-14'
  },
  {
    slug: 'best-retrospective-tools',
    title: 'Best Retrospective Tools in 2026: An Honest Comparison',
    description:
      'A practical, honest comparison of the best retrospective tools in 2026 - features, pricing, AI capabilities, real-time collaboration, and which tool fits which team.',
    publishedAt: '2026-04-05',
    updatedAt: '2026-05-14'
  },
  {
    slug: 'retrospective-questions-to-ask',
    title: '60 Retrospective Questions to Ask Your Team (Sorted by Goal)',
    description:
      '60 great retrospective questions to ask your agile team, sorted by goal - process, quality, delivery, morale, remote work, and learning.',
    publishedAt: '2026-03-02',
    updatedAt: '2026-05-14'
  },
  {
    slug: 'scrum-retrospective-guide',
    title: 'The Scrum Retrospective: A Complete Guide for Scrum Masters',
    description:
      'A complete scrum retrospective guide for Scrum Masters - what the sprint retrospective is, how it fits in scrum, formats, facilitation tips, and AI tools.',
    publishedAt: '2026-02-22',
    updatedAt: '2026-05-14'
  },
  {
    slug: 'fun-retrospective-ideas',
    title: '20 Fun Retrospective Ideas (That Still Surface Real Issues)',
    description:
      '20 fun retrospective ideas, themed formats and creative activities that keep the team engaged while still producing real, actionable insights.',
    publishedAt: '2026-01-28',
    updatedAt: '2026-05-14'
  },
  {
    slug: 'online-retrospective-tool',
    title: 'Choosing an Online Retrospective Tool: What to Look For in 2026',
    description:
      'A practical guide to choosing an online retrospective tool - must-have features, AI capabilities, security, pricing, and how to switch tools without losing your team.',
    publishedAt: '2026-04-30',
    updatedAt: '2026-05-14'
  }
];

// ----- Landing pages (high-value keyword routes) ---------------------------
// Hand-mirrored from src/content/landingPages.ts so the build script stays
// pure-Node without a TS loader. Keep both lists in sync when adding pages.
const landingPagePaths = [
  '/ai-retrospective',
  '/free-retrospective-tool',
  '/sprint-retrospective',
  '/scrum-retrospective',
  '/retrospective-ideas',
  '/retrospective-games',
  '/remote-retrospective',
  '/easyretro-alternative',
  '/parabol-alternative',
  '/retrium-alternative'
];

// ----- Sitemap --------------------------------------------------------------
const staticUrls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/login', changefreq: 'monthly', priority: '0.7' },
  { loc: '/boards/templates', changefreq: 'weekly', priority: '0.9' },
  { loc: '/ai-generator', changefreq: 'weekly', priority: '0.9' },
  { loc: '/join-board', changefreq: 'monthly', priority: '0.6' },
  { loc: '/about', changefreq: 'monthly', priority: '0.7' },
  { loc: '/help', changefreq: 'monthly', priority: '0.6' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.9' },
  { loc: '/retro-icebreaker-questions', changefreq: 'monthly', priority: '0.8' },
  ...landingPagePaths.map(p => ({ loc: p, changefreq: 'weekly', priority: '0.95' })),
  { loc: '/privacy', changefreq: 'yearly', priority: '0.4' },
  { loc: '/terms', changefreq: 'yearly', priority: '0.4' }
];

const sitemapEntries = [
  ...staticUrls.map(u => ({ ...u, lastmod: TODAY })),
  ...templateRoutes.map(t => ({
    loc: t.url,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: '0.8'
  })),
  ...blogPosts.map(p => ({
    loc: `/blog/${p.slug}`,
    lastmod: p.updatedAt,
    changefreq: 'monthly',
    priority: '0.8'
  }))
];

const xmlEscape = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;'
}[c]));

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapEntries.map(
    e =>
      `  <url>\n` +
      `    <loc>${SITE_URL}${e.loc}</loc>\n` +
      `    <lastmod>${e.lastmod}</lastmod>\n` +
      `    <changefreq>${e.changefreq}</changefreq>\n` +
      `    <priority>${e.priority}</priority>\n` +
      `  </url>`
  ),
  '</urlset>',
  ''
].join('\n');

writeFileSync(resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
console.log(`[build-seo] wrote sitemap.xml with ${sitemapEntries.length} URLs`);

// ----- Prerender (HTML shells with route-specific SEO tags) ----------------
const indexHtml = readFileSync(resolve(distDir, 'index.html'), 'utf8');

const applySeo = (html, seo) => {
  const escTitle = xmlEscape(seo.title);
  const escDesc = xmlEscape(seo.description);
  const escKeywords = xmlEscape(seo.keywords || '');
  const canonical = `${SITE_URL}${seo.path}`;
  const image = seo.image || `${SITE_URL}/og-image.png`;
  const type = seo.type || 'website';

  let next = html;
  next = next.replace(/<title>[^<]*<\/title>/, `<title>${escTitle}</title>`);
  next = next.replace(
    /(<meta\s+name="title"[^>]*content=")[^"]*("\s*\/?>)/,
    `$1${escTitle}$2`
  );
  next = next.replace(
    /(<meta\s+name="description"[^>]*content=")[^"]*("\s*\/?>)/,
    `$1${escDesc}$2`
  );
  if (escKeywords) {
    next = next.replace(
      /(<meta\s+name="keywords"[^>]*content=")[^"]*("\s*\/?>)/,
      `$1${escKeywords}$2`
    );
  }
  next = next.replace(
    /(<link\s+rel="canonical"[^>]*href=")[^"]*("\s*\/?>)/,
    `$1${canonical}$2`
  );
  // OG/Twitter overrides
  next = next.replace(
    /(<meta\s+property="og:type"[^>]*content=")[^"]*("\s*\/?>)/,
    `$1${type}$2`
  );
  next = next.replace(
    /(<meta\s+property="og:url"[^>]*content=")[^"]*("\s*\/?>)/,
    `$1${canonical}$2`
  );
  next = next.replace(
    /(<meta\s+property="og:title"[^>]*content=")[^"]*("\s*\/?>)/,
    `$1${escTitle}$2`
  );
  next = next.replace(
    /(<meta\s+property="og:description"[^>]*content=")[^"]*("\s*\/?>)/,
    `$1${escDesc}$2`
  );
  next = next.replace(
    /(<meta\s+property="og:image"[^>]*content=")[^"]*("\s*\/?>)/,
    `$1${image}$2`
  );
  next = next.replace(
    /(<meta\s+property="twitter:url"[^>]*content=")[^"]*("\s*\/?>)/,
    `$1${canonical}$2`
  );
  next = next.replace(
    /(<meta\s+property="twitter:title"[^>]*content=")[^"]*("\s*\/?>)/,
    `$1${escTitle}$2`
  );
  next = next.replace(
    /(<meta\s+property="twitter:description"[^>]*content=")[^"]*("\s*\/?>)/,
    `$1${escDesc}$2`
  );
  next = next.replace(
    /(<meta\s+property="twitter:image"[^>]*content=")[^"]*("\s*\/?>)/,
    `$1${image}$2`
  );

  // Inject JSON-LD just before </head>
  if (seo.jsonLd && seo.jsonLd.length) {
    const ldTags = seo.jsonLd
      .map(
        ld =>
          `\n    <script type="application/ld+json">${JSON.stringify(ld).replace(/<\//g, '<\\/')}</script>`
      )
      .join('');
    next = next.replace('</head>', `${ldTags}\n  </head>`);
  }

  return next;
};

const writeRoute = (routePath, html) => {
  if (routePath === '/') {
    writeFileSync(resolve(distDir, 'index.html'), html, 'utf8');
    return;
  }
  const targetDir = resolve(distDir, routePath.replace(/^\//, ''));
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(resolve(targetDir, 'index.html'), html, 'utf8');
};

const breadcrumb = crumbs => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${SITE_URL}${c.path}`
  }))
});

// Per-landing-page SEO metadata (mirrors src/content/landingPages.ts).
const landingPageSeo = [
  {
    path: '/ai-retrospective',
    name: 'AI retrospective',
    title: 'AI Retrospective - Free AI-Powered Sprint Retrospectives | reAItro',
    description:
      'Run an AI retrospective in minutes. Free AI-powered sprint retrospective board with one-click summaries, SMART action items and an AI template generator. No credit card.',
    keywords:
      'AI retrospective, AI retro, AI sprint retrospective, AI agile retrospective, AI retrospective tool, generative AI retrospective, AI scrum master, AI retro summary, AI action items',
    faq: [
      ['What is an AI retrospective?', 'An AI retrospective is a sprint retrospective where generative AI assists facilitation - typically by generating one-click summaries of the board, extracting SMART action items from sticky notes, and creating custom retro templates from a one-sentence prompt.'],
      ['Is the AI retrospective in reAItro free?', 'Yes. AI summaries, AI action items and the AI template generator are free for agile teams. No credit card required.'],
      ['Does the AI train on my retrospective data?', 'No. reAItro uses Google Vertex AI under Google’s no-training terms. Your retro content is not used to train any model.'],
      ['Can AI replace a Scrum Master in a retrospective?', 'No. AI replaces the homework around the retrospective - writeup, action item drafts, template generation - not the facilitation itself.'],
      ['Which AI model powers reAItro?', 'reAItro runs on Google Vertex AI, primarily Gemini 2.5 Flash for summaries and action items because of its speed and quality on long retro boards.']
    ]
  },
  {
    path: '/free-retrospective-tool',
    name: 'Free retrospective tool',
    title: 'Free Retrospective Tool - Real-Time Boards + AI Summaries | reAItro',
    description:
      'A genuinely free retrospective tool for agile teams. Real-time boards, 26 templates, AI-generated summaries, SMART action items. No credit card, no per-seat pricing.',
    keywords:
      'free retrospective tool, free retro tool, free retrospective board, free online retrospective tool, free retrospective software, free agile retrospective, free sprint retrospective tool',
    faq: [
      ['Is reAItro really free?', 'Yes. Real-time retrospective boards, 26+ templates, AI summaries, SMART action items and the AI template generator are free for agile teams. No credit card required.'],
      ['Is there a seat limit on the free retrospective tool?', 'No per-seat fee for small agile teams. Invite the whole team. Anonymous guest links let teammates join in one click without an account.'],
      ['What is the catch?', 'There is not one. Enterprise teams that need SSO, audit logs and SLA support pay for an enterprise plan. The everyday retro features stay free.'],
      ['Do you train AI on our retrospective data?', 'No. reAItro uses Google Vertex AI under Google’s no-training terms.']
    ]
  },
  {
    path: '/sprint-retrospective',
    name: 'Sprint retrospective',
    title: 'Sprint Retrospective - Run Real-Time Sprint Retros with AI | reAItro',
    description:
      'Everything you need to run a great sprint retrospective: 26 templates, real-time collaboration, AI summaries and SMART action items - free for agile teams.',
    keywords:
      'sprint retrospective, sprint retro, sprint retrospective tool, sprint retrospective template, agile sprint retro, scrum sprint retrospective, online sprint retrospective',
    faq: [
      ['How long should a sprint retrospective be?', 'For a two-week sprint, plan 60-90 minutes. The Scrum Guide caps the retrospective at three hours for a one-month sprint, proportionally less for shorter sprints.'],
      ['Who attends a sprint retrospective?', 'The whole scrum team that delivered the sprint - developers, product owner, Scrum Master. Stakeholders typically do not attend.'],
      ['What is the best sprint retrospective template?', 'There is no single best template - the right one depends on the sprint outcome and team mood. DAKI is a strong default. Sailboat suits strategic retros. Glad/Sad/Mad works for morale check-ins.'],
      ['How do I make sprint retrospective action items stick?', 'Single owner per action, clear due date, public read-back at the close of the retro, and a 2-minute review of the previous sprint’s actions at the start of the next retro.']
    ]
  },
  {
    path: '/scrum-retrospective',
    name: 'Scrum retrospective',
    title: 'Scrum Retrospective - Templates, Agenda & AI for Scrum Masters | reAItro',
    description:
      'A complete scrum retrospective workflow - proven templates, a 75-minute agenda, facilitation tips and free AI summaries. Built for Scrum Masters and agile teams.',
    keywords:
      'scrum retrospective, scrum retro, scrum master retrospective, scrum retrospective template, scrum retrospective tool, scrum framework retrospective, agile scrum retro',
    faq: [
      ['What is a scrum retrospective?', 'A scrum retrospective is the last event in a scrum sprint. The team inspects how the sprint went and decides what to change for the next one. It is the only scrum event whose explicit purpose is to improve how the team works.'],
      ['How is the scrum retrospective different from the sprint review?', 'The sprint review demos the product increment to stakeholders. The scrum retrospective inspects how the team itself worked.'],
      ['Who facilitates the scrum retrospective?', 'Usually the Scrum Master, though facilitation can rotate. The manager typically does not facilitate - their presence often dampens honesty.'],
      ['How long is a scrum retrospective?', 'The Scrum Guide caps it at three hours for a one-month sprint, proportionally less for shorter sprints. For a typical two-week sprint, 60-90 minutes is right.']
    ]
  },
  {
    path: '/retrospective-ideas',
    name: 'Retrospective ideas',
    title: 'Retrospective Ideas - 35+ Sprint Retro Ideas, Formats & Activities | reAItro',
    description:
      '35+ retrospective ideas, themed formats and activities to break the routine and re-energize your sprint retros. Free templates and AI-generated custom retros included.',
    keywords:
      'retrospective ideas, sprint retrospective ideas, retro ideas, fun retrospective ideas, creative retrospective, retrospective activities, retrospective format ideas',
    faq: [
      ['How often should I change my retrospective ideas?', 'Rotate the format every 2-3 sprints at minimum. Even small changes (different opener, themed framing) keep the team’s brain engaged.'],
      ['What is the best retrospective idea for a tired team?', 'Glad / Sad / Mad or Energy Levels. Both surface morale honestly and require very low cognitive load.'],
      ['What is the best retrospective idea after a major launch?', 'Space Mission or Mountain Climber. Both celebrate the milestone while capturing concrete learnings.'],
      ['Can AI come up with retrospective ideas?', 'Yes. The reAItro template generator builds a fully formed custom retrospective from a one-sentence prompt.']
    ]
  },
  {
    path: '/retrospective-games',
    name: 'Retrospective games',
    title: 'Retrospective Games - 5 Free AI Team Games for Sprint Retros | reAItro',
    description:
      'Five free AI-powered team games that make sprint retrospectives engaging - Doodle Quest, Trivia, Emoji Tales and more. Great for remote and offshore teams.',
    keywords:
      'retrospective games, retro games, fun retrospective games, team games for retrospectives, online retro games, sprint retrospective games',
    faq: [
      ['What are retrospective games?', 'Retrospective games are short, fun team activities - like pictionary, trivia or emoji storytelling - used to warm up a retro, build psychological safety and re-energize tired teams.'],
      ['Which games does reAItro include?', 'Five live multiplayer games: Doodle Quest, Trivia Race, Emoji Tales, Two Truths & a Lie, and Meeting Roulette. Each is AI-powered and free.'],
      ['Are the retro games good for remote teams?', 'Yes - every game is real-time and shareable by link, so remote, offshore and onshore teammates can play together from anywhere.'],
      ['Do retrospective games cost anything?', 'No. All five team games are free, with no credit card and no per-seat pricing.']
    ]
  },
  {
    path: '/remote-retrospective',
    name: 'Remote retrospective',
    title: 'Remote Retrospective - Run Engaging Distributed Sprint Retros | reAItro',
    description:
      'Run engaging remote and distributed sprint retrospectives with real-time boards, anonymous input, AI summaries and team games. Free, no credit card.',
    keywords:
      'remote retrospective, distributed retrospective, remote sprint retrospective, online retrospective for remote teams, async retrospective, offshore team retrospective',
    faq: [
      ['How do you run a retrospective remotely?', 'Use a real-time online retro board: everyone adds notes (anonymously if needed), groups themes, votes and agrees on action items. reAItro does this plus a one-click AI summary.'],
      ['How do you keep remote retros engaging?', 'Rotate formats, allow anonymous input so quieter teammates speak up, and open with a quick team game to build safety.'],
      ['Does it work across time zones?', 'Yes. Boards persist, so distributed and offshore teams can contribute, and the facilitator can summarize with AI for anyone who could not attend.'],
      ['Is it free for remote teams?', 'Yes - real-time boards, AI summaries and team games are free, with anonymous guest join and SSO.']
    ]
  },
  {
    path: '/easyretro-alternative',
    name: 'EasyRetro alternative',
    title: 'EasyRetro Alternative - Free AI Retrospective Tool | reAItro',
    description:
      'Looking for an EasyRetro alternative? reAItro is a free, AI-first retrospective tool with summaries, action items, an AI template generator and team games.',
    keywords:
      'EasyRetro alternative, EasyRetro free alternative, FunRetro alternative, alternative to EasyRetro, retro tool comparison',
    faq: [
      ['What is a good free EasyRetro alternative?', 'reAItro is a free, AI-first alternative: real-time boards, 26 templates, one-click AI summaries, SMART action items, an AI template generator and five team games.'],
      ['Is reAItro really free?', 'Yes - the core retro features and AI are free, with no credit card and no per-seat pricing.'],
      ['What should I look for in an EasyRetro alternative?', 'Real-time collaboration, anonymous input, good templates, action-item tracking, and ideally built-in AI summaries and engagement features like team games.'],
      ['Can I migrate my retro format?', 'Yes - pick a matching template or describe your format to the AI template generator and it builds the columns for you.']
    ]
  },
  {
    path: '/parabol-alternative',
    name: 'Parabol alternative',
    title: 'Parabol Alternative - Free AI-Powered Retrospectives | reAItro',
    description:
      'A free Parabol alternative for agile retrospectives - real-time boards, AI summaries, SMART action items, AI template generator and team games.',
    keywords:
      'Parabol alternative, alternative to Parabol, free Parabol alternative, Parabol vs, retrospective tool comparison',
    faq: [
      ['What is a good free Parabol alternative?', 'reAItro offers free real-time retrospectives with AI summaries, AI action items, an AI template generator and five team games.'],
      ['Does reAItro have AI features?', 'Yes - one-click board summaries, SMART action-item extraction, an AI template generator and AI icebreakers.'],
      ['Is it free?', 'Yes, the core retro and AI features are free, with anonymous join and Google/Microsoft SSO.'],
      ['What should I look for in a Parabol alternative?', 'Fast setup, real-time boards, templates, action tracking and built-in AI to cut the facilitator’s busywork.']
    ]
  },
  {
    path: '/retrium-alternative',
    name: 'Retrium alternative',
    title: 'Retrium Alternative - Free Retrospective Tool with AI | reAItro',
    description:
      'A free Retrium alternative for sprint retrospectives - templates, real-time collaboration, AI summaries and action items, plus team games.',
    keywords:
      'Retrium alternative, alternative to Retrium, free Retrium alternative, Retrium vs, retro software comparison',
    faq: [
      ['What is a good free Retrium alternative?', 'reAItro is a free Retrium alternative with real-time boards, 26 templates, AI summaries, SMART action items and five team games.'],
      ['Does it support anonymous retrospectives?', 'Yes - teammates can submit notes anonymously and join boards via guest links.'],
      ['Is reAItro free?', 'Yes - core retro features and AI are free, no credit card required.'],
      ['What should I look for in a Retrium alternative?', 'Real-time collaboration, strong templates, anonymous input, action tracking and built-in AI summaries.']
    ]
  }
];

const seoRoutes = [
  {
    path: '/',
    title: 'Retrospective Tool · Free AI Retrospective Board & Templates | reAItro',
    description:
      'The free AI retrospective tool for agile teams. Run real-time sprint retrospectives with 26 templates, AI-generated summaries, SMART action items and an AI template generator. No credit card.',
    keywords: 'retrospective, retrospective tool, AI retrospective, agile retrospective, sprint retrospective, scrum retrospective, retrospective board, online retrospective tool, free retrospective tool, retrospective template, AI retro, retro board, retrospective software, sprint retro, team retrospective',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'reAItro',
        alternateName: ['RetroBoard', 'AI Retrospective Tool', 'Reaitro'],
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Agile Retrospective Tool',
        operatingSystem: 'Web',
        url: SITE_URL,
        description:
          'Free AI-powered online retrospective tool for agile and scrum teams. Real-time sprint retrospective boards with 26 templates, one-click AI summaries, SMART action items and an AI template generator.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: [
          'Real-time multi-user retrospective board',
          '26 ready-made retrospective templates (Sailboat, DAKI, 4Ls, Glad/Sad/Mad, Start/Stop/Continue, and more)',
          'AI-generated retrospective summaries powered by Google Vertex AI',
          'AI-extracted SMART action items',
          'AI custom retrospective template generator',
          'Anonymous guest links and SSO',
          'Printable retrospective reports',
          'Async and remote-friendly retrospectives'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is an agile retrospective?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'An agile retrospective is a recurring meeting (usually at the end of a sprint) where a team inspects how the sprint went and decides what to change for the next one. It is the single highest-leverage ceremony in scrum because it is the only one explicitly aimed at improving how the team works.'
            }
          },
          {
            '@type': 'Question',
            name: 'What is an AI retrospective?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'An AI retrospective is a sprint retrospective in which generative AI assists facilitation - typically by generating one-click summaries of the board, extracting SMART action items from sticky notes, and creating custom retro templates from a one-sentence prompt. reAItro uses Google Vertex AI to deliver these features for free.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is reAItro free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Yes. reAItro is free for agile teams, with no credit card required. You get real-time retrospective boards, 26+ templates, AI-generated summaries, SMART action items and an AI template generator at no cost.'
            }
          },
          {
            '@type': 'Question',
            name: 'How long should a sprint retrospective be?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'For a typical two-week sprint, plan 60-90 minutes for the retrospective. The Scrum Guide caps it at three hours for a one-month sprint, proportionally less for shorter sprints.'
            }
          },
          {
            '@type': 'Question',
            name: 'What is the best retrospective template?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'There is no single best retrospective template - the right one depends on the team\'s mood and the sprint outcome. DAKI is a great default. Sailboat works well for strategic retros. Glad/Sad/Mad is best for morale check-ins. You can also generate a custom template with the AI template generator in reAItro.'
            }
          },
          {
            '@type': 'Question',
            name: 'Does reAItro work for remote and async teams?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Yes. reAItro is designed from day one for live remote retros and multi-day async retrospectives. Real-time sticky updates, dot-voting, anonymous guest links and AI summaries make it a strong fit for distributed teams.'
            }
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Popular retrospective templates',
        itemListElement: templateRoutes.slice(0, 10).map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${t.displayName} retrospective template`,
          url: `${SITE_URL}${t.url}`
        }))
      },
      breadcrumb([{ name: 'Home', path: '/' }])
    ]
  },
  {
    path: '/boards/templates',
    title: 'Retrospective Templates · 20 Free Formats | reAItro',
    description:
      'Browse 20 free retrospective templates - Sailboat, DAKI, Mountain Climber, Glad/Sad/Mad, and more. AI summaries included.',
    keywords: 'retrospective templates, retro formats, agile retrospective template, sprint retro template',
    jsonLd: [breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Templates', path: '/boards/templates' }
    ])]
  },
  {
    path: '/ai-generator',
    title: 'AI Retrospective Template Generator · Custom retros in 8 seconds',
    description:
      'Describe your team or your sprint and let our AI generate a fully formed retrospective template - columns, prompts, colors and an action column.',
    keywords: 'AI retro generator, AI retrospective template, generative AI agile, retro template generator',
    jsonLd: [breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'AI Generator', path: '/ai-generator' }
    ])]
  },
  {
    path: '/login',
    title: 'Sign in to reAItro · Free retrospectives + AI summaries',
    description:
      'Sign in to reAItro to create retrospective boards, run real-time retros and use AI-powered summaries and action items. Free.',
    keywords: 'retroboard login, retrospective sign in, AI retrospective sign in'
  },
  {
    path: '/join-board',
    title: 'Join a Retrospective Board · reAItro',
    description: 'Join an existing retrospective board with a link or board ID. Real-time collaboration for distributed agile teams.',
    keywords: 'join retrospective, board id, retro board link, team retrospective collaboration'
  },
  {
    path: '/about',
    title: 'About reAItro · Agile Retrospectives with AI',
    description:
      'reAItro is an AI-powered retrospective tool for agile teams - built to make retros fast, honest and actionable.',
    keywords: 'about retroboard, AI retrospective tool, agile retrospective'
  },
  {
    path: '/help',
    title: 'Help & Support · reAItro',
    description: 'Find help, FAQs and contact information for reAItro - getting started, AI features, privacy and enterprise.',
    keywords: 'help, support, FAQ, reAItro, privacy, enterprise, contact'
  },
  {
    path: '/blog',
    title: 'Retrospective Blog · Practical Guides for Agile Teams | reAItro',
    description:
      'In-depth, opinionated articles on how to run better agile retrospectives - facilitation, AI summaries, action items, remote teams.',
    keywords: 'retrospective blog, agile blog, sprint retrospective, scrum facilitation',
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'reAItro Blog',
        url: `${SITE_URL}/blog`,
        blogPost: blogPosts.map(p => ({
          '@type': 'BlogPosting',
          headline: p.title,
          url: `${SITE_URL}/blog/${p.slug}`,
          datePublished: p.publishedAt,
          dateModified: p.updatedAt
        }))
      }
    ]
  },
  {
    path: '/retro-icebreaker-questions',
    title: '100+ Retro Icebreaker Questions - Free Team Icebreaker Generator | reAItro',
    description:
      'A free library of 100+ retro and team icebreaker questions, with a random question generator. Perfect for sprint retros, standups and remote teams.',
    keywords: 'retro icebreaker questions, icebreaker questions, team icebreaker questions, icebreaker questions for meetings, retrospective icebreaker, icebreaker generator',
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Retro Icebreaker Questions', path: '/retro-icebreaker-questions' }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          ['What are good retro icebreaker questions?', 'Good retro icebreakers are quick, low-pressure and relevant - e.g. "One word for this sprint?", "What surprised you this week?" or a fun "would you rather". This page has 100+ grouped by theme.'],
          ['How do I use an icebreaker in a retrospective?', 'Open the retro with a 2-3 minute icebreaker so everyone speaks once before the real discussion. It builds psychological safety and warms up quieter teammates.'],
          ['Are these icebreaker questions free?', 'Yes - the full library and the random generator are free to use, no signup required.']
        ].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
      }
    ]
  },
  {
    path: '/privacy',
    title: 'Privacy Policy · reAItro',
    description:
      'Read the reAItro privacy policy: what we collect, how we use it, AI processing details, subprocessors, your rights and how to contact us.',
    keywords: 'retroboard privacy policy, agile retrospective privacy, GDPR retrospective tool',
    jsonLd: [breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Privacy Policy', path: '/privacy' }
    ])]
  },
  {
    path: '/terms',
    title: 'Terms of Service · reAItro',
    description:
      'Read the reAItro Terms of Service: account rules, acceptable use, AI feature terms, liability, governing law and contact information.',
    keywords: 'retroboard terms of service, retrospective terms, AI retrospective terms of use',
    jsonLd: [breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Terms of Service', path: '/terms' }
    ])]
  },
  // Landing pages (high-value keyword routes)
  ...landingPageSeo.map(lp => ({
    path: lp.path,
    title: lp.title,
    description: lp.description,
    keywords: lp.keywords,
    type: 'website',
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: lp.name, path: lp.path }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: lp.faq.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a }
        }))
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: lp.title,
        url: `${SITE_URL}${lp.path}`,
        description: lp.description,
        isPartOf: {
          '@type': 'WebSite',
          name: 'reAItro',
          url: SITE_URL
        },
        about: { '@type': 'Thing', name: lp.name }
      }
    ]
  })),
  // Template detail routes
  ...templateRoutes.map(t => ({
    path: t.url,
    title: `${t.displayName} Retrospective Template · Free + AI Summary | reAItro`,
    description: `${t.shortDescription} - run the ${t.displayName} retrospective free on reAItro with real-time collaboration and one-click AI summaries.`,
    keywords: `${t.displayName} retrospective, ${t.displayName} retro template, agile retrospective, scrum retro, ${t.displayName} format, AI retrospective`,
    type: 'article',
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Templates', path: '/boards/templates' },
        { name: t.displayName, path: t.url }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to run a ${t.displayName} retrospective`,
        description: t.description,
        totalTime: 'PT45M',
        step: [
          { title: 'Open the retro', detail: 'Welcome the team, share the goal, and review the prime directive.' },
          { title: 'Gather input', detail: 'Give each person 5-7 minutes per column to add stickies asynchronously or silently.' },
          { title: 'Discuss & cluster', detail: 'Group similar notes, vote on the themes that matter most this iteration.' },
          { title: 'Decide actions', detail: 'Turn the top themes into 1-3 SMART action items with owners and timelines.' },
          { title: 'Close & summarize', detail: 'Use reAItro to generate a one-click summary and action item list to share.' }
        ].map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.title,
          text: s.detail
        }))
      }
    ]
  })),
  // Blog post routes
  ...blogPosts.map(p => ({
    path: `/blog/${p.slug}`,
    title: `${p.title} · reAItro Blog`,
    description: p.description,
    keywords: 'agile retrospective, AI retrospective, scrum facilitation',
    type: 'article',
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: p.title, path: `/blog/${p.slug}` }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${p.slug}` },
        headline: p.title,
        description: p.description,
        datePublished: p.publishedAt,
        dateModified: p.updatedAt,
        publisher: {
          '@type': 'Organization',
          name: 'reAItro',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` }
        }
      }
    ]
  }))
];

let prerendered = 0;
for (const seo of seoRoutes) {
  const html = applySeo(indexHtml, seo);
  writeRoute(seo.path, html);
  prerendered++;
}
console.log(`[build-seo] prerendered ${prerendered} routes`);
