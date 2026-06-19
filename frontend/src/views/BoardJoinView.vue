<template>
  <AppPage variant="narrow" class="join-page">
    <section class="join-card surface">
      <span class="join-eyebrow">
        <span class="join-eyebrow-dot"></span>
        Joining as <strong>{{ displayName || 'Guest' }}</strong>
      </span>
      <h1>Join a retrospective board</h1>
      <p class="join-lede">
        Paste the board link or ID your facilitator shared. You'll jump straight into the live board -
        no waiting room, no extra setup.
      </p>

      <form class="join-form" @submit.prevent="joinBoard">
        <label class="join-label" for="board-id-input">Board link or ID</label>
        <div class="join-input-wrap">
          <input
            id="board-id-input"
            v-model="rawInput"
            type="text"
            class="join-input"
            placeholder="https://reaitro.com/boards/abc123 - or just abc123"
            required
            :disabled="loading"
            autocomplete="off"
          />
          <button
            type="button"
            class="btn btn--ghost join-paste"
            @click="pasteFromClipboard"
            :disabled="loading"
            aria-label="Paste from clipboard"
            title="Paste from clipboard"
          >Paste</button>
        </div>
        <p class="join-helper" v-if="parsedBoardId">
          Joining board <code>{{ parsedBoardId }}</code>
        </p>
        <p class="join-error" v-if="error">{{ error }}</p>

        <button class="btn btn--secondary btn--lg btn--block join-cta" type="submit" :disabled="loading || !parsedBoardId">
          <span v-if="loading" class="btn__spinner"></span>
          <span v-else>Join board →</span>
        </button>
      </form>

      <div class="join-divider"><span>need a place to start?</span></div>

      <div class="join-secondary">
        <router-link to="/boards/templates" class="join-secondary-card">
          <span class="join-secondary-emoji">🎨</span>
          <div>
            <strong>Browse templates</strong>
            <span>20 ready-made retrospective formats.</span>
          </div>
        </router-link>
        <router-link to="/ai-generator" class="join-secondary-card">
          <span class="join-secondary-emoji">✨</span>
          <div>
            <strong>AI generate a template</strong>
            <span>Custom retro format from a single prompt.</span>
          </div>
        </router-link>
      </div>

      <button type="button" class="btn btn--ghost btn--sm join-signout" @click="logout" :disabled="loading">
        Sign out
      </button>
    </section>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { boardApi } from '@/services/api';
import { applyHead, SITE_URL } from '@/utils/seo';
import AppPage from '@/components/ui/AppPage.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const rawInput = ref('');
const loading = ref(false);
const error = ref('');

const displayName = computed(() => authStore.user?.display_name ?? '');

const parsedBoardId = computed(() => {
  const value = rawInput.value.trim();
  if (!value) return '';
  const urlMatch = value.match(/\/boards\/([^/?#]+)/);
  if (urlMatch) return urlMatch[1];
  if (/^[A-Za-z0-9_-]{4,}$/.test(value)) return value;
  return '';
});

onMounted(() => {
  applyHead({
    title: 'Join a Retrospective Board · reAItro',
    description:
      'Join an existing retrospective board with a link or board ID. Real-time collaboration for distributed agile teams.',
    keywords: 'join retrospective, board id, retro board link, team retrospective collaboration',
    canonical: `${SITE_URL}/join-board`
  });
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }
  if (typeof route.query.board === 'string') {
    rawInput.value = route.query.board;
  }
});

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText();
    rawInput.value = text.trim();
  } catch {
    error.value = 'Your browser blocked clipboard access - paste manually with Ctrl/Cmd+V.';
  }
};

const joinBoard = async () => {
  if (!parsedBoardId.value) {
    error.value = 'Please paste a valid board link or ID.';
    return;
  }
  error.value = '';
  try {
    loading.value = true;
    await boardApi.getBoard(parsedBoardId.value);
    router.push(`/boards/${parsedBoardId.value}`);
  } catch {
    error.value = 'Board not found, or you do not have access to it. Double-check the link with your facilitator.';
  } finally {
    loading.value = false;
  }
};

const logout = async () => {
  try {
    loading.value = true;
    await authStore.logout();
    router.push('/login');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Decorative full-bleed background; layout/width handled by AppPage */
.join-page {
  position: relative;
  min-height: 100vh;
}
.join-page::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(900px 600px at 10% -10%, rgba(99,102,241,0.16), transparent 60%),
    radial-gradient(800px 600px at 95% 10%, rgba(236,72,153,0.14), transparent 55%),
    #f5f6fb;
}

.join-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.join-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(99,102,241,0.1);
  color: #4f46e5;
  border: 1px solid rgba(99,102,241,0.2);
  font-size: 0.82rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 999px;
  width: fit-content;
}
.join-eyebrow strong { color: #312e81; font-weight: 600; }
.join-eyebrow-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 4px rgba(52,211,153,0.25);
}
.join-card h1 {
  margin: 6px 0 0;
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #0f172a;
}
.join-lede { margin: 0; color: #475569; line-height: 1.55; font-size: 0.98rem; }

.join-form { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
.join-label { font-size: 0.84rem; font-weight: 600; color: #1e293b; }
.join-input-wrap {
  display: flex;
  gap: 8px;
  align-items: center;
}
.join-input {
  flex: 1;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid rgba(15,23,42,0.1);
  background: #fafbff;
  font-size: 0.96rem;
  outline: none;
  transition: border 0.15s, box-shadow 0.15s;
  font-family: inherit;
}
.join-input:focus {
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
}
.join-paste { flex-shrink: 0; }
.join-helper { margin: 6px 0 0; color: #64748b; font-size: 0.84rem; }
.join-helper code { background: rgba(99,102,241,0.1); color: #4f46e5; padding: 2px 6px; border-radius: 6px; }
.join-error {
  margin: 6px 0 0;
  color: #b91c1c;
  font-size: 0.86rem;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.25);
  padding: 8px 12px;
  border-radius: 10px;
}
.join-cta { margin-top: 12px; }

.join-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
  font-size: 0.82rem;
  margin-top: 6px;
}
.join-divider::before, .join-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(15,23,42,0.08);
}

.join-secondary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.join-secondary-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 14px;
  padding: 14px 16px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.18s, box-shadow 0.18s;
}
.join-secondary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -14px rgba(15,23,42,0.18);
}
.join-secondary-emoji { font-size: 1.4rem; }
.join-secondary-card strong { display: block; color: #0f172a; font-size: 0.95rem; }
.join-secondary-card span { color: #64748b; font-size: 0.82rem; line-height: 1.4; }

.join-signout { align-self: center; margin-top: 6px; }

@media (max-width: 600px) {
  .join-card h1 { font-size: 1.55rem; }
  .join-secondary { grid-template-columns: 1fr; }
}
</style>
