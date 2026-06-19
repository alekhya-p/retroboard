<template>
  <AppPage v-if="post" variant="marketing" class="post-page">
    <section class="post-hero" :style="{ background: post.hero.gradient }">
      <div class="post-hero-inner">
        <nav class="post-breadcrumbs" aria-label="Breadcrumb">
          <router-link to="/">Home</router-link>
          <span>›</span>
          <router-link to="/blog">Blog</router-link>
          <span>›</span>
          <span class="post-current">{{ post.hero.eyebrow }}</span>
        </nav>
        <span class="post-eyebrow">{{ post.hero.eyebrow }}</span>
        <h1>{{ post.hero.title }}</h1>
        <p class="post-subtitle">{{ post.hero.subtitle }}</p>
        <div class="post-meta">
          <span>{{ post.author }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ formatDate(post.publishedAt) }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ post.readingMinutes }} min read</span>
        </div>
      </div>
    </section>

    <article class="post-body">
      <nav class="post-toc" aria-label="Article contents">
        <p class="post-toc-title">On this page</p>
        <ol>
          <li v-for="item in post.toc" :key="item.id">
            <a :href="`#${item.id}`">{{ item.label }}</a>
          </li>
        </ol>
        <div class="post-tags">
          <span v-for="tag in post.tags" :key="tag">#{{ tag }}</span>
        </div>
      </nav>

      <div class="post-content" v-html="post.body"></div>
    </article>

    <section class="post-cta">
      <div>
        <h2>Run your next retro on reAItro</h2>
        <p>Free. Real-time collaboration. AI summaries and action items in one click.</p>
      </div>
      <router-link to="/boards/templates" class="btn btn--subtle post-cta-btn">Browse templates →</router-link>
    </section>

    <section v-if="relatedPosts.length" class="post-related">
      <h2>Keep reading</h2>
      <div class="post-related-grid">
        <router-link
          v-for="rel in relatedPosts"
          :key="rel.slug"
          :to="`/blog/${rel.slug}`"
          class="post-related-card"
        >
          <span class="post-related-eyebrow">{{ rel.hero.eyebrow }}</span>
          <strong>{{ rel.title }}</strong>
          <span class="post-related-meta">{{ rel.readingMinutes }} min · {{ formatDate(rel.publishedAt) }}</span>
        </router-link>
      </div>
    </section>

    <AppFooter />
  </AppPage>
  <AppPage v-else variant="marketing" class="post-not-found">
    <h1>Post not found</h1>
    <router-link to="/blog" class="btn btn--secondary">Back to blog</router-link>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';
import AppPage from '@/components/ui/AppPage.vue';
import { blogPosts, blogPostMap, type BlogPost } from '@/content/blog';
import { applyHead, breadcrumbJsonLd, SITE_URL } from '@/utils/seo';

const route = useRoute();
const post = computed<BlogPost | undefined>(() => blogPostMap[route.params.slug as string]);

const relatedPosts = computed<BlogPost[]>(() =>
  blogPosts.filter(p => p.slug !== post.value?.slug).slice(0, 3)
);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const updateHead = () => {
  if (!post.value) {
    applyHead({
      title: 'Post not found · reAItro Blog',
      description: 'The blog post you requested was not found.',
      canonical: `${SITE_URL}/blog`
    });
    return;
  }
  const p = post.value;
  applyHead({
    title: `${p.title} · reAItro Blog`,
    description: p.description,
    keywords: p.keywords,
    canonical: `${SITE_URL}/blog/${p.slug}`,
    type: 'article',
    publishedTime: p.publishedAt,
    modifiedTime: p.updatedAt,
    author: p.author,
    jsonLd: [
      breadcrumbJsonLd([
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
        keywords: p.keywords,
        author: { '@type': 'Organization', name: p.author },
        publisher: {
          '@type': 'Organization',
          name: 'reAItro',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` }
        },
        datePublished: p.publishedAt,
        dateModified: p.updatedAt,
        wordCount: p.body.split(/\s+/).length
      }
    ]
  });
};

onMounted(updateHead);
watch(() => route.params.slug, updateHead);
</script>

<style scoped>
.post-page { width: 100%; }
.post-hero {
  max-width: 1180px;
  margin: 0 auto 32px;
  color: #fff;
  border-radius: 24px;
  padding: 48px 36px 56px;
  position: relative;
  overflow: hidden;
}
.post-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.4), transparent 60%),
    radial-gradient(1.5px 1.5px at 75% 60%, rgba(255,255,255,0.32), transparent 60%);
  opacity: 0.5;
  pointer-events: none;
}
.post-hero-inner { position: relative; z-index: 1; max-width: 820px; }
.post-breadcrumbs { font-size: 0.86rem; color: rgba(255,255,255,0.82); margin-bottom: 18px; display: flex; gap: 8px; flex-wrap: wrap; }
.post-breadcrumbs a { color: inherit; text-decoration: none; opacity: 0.85; }
.post-breadcrumbs a:hover { opacity: 1; }
.post-current { color: #fff; }
.post-eyebrow {
  display: inline-block;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.3);
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
  margin-bottom: 14px;
}
.post-hero h1 {
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
}
.post-subtitle { font-size: 1.08rem; color: rgba(255,255,255,0.9); line-height: 1.55; max-width: 720px; margin: 0 0 20px; }
.post-meta { color: rgba(255,255,255,0.82); font-size: 0.92rem; display: flex; gap: 10px; flex-wrap: wrap; }

.post-body {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 0 60px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 48px;
  align-items: flex-start;
}
.post-toc {
  position: sticky;
  top: 96px;
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(15,23,42,0.06);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  padding: 20px;
}
.post-toc-title {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin: 0 0 12px;
}
.post-toc ol { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.post-toc a {
  text-decoration: none;
  color: #334155;
  font-size: 0.9rem;
  display: block;
  padding: 6px 8px;
  border-radius: 8px;
}
.post-toc a:hover { background: rgba(99,102,241,0.1); color: #4f46e5; }
.post-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
.post-tags span { font-size: 0.78rem; color: #4f46e5; background: rgba(99,102,241,0.1); padding: 4px 10px; border-radius: 999px; }

.post-content {
  background: #fff;
  border-radius: 20px;
  padding: 36px 40px;
  border: 1px solid rgba(15,23,42,0.06);
  box-shadow: 0 16px 50px -28px rgba(15,23,42,0.18);
  line-height: 1.75;
  color: #1e293b;
}
.post-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 32px 0 12px;
  color: #0f172a;
  scroll-margin-top: 96px;
}
.post-content :deep(h2:first-child) { margin-top: 0; }
.post-content :deep(h3) { font-size: 1.15rem; margin: 22px 0 8px; color: #1e293b; }
.post-content :deep(p) { margin: 0 0 14px; color: #334155; font-size: 1rem; }
.post-content :deep(ul), .post-content :deep(ol) { padding-left: 22px; margin: 0 0 16px; display: flex; flex-direction: column; gap: 6px; }
.post-content :deep(li) { color: #334155; line-height: 1.65; }
.post-content :deep(blockquote) {
  border-left: 3px solid #6366f1;
  background: rgba(99,102,241,0.06);
  margin: 16px 0;
  padding: 12px 18px;
  border-radius: 0 12px 12px 0;
  color: #1e293b;
  font-style: italic;
}
.post-content :deep(a) {
  color: #4f46e5;
  border-bottom: 1px solid rgba(99,102,241,0.3);
  text-decoration: none;
}
.post-content :deep(a:hover) { color: #a855f7; border-color: rgba(168,85,247,0.4); }
.post-content :deep(em) { color: #4f46e5; font-style: italic; }
.post-content :deep(strong) { color: #0f172a; }

.post-cta {
  max-width: 1180px;
  margin: 12px auto 32px;
  background: linear-gradient(135deg,#6366f1,#a855f7,#ec4899);
  color: #fff;
  border-radius: 22px;
  padding: 26px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.post-cta h2 { margin: 0; font-size: 1.35rem; color: #fff; }
.post-cta p { margin: 6px 0 0; color: rgba(255,255,255,0.88); }
.post-cta-btn {
  --btn-bg: #fff;
  --btn-fg: #0f172a;
  box-shadow: 0 10px 24px -10px rgba(15,23,42,0.35);
}

.post-related { max-width: 1180px; margin: 0 auto 48px; }
.post-related h2 { font-size: 1.4rem; margin: 0 0 16px; color: #0f172a; }
.post-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
.post-related-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 16px;
  padding: 18px 20px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 6px 18px -12px rgba(15,23,42,0.16);
  transition: transform 0.18s, box-shadow 0.18s;
}
.post-related-card:hover { transform: translateY(-3px); box-shadow: 0 14px 28px -14px rgba(15,23,42,0.18); }
.post-related-eyebrow { font-size: 0.78rem; color: #4f46e5; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.post-related-card strong { font-size: 1rem; color: #0f172a; line-height: 1.35; }
.post-related-meta { font-size: 0.82rem; color: #64748b; }

.post-not-found { text-align: center; }
.post-not-found h1 { margin: 80px 0 24px; }

@media (max-width: 900px) {
  .post-body { grid-template-columns: 1fr; gap: 22px; }
  .post-toc { position: static; }
  .post-content { padding: 24px 22px; }
  .post-hero h1 { font-size: 1.9rem; }
}
</style>
