<template>
  <AppPage variant="marketing">
    <section class="templates-hero">
      <div class="templates-hero-inner">
        <div class="templates-header-titles">
          <span class="hero-eyebrow">
            <span class="hero-dot"></span>
            {{ templates.length }} ready-to-use templates
          </span>
          <h1>Choose a <span class="hero-accent">retrospective</span> template</h1>
          <div class="templates-subtitle">
            Pick a proven format to kick off your retro in seconds - or let AI craft a custom one tailored to your team.
          </div>
          <div class="hero-actions">
            <button class="btn btn--primary" @click="clickAI">
              <span class="ai-btn-icon">✨</span> AI Generate Template
            </button>
            <a class="btn btn--ghost hero-browse" href="#templates-grid">Browse all</a>
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="hero-card hero-card-1"></div>
          <div class="hero-card hero-card-2"></div>
          <div class="hero-card hero-card-3"></div>
        </div>
      </div>
    </section>

    <div id="templates-grid" class="templates-grid">
      <div
        v-for="template in templates"
        :key="template.name"
        class="template-card-modern"
        :style="{ borderTop: '5px solid ' + (template.columns[0]?.color || '#2563eb') }"
        @click="selectTemplate(template)"
      >
        <div class="template-card-icon" :style="{ background: (template.columns[0]?.color || '#2563eb') + '22' }">
          <span>{{ template.name.split(' ')[0] || '📋' }}</span>
        </div>
        <div class="template-card-content">
          <div class="template-card-title">{{ template.name.split(' ').slice(1).join(' ') }}</div>
          <div class="template-card-desc">{{ template.shortDescription }}</div>
        </div>
        <div class="template-card-actions">
          <router-link
            class="template-learn-link"
            :to="`/templates/${slugFor(template)}`"
            @click.stop
          >Learn more</router-link>
          <button
            class="btn btn--primary btn--sm"
            @click.stop="selectTemplate(template)"
          >Use template</button>
        </div>
      </div>
    </div>

    <!-- Template Details Dialog -->
    <BaseDialog
      :open="showDetails"
      :title="selectedTemplate?.name"
      size="lg"
      mobile="sheet"
      @close="showDetails = false"
    >
      <div class="modal-desc">{{ selectedTemplate?.description }}</div>
      <div class="modal-columns-list">
        <div v-for="column in selectedTemplate.columns" :key="column.name" class="modal-column-row">
          <div class="modal-column-icon" :style="{ background: (column.color || '#2563eb') + '22', borderColor: column.color || '#2563eb' }">
            <span>{{ column.icon }}</span>
          </div>
          <div class="modal-column-content">
            <div class="modal-column-name">{{ column.name }}</div>
            <div class="modal-column-desc">{{ column.description }}</div>
          </div>
        </div>
      </div>
      <form id="create-board-form" @submit.prevent="createBoard" class="modal-form">
        <input
          v-model="boardName"
          type="text"
          placeholder="Board Name"
          required
        />
        <select
          v-if="showBlockId"
          v-model="blockId"
          required
        >
          <option value="" disabled>Select a group</option>
          <option v-for="group in userGroups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
      </form>
      <template #actions>
        <button type="button" class="btn btn--ghost" @click="showDetails = false">Cancel</button>
        <button type="submit" form="create-board-form" class="btn btn--primary" :disabled="loading">
          <span v-if="loading">Creating..</span>
          <span v-else>Create Board</span>
        </button>
      </template>
    </BaseDialog>

    <!-- AI Template Generation Dialog -->
    <BaseDialog
      :open="showAiDialog"
      :title="generatingTemplate ? '' : 'Generate AI Template'"
      size="md"
      mobile="sheet"
      :persistent="generatingTemplate"
      :hide-close="generatingTemplate"
      @close="showAiDialog = false"
    >
      <template v-if="!generatingTemplate">
        <div class="ai-modal-subtitle">What's on your mind? How would you like to create your template?</div>
        <textarea
          class="ai-modal-textarea"
          v-model="aiPrompt"
          placeholder="e.g. A retro for our launch week, focused on what surprised us"
          rows="4"
          required
        ></textarea>
        <div class="ai-prompt-suggestions">
          <button
            v-for="suggestion in promptSuggestions"
            :key="suggestion"
            type="button"
            class="ai-prompt-chip"
            @click="aiPrompt = suggestion"
          >{{ suggestion }}</button>
        </div>
      </template>
      <div v-else class="ai-loading-state" role="status" aria-live="polite">
        <div class="ai-loading-orb">
          <span class="ai-loading-orb-spark">✦</span>
        </div>
        <div class="ai-loading-title">Crafting your template</div>
        <div class="ai-loading-tip" :key="loadingTip">{{ loadingTip }}</div>
        <div class="ai-loading-bar"><span></span></div>
        <div class="ai-loading-hint">This usually takes 5-15 seconds.</div>
      </div>
      <template v-if="!generatingTemplate" #actions>
        <button class="btn btn--ghost" @click="showAiDialog = false">Cancel</button>
        <button
          class="btn btn--primary"
          :disabled="!aiPrompt"
          @click="generateAiTemplate"
        >Generate Template</button>
      </template>
    </BaseDialog>

    <!-- Guest notice -->
    <BaseDialog
      :open="showGuestModal"
      title="Feature Unavailable for Guests"
      size="sm"
      mobile="dialog"
      @close="showGuestModal = false"
    >
      <p class="guest-text">This feature is only available for signed-in users. Please sign in to use AI template generation and advanced features.</p>
      <template #actions>
        <button class="btn btn--primary" @click="showGuestModal = false">Close</button>
      </template>
    </BaseDialog>
  </AppPage>
  <AppFooter />
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import AppFooter from '@/components/AppFooter.vue';
import AppPage from '@/components/ui/AppPage.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import { useRouter, useRoute } from 'vue-router';
import { useBoardStore } from '@/stores/board';
import { useAuthStore } from '@/stores/auth';
import { aiApi } from '@/services/api';
import templates from '@/templates.json';
import { slugify } from '@/utils/seo';
import { useToast } from '@/composables/useToast';
import { aiErrorMessage } from '@/utils/aiError';

const toast = useToast();

const slugFor = (tpl: any) => slugify(tpl.name.split(' ').slice(1).join(' ') || tpl.name);

const router = useRouter();
const route = useRoute();
const boardStore = useBoardStore();
const authStore = useAuthStore();

const showDetails = ref(false);
const selectedTemplate = ref<any>(null);
const boardName = ref('');
const blockId = ref('');
const valid = ref(false);
const loading = ref(false);
const showAiDialog = ref(false);
const aiPrompt = ref('');
const generatingTemplate = ref(false);
const showGuestModal = ref(false);

const promptSuggestions = [
  'A sprint retro focused on team morale',
  'A launch retro for a new feature release',
  'A quarterly retro with appreciation and goals'
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
  if (loadingTipTimer) {
    clearInterval(loadingTipTimer);
    loadingTipTimer = null;
  }
};

const canUserCreateBoard = computed(() => {
  return authStore.user && authStore.user?.user_type != 'anonymous';
});

const showBlockId = computed(() => {
  return authStore.user?.user_type === 'microsoft' && authStore.user?.groups?.length > 1;
});

const userGroups = computed(() => {
  if (authStore.user?.user_type === 'microsoft') {
    return authStore.user.groups || [];
  }
  return [];
});

watch(() => authStore.user?.user_type, (newType) => {
  if (newType === 'google') {
    blockId.value = authStore.user?.id || '';
  }
  if (newType === 'email') {
    blockId.value = authStore.user?.id || '';
  }
  if (newType === 'microsoft') {
    if(authStore.user?.groups?.length){
      blockId.value = authStore.user.groups[0] || '';
    } else {
      blockId.value = authStore.user?.id
    }
  }
}, { immediate: true });

const selectTemplate = (template: any) => {
  if (!authStore.isAuthenticated) {
      router.push('/login?redirect=boards/templates')
  }
  if (authStore.user?.user_type == 'anonymous') {
      showGuestModal.value = true;
  } else {
    selectedTemplate.value = template;
    boardName.value = '';
    showDetails.value = true;
  }
};

const clickAI = () => {
  if (!authStore.isAuthenticated) {
      router.push('/login?redirect=boards/templates')
  }
  if (authStore.user?.user_type == 'anonymous') {
      showGuestModal.value = true;
  } else {
    showAiDialog.value = true
  }
}

const createBoard = async () => {
  if (!boardName.value) return;
  try {
    loading.value = true;
    const board = await boardStore.createBoard({
      name: boardName.value,
      description: selectedTemplate.value.description,
      block_id: blockId.value,
      columns: selectedTemplate.value.columns.map((column: any) => ({
        name: column.name,
        color: column.color,
        description: column.description,
        is_action_column: column.is_action_column
      }))
    });
    router.push(`/boards/${board.id}`);
  } catch (error) {
    toast.error('Failed to create board. Please try again.');
  } finally {
    loading.value = false;
    showDetails.value = false;
  }
};

const generateAiTemplate = async () => {
  if (!aiPrompt.value) return;
  try {
    generatingTemplate.value = true;
    startLoadingTips();
    const response = await aiApi.generateTemplate(aiPrompt.value);
    selectedTemplate.value = response.data;
    showAiDialog.value = false;
    showDetails.value = true;
    aiPrompt.value = '';
  } catch (error) {
    toast.error(aiErrorMessage(error));
  } finally {
    generatingTemplate.value = false;
    stopLoadingTips();
  }
};

onMounted(() => {
  if (route.query.showAI === 'true') {
    clickAI();
  }
});
</script>

<style scoped>
.templates-hero {
  position: relative;
  overflow: hidden;
  margin: 0 0 36px;
  padding: 48px 36px;
  border-radius: 24px;
  background:
    radial-gradient(900px 320px at 100% 0%, rgba(168, 85, 247, 0.22), transparent 60%),
    radial-gradient(700px 280px at 0% 100%, rgba(236, 72, 153, 0.18), transparent 60%),
    linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(79, 70, 229, 0.92) 50%, rgba(15, 23, 42, 0.95));
  color: #fff;
  box-shadow: 0 30px 60px -30px rgba(79, 70, 229, 0.55);
  isolation: isolate;
}
.templates-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.5), transparent 60%),
    radial-gradient(1.5px 1.5px at 75% 40%, rgba(255,255,255,0.35), transparent 60%),
    radial-gradient(2px 2px at 55% 80%, rgba(255,255,255,0.4), transparent 60%),
    radial-gradient(1.5px 1.5px at 35% 70%, rgba(255,255,255,0.3), transparent 60%);
  opacity: 0.6;
  pointer-events: none;
  z-index: 0;
}
.templates-hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 32px;
  align-items: center;
}
.templates-header-titles {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 620px;
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #f8fafc;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  padding: 6px 12px;
  border-radius: 999px;
  width: fit-content;
  backdrop-filter: blur(6px);
}
.hero-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.25);
}
.templates-hero h1 {
  font-size: 2.6rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}
.hero-accent {
  background: linear-gradient(90deg, #fbcfe8, #fde68a 60%, #a7f3d0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.templates-subtitle {
  color: rgba(241, 245, 249, 0.85);
  font-size: 1.05rem;
  line-height: 1.55;
  max-width: 560px;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.hero-browse {
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.hero-browse:hover {
  background: rgba(255, 255, 255, 0.12);
}
.hero-visual {
  position: relative;
  height: 220px;
  display: block;
}
.hero-card {
  position: absolute;
  width: 150px;
  height: 110px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.4);
}
.hero-card::after {
  content: '';
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.45);
  box-shadow:
    0 16px 0 rgba(255, 255, 255, 0.3),
    0 32px 0 rgba(255, 255, 255, 0.2);
}
.hero-card-1 {
  top: 10px;
  right: 160px;
  transform: rotate(-8deg);
  background: rgba(251, 207, 232, 0.22);
}
.hero-card-2 {
  top: 60px;
  right: 30px;
  transform: rotate(6deg);
  background: rgba(167, 243, 208, 0.22);
}
.hero-card-3 {
  bottom: 0;
  right: 100px;
  transform: rotate(-2deg);
  background: rgba(253, 230, 138, 0.22);
}
@media (max-width: 900px) {
  .templates-hero {
    padding: 36px 24px;
  }
  .templates-hero-inner {
    grid-template-columns: 1fr;
  }
  .templates-hero h1 {
    font-size: 2.1rem;
  }
  .hero-visual {
    display: none;
  }
}
.ai-btn-icon {
  font-size: 1.2em;
}
.templates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
@media (max-width: 1100px) {
  .templates-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 700px) {
  .templates-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .template-card-modern {
    width: 100%;
    padding: 22px 18px;
    min-height: 0;
  }
}
.template-card-modern {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  padding: 28px 20px 22px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 220px;
  position: relative;
  cursor: pointer;
  border-top-width: 5px;
  border-top-style: solid;
  transition: box-shadow 0.18s, transform 0.18s;
}
.template-card-modern:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 6px 24px 0 rgba(37,99,235,0.10);
}
.template-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 18px;
  margin-top: -18px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
}
.template-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.template-card-title {
  font-size: 1.18rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 6px;
}
.template-card-desc {
  color: #444;
  font-size: 1.02rem;
  margin-bottom: 0;
}
.template-card-actions {
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}
.template-learn-link {
  font-size: 0.88rem;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
}
.template-learn-link:hover { color: #a855f7; }
.modal-desc {
  color: #444;
  font-size: 1.05rem;
  margin-bottom: 18px;
  margin-top: 2px;
}
.modal-columns-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}
.modal-column-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.modal-column-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  border: 2px solid;
  margin-top: 2px;
  flex-shrink: 0;
}
.modal-column-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.modal-column-name {
  font-weight: 600;
  color: #222;
  font-size: 1.05em;
}
.modal-column-desc {
  color: #666;
  font-size: 0.98em;
  margin-bottom: 0;
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.modal-form input, .modal-form select {
  padding: 10px;
  border-radius: 8px;
  border: 1.5px solid #ddd;
  font-size: 1rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}
.modal-form input:focus, .modal-form select:focus {
  border: 1.5px solid #2563eb;
}
.ai-modal-subtitle {
  color: #444;
  font-size: 1.05rem;
  margin-bottom: 16px;
}
.ai-modal-textarea {
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  outline: none;
  margin-bottom: 18px;
  resize: vertical;
  min-height: 80px;
  transition: border 0.2s;
  background: #fafbfc;
}
.ai-modal-textarea:focus {
  border: 1.5px solid #6366f1;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
}
.ai-prompt-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: -6px 0 18px;
}
.ai-prompt-chip {
  background: rgba(99, 102, 241, 0.08);
  color: #4f46e5;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}
.ai-prompt-chip:hover {
  background: rgba(99, 102, 241, 0.16);
  transform: translateY(-1px);
}
.ai-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 22px 6px 8px;
  gap: 14px;
}
.ai-loading-orb {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), transparent 55%),
    linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16px 40px -10px rgba(99, 102, 241, 0.55);
  animation: ai-orb-pulse 2.2s ease-in-out infinite;
}
.ai-loading-orb::before,
.ai-loading-orb::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 1.5px solid rgba(99, 102, 241, 0.35);
  animation: ai-orb-ring 2.4s ease-out infinite;
}
.ai-loading-orb::after {
  inset: -16px;
  border-color: rgba(168, 85, 247, 0.25);
  animation-delay: 0.8s;
}
.ai-loading-orb-spark {
  color: #fff;
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.2));
  animation: ai-spark-spin 3s linear infinite;
}
@keyframes ai-orb-pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.04); }
}
@keyframes ai-orb-ring {
  0%   { opacity: 0.7; transform: scale(0.9); }
  100% { opacity: 0;   transform: scale(1.5); }
}
@keyframes ai-spark-spin {
  to { transform: rotate(360deg); }
}
.ai-loading-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 6px;
}
.ai-loading-tip {
  color: #475569;
  font-size: 0.95rem;
  min-height: 1.4em;
  animation: ai-tip-fade 0.4s ease-out;
}
@keyframes ai-tip-fade {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ai-loading-bar {
  width: 100%;
  max-width: 260px;
  height: 4px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.12);
  overflow: hidden;
  position: relative;
}
.ai-loading-bar span {
  position: absolute;
  inset: 0;
  width: 40%;
  border-radius: 999px;
  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
  animation: ai-bar-slide 1.4s ease-in-out infinite;
}
@keyframes ai-bar-slide {
  0%   { left: -40%; }
  100% { left: 100%; }
}
.ai-loading-hint {
  color: #94a3b8;
  font-size: 0.82rem;
}
.guest-text {
  color: #444;
  margin: 0;
}
</style>