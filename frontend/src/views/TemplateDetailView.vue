<template>
  <AppPage v-if="template" variant="marketing" class="tpl-page">
    <section class="tpl-hero" :style="{ background: heroBackground }">
      <div class="tpl-hero-inner">
        <nav class="tpl-breadcrumbs" aria-label="Breadcrumb">
          <router-link to="/">Home</router-link>
          <span>›</span>
          <router-link to="/boards/templates">Templates</router-link>
          <span>›</span>
          <span class="tpl-current">{{ template.displayName }}</span>
        </nav>

        <div class="tpl-hero-grid">
          <div class="tpl-hero-text">
            <span class="tpl-eyebrow">
              <span class="tpl-eyebrow-dot"></span>
              {{ template.columns.length }} columns · {{ actionColumnsLabel }}
            </span>
            <h1>
              <span class="tpl-emoji" aria-hidden="true">{{ template.emoji }}</span>
              <span>{{ template.displayName }} retrospective template</span>
            </h1>
            <p class="tpl-lede">{{ template.shortDescription }}</p>
            <div class="tpl-actions">
              <button class="btn btn--primary btn--lg" @click="useTemplate">
                <span>Use this template</span>
                <span aria-hidden="true">→</span>
              </button>
              <router-link class="btn btn--outline btn--lg" to="/ai-generator">
                ✨ Generate a custom one
              </router-link>
            </div>
            <div class="tpl-stats">
              <div>
                <strong>{{ template.columns.length }}</strong>
                <span>columns</span>
              </div>
              <div>
                <strong>~30 min</strong>
                <span>typical run-time</span>
              </div>
              <div>
                <strong>AI summary</strong>
                <span>one-click at the end</span>
              </div>
            </div>
          </div>
          <div class="tpl-hero-board" aria-hidden="true">
            <div
              v-for="col in template.columns"
              :key="col.name"
              class="tpl-mini-column"
              :style="{ borderTopColor: col.color }"
            >
              <div class="tpl-mini-title">{{ col.name }}</div>
              <div class="tpl-mini-sticky" :style="{ background: col.color + '1a' }"></div>
              <div class="tpl-mini-sticky" :style="{ background: col.color + '14' }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="tpl-section">
      <div class="tpl-section-inner">
        <h2>What is the {{ template.displayName }} retrospective?</h2>
        <p>{{ template.longSummary }}</p>
      </div>
    </section>

    <section class="tpl-section tpl-section-alt">
      <div class="tpl-section-inner">
        <h2>The columns</h2>
        <p class="tpl-section-sub">
          Each column in {{ template.displayName }} prompts a specific kind of contribution from the team.
          {{ template.columns.length }} columns total - {{ actionColumnsCount }} action column{{ actionColumnsCount === 1 ? '' : 's' }} at the end to capture next steps.
        </p>
        <div class="tpl-columns-grid">
          <article
            v-for="col in template.columns"
            :key="col.name"
            class="tpl-column-card"
            :style="{ borderTopColor: col.color }"
          >
            <div class="tpl-column-badge" :style="{ background: col.color + '22', color: col.color }">
              {{ col.name }}
            </div>
            <p>{{ col.description }}</p>
            <span v-if="col.is_action_column" class="tpl-action-pill">Action column</span>
          </article>
        </div>
      </div>
    </section>

    <section class="tpl-section">
      <div class="tpl-section-inner">
        <h2>When to use {{ template.displayName }}</h2>
        <ul class="tpl-best-for">
          <li v-for="item in template.bestFor" :key="item">{{ item }}</li>
        </ul>
      </div>
    </section>

    <section class="tpl-section tpl-section-alt">
      <div class="tpl-section-inner">
        <h2>How to run it (step by step)</h2>
        <ol class="tpl-steps">
          <li v-for="(step, i) in template.steps" :key="step.title">
            <span class="tpl-step-num">{{ i + 1 }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.detail }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="tpl-section">
      <div class="tpl-section-inner">
        <h2>Facilitator tips for {{ template.displayName }}</h2>
        <ul class="tpl-tips">
          <li v-for="tip in template.facilitatorTips" :key="tip">{{ tip }}</li>
        </ul>
      </div>
    </section>

    <section class="tpl-section tpl-section-alt">
      <div class="tpl-section-inner">
        <h2>Frequently asked questions</h2>
        <div class="tpl-faq" v-for="item in faq" :key="item.q">
          <h3>{{ item.q }}</h3>
          <p>{{ item.a }}</p>
        </div>
      </div>
    </section>

    <section v-if="relatedTemplates.length" class="tpl-section">
      <div class="tpl-section-inner">
        <h2>Related retrospective templates</h2>
        <div class="tpl-related-grid">
          <router-link
            v-for="rel in relatedTemplates"
            :key="rel.slug"
            :to="`/templates/${rel.slug}`"
            class="tpl-related-card"
            :style="{ borderTopColor: rel.columns[0]?.color || '#6366f1' }"
          >
            <span class="tpl-related-emoji">{{ rel.emoji }}</span>
            <div>
              <strong>{{ rel.displayName }}</strong>
              <p>{{ rel.shortDescription }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <section class="tpl-cta-banner">
      <div class="tpl-cta-banner-inner">
        <div>
          <h2>Run a {{ template.displayName }} retro in 30 seconds</h2>
          <p>Real-time collaboration, AI summaries, AI-generated action items - all free.</p>
        </div>
        <button class="btn btn--primary btn--lg" @click="useTemplate">Start now →</button>
      </div>
    </section>

    <AppFooter />
  </AppPage>
  <div v-else class="tpl-not-found">
    <h1>Template not found</h1>
    <p>The template you're looking for doesn't exist.</p>
    <router-link to="/boards/templates" class="btn btn--primary btn--lg">Browse all templates</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';
import AppPage from '@/components/ui/AppPage.vue';
import {
  findTemplateBySlug,
  templateMetas,
  type TemplateMeta
} from '@/content/templateMeta';
import { applyHead, breadcrumbJsonLd, SITE_URL } from '@/utils/seo';

const route = useRoute();
const router = useRouter();

const template = computed<TemplateMeta | undefined>(() =>
  findTemplateBySlug(route.params.slug as string)
);

const actionColumnsCount = computed(
  () => template.value?.columns.filter(c => c.is_action_column).length ?? 0
);

const actionColumnsLabel = computed(() =>
  actionColumnsCount.value
    ? `${actionColumnsCount.value} action column${actionColumnsCount.value === 1 ? '' : 's'}`
    : 'discussion focused'
);

const heroBackground = computed(() => {
  const colors = template.value?.columns.slice(0, 3).map(c => c.color) ?? ['#6366f1', '#a855f7', '#ec4899'];
  while (colors.length < 3) colors.push('#6366f1');
  return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 55%, ${colors[2]} 100%)`;
});

const faq = computed(() => template.value ? [
  {
    q: `How long does a ${template.value.displayName} retrospective take?`,
    a: `Most teams complete a ${template.value.displayName} retro in 45-60 minutes for a 2-week sprint. Larger retros (quarterly, post-launch) can run 90 minutes.`
  },
  {
    q: `Is the ${template.value.displayName} template free?`,
    a: `Yes. All ${templateMetas.length} retrospective templates in reAItro - including ${template.value.displayName} - are free, with AI summaries and action items included.`
  },
  {
    q: `Can I run a ${template.value.displayName} retro remotely or async?`,
    a: `Absolutely. reAItro is built for live, remote, hybrid and async retros. Stickies sync in real time and the AI summary can be generated after the team has had time to contribute over a day or two.`
  },
  {
    q: 'Do I get AI summaries with this template?',
    a: 'Yes. Every board in reAItro supports one-click AI summaries and SMART action item extraction.'
  }
] : []);

const relatedTemplates = computed<TemplateMeta[]>(() =>
  (template.value?.related ?? [])
    .map(slug => findTemplateBySlug(slug))
    .filter((t): t is TemplateMeta => !!t)
    .slice(0, 4)
);

const useTemplate = () => {
  router.push({ path: '/boards/templates', query: { use: template.value?.slug } });
};

const updateHead = () => {
  if (!template.value) {
    applyHead({
      title: 'Template not found · reAItro',
      description: 'The requested retrospective template was not found.',
      canonical: `${SITE_URL}/templates`
    });
    return;
  }
  const t = template.value;
  const canonical = `${SITE_URL}/templates/${t.slug}`;
  applyHead({
    title: `${t.displayName} Retrospective Template · Free + AI Summary | reAItro`,
    description: `${t.shortDescription} - run the ${t.displayName} retrospective free on reAItro with real-time collaboration and one-click AI summaries.`,
    keywords: `${t.displayName} retrospective, ${t.displayName} retro template, agile retrospective, scrum retro, ${t.displayName} format, AI retrospective`,
    canonical,
    type: 'article',
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Templates', path: '/boards/templates' },
        { name: t.displayName, path: `/templates/${t.slug}` }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to run a ${t.displayName} retrospective`,
        description: t.description,
        totalTime: 'PT45M',
        step: t.steps.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.title,
          text: s.detail
        }))
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.value.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a }
        }))
      }
    ]
  });
};

onMounted(updateHead);
watch(() => route.params.slug, updateHead);
</script>

<style scoped>
.tpl-hero {
  border-radius: 24px;
  margin: 0 0 32px;
  color: #fff;
  padding: 36px 36px 48px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 30px 60px -30px rgba(15,23,42,0.4);
}
.tpl-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(2px 2px at 18% 24%, rgba(255,255,255,0.45), transparent 60%),
    radial-gradient(1.6px 1.6px at 80% 60%, rgba(255,255,255,0.35), transparent 60%),
    radial-gradient(2px 2px at 55% 80%, rgba(255,255,255,0.3), transparent 60%);
  opacity: 0.5;
  pointer-events: none;
}
.tpl-hero-inner { position: relative; z-index: 1; }
.tpl-breadcrumbs {
  display: flex;
  gap: 8px;
  font-size: 0.86rem;
  color: rgba(255,255,255,0.85);
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.tpl-breadcrumbs a { color: inherit; text-decoration: none; opacity: 0.85; }
.tpl-breadcrumbs a:hover { opacity: 1; }
.tpl-current { color: #fff; font-weight: 600; }
.tpl-hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 36px;
  align-items: center;
}
.tpl-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.25);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
  margin-bottom: 16px;
}
.tpl-eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 4px rgba(52,211,153,0.25);
}
.tpl-hero-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 14px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.tpl-emoji { font-size: 2.4rem; line-height: 1; }
.tpl-lede {
  font-size: 1.08rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  margin: 0 0 22px;
}
.tpl-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
.tpl-stats {
  display: flex;
  gap: 24px;
  font-size: 0.95rem;
  flex-wrap: wrap;
}
.tpl-stats > div { display: flex; flex-direction: column; gap: 2px; }
.tpl-stats strong { font-size: 1.1rem; font-weight: 700; color: #fff; }
.tpl-stats span { color: rgba(255,255,255,0.78); font-size: 0.85rem; }

.tpl-hero-board {
  background: rgba(15,23,42,0.18);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 18px;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
  backdrop-filter: blur(6px);
}
.tpl-mini-column {
  background: rgba(255,255,255,0.95);
  border-radius: 10px;
  padding: 10px 8px;
  border-top: 4px solid;
  color: #0f172a;
  font-size: 0.74rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tpl-mini-title {
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.2;
  min-height: 28px;
}
.tpl-mini-sticky {
  height: 18px;
  border-radius: 4px;
}

.tpl-section { padding: 36px 24px; }
.tpl-section-alt { background: rgba(99,102,241,0.04); border-radius: 24px; }
.tpl-section-inner { max-width: 1080px; margin: 0 auto; }
.tpl-section h2 { font-size: 1.6rem; font-weight: 700; margin: 0 0 12px; color: #0f172a; letter-spacing: -0.01em; }
.tpl-section p { color: #334155; line-height: 1.65; max-width: 800px; }
.tpl-section-sub { margin-bottom: 22px; }

.tpl-columns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.tpl-column-card {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  border-top: 5px solid;
  box-shadow: 0 4px 14px -6px rgba(15,23,42,0.12);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tpl-column-badge {
  font-weight: 600;
  font-size: 0.95rem;
  padding: 6px 10px;
  border-radius: 8px;
  align-self: flex-start;
}
.tpl-column-card p { color: #475569; font-size: 0.92rem; line-height: 1.55; margin: 0; }
.tpl-action-pill {
  align-self: flex-start;
  background: rgba(99,102,241,0.12);
  color: #4f46e5;
  font-size: 0.74rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}

.tpl-best-for { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; padding: 0; list-style: none; margin: 0; }
.tpl-best-for li {
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 12px;
  padding: 12px 16px;
  color: #1e293b;
  font-size: 0.95rem;
}

.tpl-steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
.tpl-steps li { display: flex; gap: 14px; background: #fff; padding: 16px 18px; border-radius: 14px; box-shadow: 0 4px 14px -8px rgba(15,23,42,0.14); }
.tpl-step-num {
  flex-shrink: 0;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg,#6366f1,#a855f7);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
}
.tpl-steps h3 { margin: 0 0 4px; font-size: 1.05rem; color: #0f172a; }
.tpl-steps p { margin: 0; color: #475569; font-size: 0.94rem; }

.tpl-tips { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.tpl-tips li {
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  color: #1e293b;
  border-left: 3px solid #6366f1;
  font-size: 0.95rem;
}

.tpl-faq { background: #fff; border-radius: 12px; padding: 16px 18px; margin-bottom: 10px; box-shadow: 0 2px 8px -4px rgba(15,23,42,0.08); }
.tpl-faq h3 { margin: 0 0 6px; font-size: 1.02rem; color: #0f172a; }
.tpl-faq p { margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.55; }

.tpl-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.tpl-related-card {
  background: #fff;
  border-top: 4px solid;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  gap: 14px;
  text-decoration: none;
  color: #0f172a;
  box-shadow: 0 4px 14px -8px rgba(15,23,42,0.14);
  transition: transform 0.18s, box-shadow 0.18s;
}
.tpl-related-card:hover { transform: translateY(-3px); box-shadow: 0 14px 28px -14px rgba(15,23,42,0.18); }
.tpl-related-emoji { font-size: 1.8rem; }
.tpl-related-card strong { display: block; font-size: 1rem; margin-bottom: 4px; }
.tpl-related-card p { margin: 0; color: #64748b; font-size: 0.86rem; line-height: 1.45; }

.tpl-cta-banner {
  margin: 36px 0;
  background: linear-gradient(135deg,#6366f1,#a855f7,#ec4899);
  border-radius: 22px;
  padding: 28px 36px;
  color: #fff;
  box-shadow: 0 22px 50px -22px rgba(99,102,241,0.55);
}
.tpl-cta-banner-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
}
.tpl-cta-banner h2 { margin: 0; font-size: 1.4rem; color: #fff; }
.tpl-cta-banner p { margin: 6px 0 0; color: rgba(255,255,255,0.88); }

.tpl-not-found { max-width: 600px; margin: 80px auto; text-align: center; padding: 0 24px; }
.tpl-not-found h1 { font-size: 2rem; margin-bottom: 12px; }
.tpl-not-found p { color: #64748b; margin-bottom: 18px; }

@media (max-width: 900px) {
  .tpl-hero { padding: 24px 22px 36px; }
  .tpl-hero-grid { grid-template-columns: 1fr; gap: 22px; }
  .tpl-hero-text h1 { font-size: 1.9rem; }
  .tpl-hero-board { grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); }
  .tpl-cta-banner { padding: 22px 22px; }
}
</style>
