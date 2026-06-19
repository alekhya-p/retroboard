<template>
  <AppPage v-if="page" variant="marketing" class="landing-page">
    <section class="landing-hero" :style="{ background: page.gradient }">
      <div class="landing-hero-inner">
        <nav class="landing-breadcrumbs" aria-label="Breadcrumb">
          <router-link to="/">Home</router-link>
          <span aria-hidden="true">›</span>
          <span class="landing-current">{{ page.heroEyebrow }}</span>
        </nav>
        <span class="landing-eyebrow">{{ page.heroEyebrow }}</span>
        <h1>{{ page.h1 }}</h1>
        <p class="landing-subtitle">{{ page.subtitle }}</p>
        <div class="landing-cta-row">
          <router-link to="/boards/templates" class="btn btn--primary btn--lg">
            Browse templates →
          </router-link>
          <router-link to="/ai-generator" class="btn btn--outline btn--lg">
            Try the AI generator
          </router-link>
        </div>
      </div>
    </section>

    <article class="landing-body">
      <div class="landing-content" v-html="page.body"></div>

      <section v-if="page.faq?.length" class="landing-faq">
        <h2>Frequently asked questions</h2>
        <details v-for="(item, i) in page.faq" :key="i" class="landing-faq-item">
          <summary>{{ item.q }}</summary>
          <p>{{ item.a }}</p>
        </details>
      </section>

      <section v-if="page.related?.length" class="landing-related">
        <h2>Keep reading</h2>
        <div class="landing-related-grid">
          <router-link
            v-for="rel in page.related"
            :key="rel.path"
            :to="rel.path"
            class="landing-related-card"
          >
            <strong>{{ rel.label }}</strong>
            <span>{{ rel.path }}</span>
          </router-link>
        </div>
      </section>
    </article>

    <section class="landing-bottom-cta">
      <div>
        <h2>Run your next retrospective on reAItro</h2>
        <p>Free. Real-time collaboration. AI summaries and SMART action items in one click.</p>
      </div>
      <router-link to="/boards/templates" class="btn btn--primary btn--lg">
        Get started →
      </router-link>
    </section>

    <AppFooter />
  </AppPage>
  <div v-else class="landing-not-found">
    <h1>Page not found</h1>
    <router-link to="/" class="btn btn--primary btn--lg">Back home</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';
import AppPage from '@/components/ui/AppPage.vue';
import { landingPageMap } from '@/content/landingPages';
import { applyHead, breadcrumbJsonLd, SITE_URL } from '@/utils/seo';

const route = useRoute();

const page = computed(() => landingPageMap[route.path]);

function buildHead() {
  if (!page.value) return;
  const p = page.value;
  applyHead({
    title: p.title,
    description: p.metaDescription,
    keywords: p.keywords,
    canonical: `${SITE_URL}${p.path}`,
    type: 'website',
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: p.heroEyebrow, path: p.path }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: p.faq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: p.title,
        url: `${SITE_URL}${p.path}`,
        description: p.metaDescription,
        isPartOf: { '@type': 'WebSite', name: 'reAItro', url: SITE_URL }
      }
    ]
  });
}

onMounted(buildHead);
watch(() => route.path, buildHead);
</script>

<style scoped>
.landing-hero {
  color: #fff;
  border-radius: 24px;
  padding: 56px 40px;
  margin: 0 0 32px;
  position: relative;
  overflow: hidden;
}
.landing-hero-inner { max-width: 780px; position: relative; }
.landing-breadcrumbs {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.85);
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}
.landing-breadcrumbs a {
  color: rgba(255,255,255,0.85);
  text-decoration: none;
}
.landing-breadcrumbs a:hover { color: #fff; text-decoration: underline; }
.landing-current { color: rgba(255,255,255,0.95); }
.landing-eyebrow {
  display: inline-block;
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.28);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
  margin-bottom: 16px;
}
.landing-hero h1 {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
}
.landing-subtitle {
  font-size: 1.1rem;
  color: rgba(241,245,249,0.92);
  line-height: 1.55;
  margin: 0 0 28px;
  max-width: 680px;
}
.landing-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }

.landing-body {
  display: grid;
  gap: 36px;
  padding: 0 4px;
}
.landing-content {
  font-size: 1.02rem;
  line-height: 1.7;
  color: #1e293b;
  max-width: 820px;
}
.landing-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 36px 0 14px;
  letter-spacing: -0.01em;
  color: #0f172a;
}
.landing-content :deep(h3) {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 24px 0 8px;
  color: #0f172a;
}
.landing-content :deep(p) { margin: 0 0 14px; }
.landing-content :deep(ul),
.landing-content :deep(ol) { padding-left: 1.2rem; margin: 0 0 16px; }
.landing-content :deep(li) { margin: 4px 0; }
.landing-content :deep(a) { color: #4f46e5; text-decoration: underline; }
.landing-content :deep(a:hover) { color: #3730a3; }
.landing-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 0.95rem;
}
.landing-content :deep(th),
.landing-content :deep(td) {
  border: 1px solid #e2e8f0;
  padding: 10px 12px;
  text-align: left;
  vertical-align: top;
}
.landing-content :deep(th) {
  background: #f8fafc;
  font-weight: 600;
}

.landing-faq { max-width: 820px; }
.landing-faq h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 16px;
  color: #0f172a;
}
.landing-faq-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 10px;
  background: #fff;
}
.landing-faq-item summary {
  font-weight: 600;
  cursor: pointer;
  color: #0f172a;
  list-style: none;
}
.landing-faq-item summary::-webkit-details-marker { display: none; }
.landing-faq-item[open] summary { margin-bottom: 10px; }
.landing-faq-item p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.landing-related { max-width: 820px; }
.landing-related h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 16px;
  color: #0f172a;
}
.landing-related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}
.landing-related-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-decoration: none;
  color: inherit;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 18px;
  background: #fff;
  transition: transform 0.15s, border-color 0.15s;
}
.landing-related-card:hover {
  transform: translateY(-2px);
  border-color: #c7d2fe;
}
.landing-related-card strong { color: #0f172a; font-size: 0.98rem; }
.landing-related-card span { color: #64748b; font-size: 0.82rem; }

.landing-bottom-cta {
  margin: 48px 0 24px;
  background: linear-gradient(135deg,#0f172a 0%,#312e81 60%,#6366f1 100%);
  color: #fff;
  border-radius: 20px;
  padding: 32px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.landing-bottom-cta h2 {
  margin: 0 0 8px;
  font-size: 1.4rem;
  font-weight: 700;
}
.landing-bottom-cta p {
  margin: 0;
  color: rgba(241,245,249,0.85);
}

.landing-not-found {
  padding: 80px 20px;
  text-align: center;
}

@media (max-width: 720px) {
  .landing-hero { padding: 40px 22px; }
  .landing-hero h1 { font-size: 2rem; }
  .landing-bottom-cta { padding: 24px 22px; }
}
</style>
