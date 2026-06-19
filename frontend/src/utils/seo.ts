export const SITE_URL = 'https://reaitro.com';
export const SITE_NAME = 'reAItro';
export const SITE_TAGLINE = 'Free AI-Powered Agile Retrospectives';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface HeadOptions {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function upsertMeta(attr: 'name' | 'property', key: string, content?: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function clearJsonLd() {
  document.head
    .querySelectorAll('script[type="application/ld+json"][data-managed]')
    .forEach(node => node.remove());
}

function appendJsonLd(payload: Record<string, unknown>) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-managed', 'true');
  script.textContent = JSON.stringify(payload);
  document.head.appendChild(script);
}

export function applyHead(options: HeadOptions) {
  const canonical = options.canonical ?? `${SITE_URL}${window.location.pathname}`;
  const image = options.image ?? DEFAULT_OG_IMAGE;
  const type = options.type ?? 'website';

  document.title = options.title;
  upsertMeta('name', 'title', options.title);
  upsertMeta('name', 'description', options.description);
  if (options.keywords) upsertMeta('name', 'keywords', options.keywords);
  upsertCanonical(canonical);

  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:title', options.title);
  upsertMeta('property', 'og:description', options.description);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:site_name', SITE_NAME);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', options.title);
  upsertMeta('name', 'twitter:description', options.description);
  upsertMeta('name', 'twitter:image', image);

  if (options.publishedTime) upsertMeta('property', 'article:published_time', options.publishedTime);
  if (options.modifiedTime) upsertMeta('property', 'article:modified_time', options.modifiedTime);
  if (options.author) upsertMeta('name', 'author', options.author);

  clearJsonLd();
  if (options.jsonLd) {
    const items = Array.isArray(options.jsonLd) ? options.jsonLd : [options.jsonLd];
    items.forEach(appendJsonLd);
  }
}

export function breadcrumbJsonLd(crumbs: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`
    }))
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    sameAs: []
  };
}
