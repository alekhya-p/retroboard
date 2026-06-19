<template>
  <AppPage variant="marketing" class="ai-page">
    <section class="ai-hero">
      <div class="ai-hero-inner">
        <div class="ai-hero-text">
          <span class="ai-eyebrow">
            <span class="ai-eyebrow-dot"></span>
            AI-powered retro template generator
          </span>
          <h1>
            <span>Generate a custom</span>
            <span class="ai-hero-gradient">retrospective template</span>
            <span>from a single prompt</span>
          </h1>
          <p class="ai-lede">
            Describe your team, your sprint, or your theme - and our AI invents a fully formed retro
            format with columns, colors, prompts, and an action column. In about 8 seconds.
          </p>
          <div class="ai-hero-stats">
            <div><strong>~8 sec</strong><span>to first draft</span></div>
            <div><strong>3-6 columns</strong><span>per template</span></div>
            <div><strong>Free</strong><span>no credit card</span></div>
          </div>
        </div>
        <div class="ai-hero-art" aria-hidden="true">
          <div class="ai-orb">
            <span>✦</span>
          </div>
          <div class="ai-orb-ring"></div>
          <div class="ai-orb-ring ai-orb-ring-2"></div>
        </div>
      </div>
    </section>

    <section class="ai-card-wrap">
      <div class="ai-card" :class="{ 'ai-card-loading': generating }">
        <template v-if="!generating && !preview">
          <h2>What kind of retro do you want?</h2>
          <p class="ai-card-sub">
            Give the AI a one-sentence brief. The more flavor you add, the more interesting the format.
          </p>

          <textarea
            v-model="prompt"
            class="ai-textarea"
            rows="5"
            placeholder="e.g. A retro for the team that just finished hardening week, with a wrestling theme"
            :disabled="needsAuth"
          ></textarea>

          <div class="ai-suggestions">
            <p class="ai-suggestions-label">Inspiration</p>
            <div class="ai-suggestions-grid">
              <button
                v-for="s in suggestions"
                :key="s"
                type="button"
                class="ai-suggestion-chip"
                @click="prompt = s"
              >{{ s }}</button>
            </div>
          </div>

          <div class="ai-actions">
            <button
              class="btn btn--secondary"
              :disabled="!prompt || needsAuth"
              @click="generate"
            >
              <span class="ai-btn-sparkle">✨</span>
              Generate template
            </button>
            <router-link to="/boards/templates" class="btn btn--ghost">
              Browse 20 ready-made templates →
            </router-link>
          </div>

          <div v-if="errorMessage" class="ai-error" role="alert">
            <span class="ai-error-icon" aria-hidden="true">⚠️</span>
            <div class="ai-error-body">
              <p>{{ errorMessage }}</p>
              <button
                type="button"
                class="btn btn--ghost btn--sm ai-error-retry"
                :disabled="!prompt || needsAuth"
                @click="generate"
              >
                Try again
              </button>
            </div>
          </div>

          <p v-if="needsAuth" class="ai-auth-warning">
            You need to sign in to use the AI generator.
            <router-link to="/login?redirect=/ai-generator">Sign in</router-link>
            or use any of the
            <router-link to="/boards/templates">free preset templates</router-link>.
          </p>
        </template>

        <div v-else-if="generating" class="ai-loading">
          <div class="ai-loading-orb">
            <span>✦</span>
          </div>
          <div class="ai-loading-title">Crafting your template</div>
          <div class="ai-loading-tip" :key="loadingTip">{{ loadingTip }}</div>
          <div class="ai-loading-bar"><span></span></div>
          <div class="ai-loading-hint">This usually takes 5-15 seconds.</div>
        </div>

        <div v-else-if="preview" class="ai-preview">
          <nav class="ai-breadcrumb" aria-label="Breadcrumb">
            <button type="button" class="ai-breadcrumb-back" @click="goBackToPrompt">
              <span aria-hidden="true">←</span> Back to prompt
            </button>
            <span class="ai-breadcrumb-trail" aria-hidden="true">
              <span class="ai-breadcrumb-crumb">AI Generator</span>
              <span class="ai-breadcrumb-sep">/</span>
              <span class="ai-breadcrumb-current">Draft template</span>
            </span>
          </nav>

          <div class="ai-preview-head">
            <span class="ai-preview-eyebrow">Draft template</span>
            <h2>{{ preview.name }}</h2>
            <p>{{ preview.description }}</p>
          </div>

          <form class="ai-preview-form" @submit.prevent="createBoard">
            <div v-if="errorMessage" class="ai-error" role="alert">
              <span class="ai-error-icon" aria-hidden="true">⚠️</span>
              <div class="ai-error-body">
                <p>{{ errorMessage }}</p>
              </div>
            </div>

            <label class="ai-field-label">Board name</label>
            <input
              v-model="boardName"
              type="text"
              placeholder="e.g. Sprint 42 - Wrestling Retro"
              required
            />

            <label
              v-if="showBlockId"
              class="ai-field-label"
            >Team / group</label>
            <select v-if="showBlockId" v-model="blockId" required>
              <option value="" disabled>Select a group</option>
              <option v-for="group in userGroups" :key="group.id" :value="group.id">
                {{ group.name }}
              </option>
            </select>

            <div class="ai-preview-columns">
              <div
                v-for="col in preview.columns"
                :key="col.name"
                class="ai-preview-col"
                :style="{ borderTopColor: col.color }"
              >
                <div class="ai-preview-col-name">{{ col.name }}</div>
                <p>{{ col.description }}</p>
                <span v-if="col.is_action_column" class="ai-action-pill">Action column</span>
              </div>
            </div>

            <div class="ai-preview-actions">
              <button type="button" class="btn btn--ghost" @click="resetPreview">
                ← Try a different prompt
              </button>
              <button type="submit" class="btn btn--secondary" :disabled="creating">
                <span v-if="creating">Creating board…</span>
                <span v-else>Create board with this template</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <section class="ai-pillars">
      <div class="ai-pillars-inner">
        <h2>What you can ask the AI to invent</h2>
        <div class="ai-pillars-grid">
          <article>
            <span class="ai-pillar-emoji">🎬</span>
            <h3>Themed retros</h3>
            <p>Anchor your retro to a movie, a TV show, a sport, a season. Themed formats wake teams up that are tired of the standard four columns.</p>
          </article>
          <article>
            <span class="ai-pillar-emoji">🚀</span>
            <h3>Launch &amp; milestone retros</h3>
            <p>Customise the format to the work you just shipped: a new feature, a quarterly OKR review, an incident retrospective. The AI shapes columns around the story.</p>
          </article>
          <article>
            <span class="ai-pillar-emoji">🌐</span>
            <h3>Remote &amp; async friendly</h3>
            <p>Tell the AI you need an async-friendly format, and it will produce columns with prompt questions clear enough to answer cold, without a facilitator in the room.</p>
          </article>
          <article>
            <span class="ai-pillar-emoji">🧭</span>
            <h3>Goal-oriented retros</h3>
            <p>Need to focus on quality, morale, velocity, or risk? Describe the goal and the AI tailors the format to surface those signals first.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="ai-faq">
      <div class="ai-faq-inner">
        <h2>Frequently asked questions</h2>
        <div v-for="item in faq" :key="item.q" class="ai-faq-item">
          <h3>{{ item.q }}</h3>
          <p>{{ item.a }}</p>
        </div>
      </div>
    </section>
    <AppFooter />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';
import AppPage from '@/components/ui/AppPage.vue';
import { aiApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useBoardStore } from '@/stores/board';
import { applyHead, breadcrumbJsonLd, SITE_URL } from '@/utils/seo';
import { aiErrorMessage } from '@/utils/aiError';

interface DraftColumn {
  name: string;
  color: string;
  description: string;
  is_action_column: boolean;
}
interface DraftTemplate {
  name: string;
  shortDescription?: string;
  description: string;
  columns: DraftColumn[];
}

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const boardStore = useBoardStore();

const prompt = ref('');
const generating = ref(false);
const creating = ref(false);
const preview = ref<DraftTemplate | null>(null);
const boardName = ref('');
const blockId = ref('');
const errorMessage = ref('');

const needsAuth = computed(() => !authStore.isAuthenticated || authStore.user?.user_type === 'anonymous');

const showBlockId = computed(
  () => authStore.user?.user_type === 'microsoft' && (authStore.user.groups?.length ?? 0) > 1
);
const userGroups = computed(() =>
  authStore.user?.user_type === 'microsoft' ? (authStore.user.groups ?? []) : []
);

watch(
  () => authStore.user?.user_type,
  type => {
    if (type === 'google') blockId.value = authStore.user?.id ?? '';
    else if (type === 'email') blockId.value = authStore.user?.id ?? '';
    else if (type === 'microsoft') {
      blockId.value = authStore.user?.groups?.[0] ?? authStore.user?.id ?? '';
    }
  },
  { immediate: true }
);

const suggestions = [
  'A retro for the team that just finished hardening week, with a wrestling theme',
  'An async retro for a remote team across 4 time zones',
  'A risk-focused retro right before a major launch',
  'A morale check-in retro after a tough quarter',
  'A Star Wars themed retro for a hackathon team',
  'A retro that mixes engineering excellence and developer wellbeing'
];

const loadingTips = [
  'Brainstorming creative column ideas…',
  'Picking the perfect emojis and colors…',
  'Tailoring it to your prompt…',
  'Adding the finishing touches…'
];
const loadingTip = ref(loadingTips[0]);
let loadingTipTimer: ReturnType<typeof setInterval> | null = null;

const startLoadingTips = () => {
  let i = 0;
  loadingTip.value = loadingTips[0];
  loadingTipTimer = setInterval(() => {
    i = (i + 1) % loadingTips.length;
    loadingTip.value = loadingTips[i];
  }, 2200);
};
const stopLoadingTips = () => {
  if (loadingTipTimer) { clearInterval(loadingTipTimer); loadingTipTimer = null; }
};

const generate = async () => {
  if (!prompt.value || needsAuth.value) return;
  generating.value = true;
  errorMessage.value = '';
  startLoadingTips();
  try {
    const response = await aiApi.generateTemplate(prompt.value);
    preview.value = response.data as DraftTemplate;
    // Push a history entry so the browser/device Back button returns to the
    // prompt form instead of leaving the page. The route watcher below clears
    // the preview when this query param is removed (Back navigation).
    if (route.query.step !== 'preview') {
      router.push({ query: { ...route.query, step: 'preview' } });
    }
  } catch (e) {
    errorMessage.value = aiErrorMessage(e);
  } finally {
    generating.value = false;
    stopLoadingTips();
  }
};

const dismissPreview = () => {
  preview.value = null;
  boardName.value = '';
  errorMessage.value = '';
};

// When the user navigates Back (the `step=preview` query param disappears),
// dismiss the preview and show the prompt form again. This watcher only reads
// the route and never pushes, so it cannot loop with generate()'s push.
watch(
  () => route.query.step,
  step => {
    if (step !== 'preview' && preview.value) {
      dismissPreview();
    }
  }
);

const goBackToPrompt = () => {
  // Prefer real history navigation so the device Back button stays in sync.
  if (route.query.step === 'preview') {
    router.back();
  } else {
    dismissPreview();
  }
};

const resetPreview = () => {
  prompt.value = '';
  goBackToPrompt();
};

const createBoard = async () => {
  if (!preview.value || !boardName.value) return;
  creating.value = true;
  errorMessage.value = '';
  try {
    const board = await boardStore.createBoard({
      name: boardName.value,
      description: preview.value.description,
      block_id: blockId.value,
      columns: preview.value.columns.map(c => ({
        name: c.name,
        color: c.color,
        description: c.description,
        is_action_column: c.is_action_column
      }))
    });
    router.push(`/boards/${board.id}`);
  } catch (e) {
    errorMessage.value = aiErrorMessage(e);
  } finally {
    creating.value = false;
  }
};

const faq = [
  {
    q: 'What does the AI generator actually do?',
    a: 'It reads your one-line prompt and returns a complete retrospective format - a board name, description, and 3-6 columns with names, colors, prompt questions, and an action column at the end.'
  },
  {
    q: 'How does the AI generator work?',
    a: 'We use an advanced large language model under a no-training enterprise agreement. Your prompts and generated templates are not used to train any model. For the specific sub-processor we use, see our Privacy page.'
  },
  {
    q: 'Is the AI generator free?',
    a: 'Yes - all of reAItro, including the generator and AI summaries, is free today. We rate-limit heavy use to protect the service.'
  },
  {
    q: 'Can I edit the generated template?',
    a: 'Absolutely. The preview is a starting point. You can rename columns, change colors, tweak prompts, and even regenerate if the first draft isn\'t right.'
  },
  {
    q: 'What if I want a preset template instead?',
    a: 'Browse the 20 preset templates at /boards/templates. Each one has its own SEO-friendly page with facilitation tips, FAQs and example sticky prompts.'
  }
];

onMounted(() => {
  applyHead({
    title: 'AI Retrospective Template Generator · Custom retros in 8 seconds | reAItro',
    description:
      'Describe your team or your sprint and let our AI generate a fully formed retrospective template - columns, prompts, colors and an action column. Free, no credit card.',
    keywords:
      'AI retro generator, AI retrospective template, custom retrospective, generative AI agile, retro template generator, AI retro builder',
    canonical: `${SITE_URL}/ai-generator`,
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'AI Generator', path: '/ai-generator' }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'reAItro Generator',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description:
          'Generate custom agile retrospective templates from a single sentence prompt using AI.'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      }
    ]
  });
});

onBeforeUnmount(stopLoadingTips);
</script>

<style scoped>
.ai-page { width: 100%; }
.ai-hero {
  background:
    radial-gradient(900px 320px at 100% 0%, rgba(168,85,247,0.16), transparent 60%),
    radial-gradient(700px 280px at 0% 100%, rgba(236,72,153,0.12), transparent 60%),
    linear-gradient(135deg,#312e81 0%,#4c2a92 55%,#0f172a 100%);
  border-radius: 24px;
  margin: 0 auto 32px;
  max-width: 1180px;
  color: #fff;
  padding: 56px 36px;
  overflow: hidden;
  position: relative;
}
.ai-hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 32px;
  align-items: center;
}
.ai-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.24);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  margin-bottom: 18px;
}
.ai-eyebrow-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 4px rgba(52,211,153,0.25);
}
.ai-hero h1 {
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ai-hero-gradient {
  background: linear-gradient(90deg,#fbcfe8,#fde68a 55%,#a7f3d0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.ai-lede {
  color: rgba(241,245,249,0.86);
  font-size: 1.08rem;
  line-height: 1.55;
  max-width: 620px;
  margin: 0 0 22px;
}
.ai-hero-stats {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
}
.ai-hero-stats div { display: flex; flex-direction: column; gap: 2px; }
.ai-hero-stats strong { font-size: 1.15rem; }
.ai-hero-stats span { color: rgba(241,245,249,0.7); font-size: 0.82rem; }

.ai-hero-art {
  position: relative;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ai-orb {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), transparent 55%), linear-gradient(135deg,#6366f1,#8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2.4rem;
  box-shadow: 0 30px 80px -10px rgba(99,102,241,0.45);
}
.ai-orb-ring {
  position: absolute;
  width: 180px; height: 180px;
  border-radius: 50%;
  border: 1.5px solid rgba(168,85,247,0.22);
}
.ai-orb-ring-2 {
  width: 240px; height: 240px;
  border-color: rgba(99,102,241,0.16);
}

.ai-card-wrap {
  max-width: 760px;
  margin: -10px auto 40px;
}
.ai-card {
  background: rgba(255,255,255,0.96);
  border-radius: 24px;
  border: 1px solid rgba(15,23,42,0.06);
  box-shadow: 0 24px 60px -28px rgba(15,23,42,0.28);
  padding: 32px;
  transition: padding 0.2s;
}
.ai-card h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 6px;
  color: #0f172a;
}
.ai-card-sub { color: #64748b; margin: 0 0 16px; }

.ai-textarea {
  width: 100%;
  padding: 14px 16px;
  font-size: 0.98rem;
  border-radius: 14px;
  border: 1.5px solid rgba(15,23,42,0.1);
  outline: none;
  resize: vertical;
  background: #fafbff;
  font-family: inherit;
  transition: border 0.15s, box-shadow 0.15s;
}
.ai-textarea:focus {
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
}

.ai-suggestions { margin-top: 18px; }
.ai-suggestions-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: #64748b;
  margin: 0 0 8px;
}
.ai-suggestions-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.ai-suggestion-chip {
  background: rgba(99,102,241,0.08);
  color: #4f46e5;
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 0.84rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s, transform 0.15s;
  font-family: inherit;
  text-align: left;
}
.ai-suggestion-chip:hover { background: rgba(99,102,241,0.16); transform: translateY(-1px); }

.ai-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
}
.ai-btn-sparkle { display: inline-block; }

.ai-auth-warning {
  margin-top: 14px;
  font-size: 0.88rem;
  color: #b45309;
  background: rgba(251,191,36,0.12);
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(251,191,36,0.3);
}
.ai-auth-warning a { color: #4f46e5; text-decoration: underline; }

.ai-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  padding: 20px 0;
}
.ai-loading-orb {
  width: 90px; height: 90px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), transparent 55%), linear-gradient(135deg,#6366f1,#8b5cf6);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 1.8rem;
  box-shadow: 0 18px 40px -10px rgba(99,102,241,0.45);
  animation: ai-loading-orb 3.2s ease-in-out infinite;
}
@keyframes ai-loading-orb {
  0%, 100% { transform: scale(1); opacity: 0.92; }
  50% { transform: scale(1.02); opacity: 1; }
}
.ai-loading-title { font-size: 1.15rem; font-weight: 700; color: #0f172a; }
.ai-loading-tip { color: #475569; font-size: 0.95rem; min-height: 1.4em; }
.ai-loading-bar {
  width: 100%; max-width: 260px;
  height: 4px;
  border-radius: 999px;
  background: rgba(99,102,241,0.12);
  overflow: hidden;
  position: relative;
}
.ai-loading-bar span {
  position: absolute;
  inset: 0; width: 40%;
  border-radius: 999px;
  background: linear-gradient(90deg,#6366f1,#a855f7,#ec4899);
  animation: ai-bar 1.4s ease-in-out infinite;
}
@keyframes ai-bar { 0% { left: -40%; } 100% { left: 100%; } }
.ai-loading-hint { color: #94a3b8; font-size: 0.82rem; }

.ai-breadcrumb {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(15,23,42,0.08);
}
.ai-breadcrumb-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(99,102,241,0.08);
  color: #4f46e5;
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 999px;
  padding: 9px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  min-height: 40px;
}
.ai-breadcrumb-back:hover { background: rgba(99,102,241,0.14); }
.ai-breadcrumb-trail {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  color: #94a3b8;
}
.ai-breadcrumb-crumb { color: #64748b; }
.ai-breadcrumb-sep { color: #cbd5e1; }
.ai-breadcrumb-current { color: #0f172a; font-weight: 600; }

.ai-error {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.25);
}
.ai-error-icon { font-size: 1.1rem; line-height: 1.4; }
.ai-error-body { flex: 1; }
.ai-error-body p { margin: 0; color: #b91c1c; font-size: 0.92rem; line-height: 1.5; }
.ai-error-retry { margin-top: 10px; }

.ai-preview-head { text-align: left; margin-bottom: 20px; }
.ai-preview-eyebrow {
  background: rgba(99,102,241,0.12);
  color: #4f46e5;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.ai-preview-head h2 { font-size: 1.5rem; margin: 10px 0 6px; color: #0f172a; }
.ai-preview-head p { color: #475569; margin: 0; line-height: 1.55; }

.ai-field-label {
  font-size: 0.86rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
  display: block;
}
.ai-preview-form input,
.ai-preview-form select {
  width: 100%;
  padding: 12px 14px;
  font-size: 0.96rem;
  border-radius: 12px;
  border: 1.5px solid rgba(15,23,42,0.1);
  margin-bottom: 14px;
  background: #fafbff;
  outline: none;
  transition: border 0.15s;
  font-family: inherit;
}
.ai-preview-form input:focus,
.ai-preview-form select:focus { border-color: #6366f1; background: #fff; }

.ai-preview-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin: 18px 0;
}
.ai-preview-col {
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-top: 4px solid;
  border-radius: 12px;
  padding: 14px;
  display: flex; flex-direction: column; gap: 6px;
}
.ai-preview-col-name { font-weight: 700; color: #0f172a; font-size: 0.96rem; }
.ai-preview-col p { color: #475569; font-size: 0.85rem; line-height: 1.45; margin: 0; }
.ai-action-pill {
  align-self: flex-start;
  background: rgba(99,102,241,0.12);
  color: #4f46e5;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
}

.ai-preview-actions { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 10px; }

.ai-pillars {
  max-width: 1180px;
  margin: 0 auto 48px;
}
.ai-pillars-inner h2 {
  text-align: center;
  font-size: 1.6rem;
  margin: 0 0 22px;
  color: #0f172a;
}
.ai-pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.ai-pillars article {
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 4px 18px -10px rgba(15,23,42,0.12);
}
.ai-pillar-emoji { font-size: 1.6rem; }
.ai-pillars h3 { margin: 10px 0 6px; color: #0f172a; font-size: 1.05rem; }
.ai-pillars p { color: #475569; line-height: 1.55; font-size: 0.94rem; margin: 0; }

.ai-faq { max-width: 880px; margin: 0 auto 48px; }
.ai-faq h2 { font-size: 1.6rem; margin: 0 0 16px; color: #0f172a; }
.ai-faq-item {
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 10px;
}
.ai-faq-item h3 { margin: 0 0 6px; font-size: 1.02rem; color: #0f172a; }
.ai-faq-item p { margin: 0; color: #475569; line-height: 1.55; font-size: 0.95rem; }

@media (max-width: 900px) {
  .ai-hero { padding: 36px 24px; }
  .ai-hero-inner { grid-template-columns: 1fr; }
  .ai-hero-art { display: none; }
  .ai-hero h1 { font-size: 2rem; }
  .ai-card { padding: 24px 20px; }
}

@media (max-width: 600px) {
  .ai-card { padding: 20px 16px; border-radius: 18px; }
  /* Full-width, easy-to-tap back affordance on mobile */
  .ai-breadcrumb { gap: 10px; }
  .ai-breadcrumb-back { width: 100%; justify-content: center; min-height: 44px; }
  .ai-breadcrumb-trail { display: none; }
  /* Stack preview columns and actions for comfortable reading */
  .ai-preview-columns { grid-template-columns: 1fr; }
  .ai-preview-actions { flex-direction: column-reverse; align-items: stretch; }
  .ai-preview-actions .btn { width: 100%; justify-content: center; min-height: 44px; }
}

@media (prefers-reduced-motion: reduce) {
  .ai-loading-orb,
  .ai-loading-bar span { animation: none; }
}
</style>
