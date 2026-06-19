<template>
  <AppPage variant="marketing" class="blog-page">
    <section class="blog-hero">
      <div class="blog-hero-inner">
        <span class="blog-eyebrow">Blog · Agile retrospectives</span>
        <h1>How to run better retrospectives - backed by AI</h1>
        <p class="blog-lede">
          Practical, opinionated writing from the team behind reAItro. No fluff,
          no "ultimate guide to everything" listicles - just patterns that work for real
          agile teams shipping real software.
        </p>
        <div class="blog-hero-tags">
          <span v-for="tag in tags" :key="tag" class="blog-tag-pill">#{{ tag }}</span>
        </div>
      </div>
    </section>

    <section class="blog-list-wrapper">
      <article
        v-for="(post, index) in sortedPosts"
        :key="post.slug"
        class="blog-card"
        :class="{ 'blog-card-feature': index === 0 }"
      >
        <router-link :to="`/blog/${post.slug}`" class="blog-card-link" :aria-label="post.title">
          <div class="blog-card-art" :style="{ background: post.hero.gradient }">
            <span class="blog-card-eyebrow">{{ post.hero.eyebrow }}</span>
            <h2 v-if="index === 0">{{ post.title }}</h2>
            <h3 v-else>{{ post.title }}</h3>
          </div>
          <div class="blog-card-body">
            <div class="blog-card-meta">
              <span>{{ formatDate(post.publishedAt) }}</span>
              <span>·</span>
              <span>{{ post.readingMinutes }} min read</span>
            </div>
            <p>{{ post.description }}</p>
            <div class="blog-card-tags">
              <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
            </div>
            <span class="blog-card-cta">Read article →</span>
          </div>
        </router-link>
      </article>
    </section>

    <AppFooter />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AppFooter from '@/components/AppFooter.vue';
import AppPage from '@/components/ui/AppPage.vue';
import { blogPosts } from '@/content/blog';
import { applyHead, breadcrumbJsonLd, SITE_URL } from '@/utils/seo';

const sortedPosts = computed(() =>
  [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
);
const tags = computed(() => Array.from(new Set(sortedPosts.value.flatMap(p => p.tags))));

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

onMounted(() => {
  applyHead({
    title: 'Retrospective Blog · Practical Guides for Agile Teams | reAItro',
    description:
      'Read in-depth, opinionated articles on how to run better agile retrospectives - facilitation, AI-powered summaries, action items, remote teams, and choosing the right format.',
    keywords:
      'retrospective blog, agile blog, sprint retrospective, scrum facilitation, AI retrospective, retro templates',
    canonical: `${SITE_URL}/blog`,
    jsonLd: [
      breadcrumbJsonLd([
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
          dateModified: p.updatedAt,
          author: { '@type': 'Organization', name: p.author }
        }))
      }
    ]
  });
});
</script>

<style scoped>
.blog-hero {
  background:
    radial-gradient(800px 320px at 100% 0%, rgba(99,102,241,0.18), transparent 60%),
    radial-gradient(700px 320px at 0% 100%, rgba(236,72,153,0.16), transparent 60%),
    linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#312e81 100%);
  color: #fff;
  border-radius: 24px;
  padding: 48px 36px;
  margin: 0 0 32px;
}
.blog-hero-inner { max-width: 760px; }
.blog-eyebrow {
  display: inline-block;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.24);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
  margin-bottom: 16px;
}
.blog-hero h1 {
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
}
.blog-lede { font-size: 1.05rem; color: rgba(241,245,249,0.86); line-height: 1.6; max-width: 640px; }
.blog-hero-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; }
.blog-tag-pill {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 0.85rem;
  color: rgba(241,245,249,0.9);
}

.blog-list-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  padding-bottom: 32px;
}
.blog-card { transition: transform 0.18s, box-shadow 0.18s; }
.blog-card:hover { transform: translateY(-4px); }
.blog-card-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(15,23,42,0.06);
  box-shadow: 0 12px 30px -16px rgba(15,23,42,0.18);
  height: 100%;
}
.blog-card-art {
  padding: 24px 22px;
  color: #fff;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
}
.blog-card-eyebrow {
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.78rem;
  font-weight: 500;
  align-self: flex-start;
}
.blog-card-art h2 { font-size: 1.5rem; font-weight: 700; line-height: 1.2; margin: 0; }
.blog-card-art h3 { font-size: 1.2rem; font-weight: 700; line-height: 1.25; margin: 0; }
.blog-card-body { padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 10px; }
.blog-card-meta { color: #64748b; font-size: 0.82rem; display: flex; gap: 6px; }
.blog-card-body p { color: #475569; line-height: 1.55; font-size: 0.94rem; margin: 0; }
.blog-card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.blog-card-tags span {
  background: rgba(99,102,241,0.08);
  color: #4f46e5;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 0.72rem;
  font-weight: 500;
}
.blog-card-cta {
  margin-top: auto;
  font-weight: 600;
  color: #4f46e5;
  font-size: 0.92rem;
}

.blog-card-feature .blog-card-link {
  grid-column: 1 / -1;
}
.blog-card-feature .blog-card-art { min-height: 220px; }

@media (max-width: 720px) {
  .blog-hero h1 { font-size: 2rem; }
  .blog-hero { padding: 36px 22px; }
}
</style>
