<template>
  <div class="emoji-root">
    <div class="status">
      <span class="badge" :class="`badge-${phase}`">{{ phaseLabel }}</span>
      <span v-if="phase === 'writing' && timer > 0" class="timer">⏰ {{ timer }}s</span>
    </div>

    <div v-if="phase === 'idle'" class="card">
      <p class="hint">
        Players summarize a prompt using only emojis. The AI picks the most creative entry.
        Perfect for warming up offshore + onshore teams.
      </p>
      <label class="prompt-label">
        Prompt:
        <input v-model="customPrompt" class="text-input" :placeholder="defaultPrompt" />
      </label>
      <button class="emoji-btn primary" @click="startGame">▶ Start Emoji Tales</button>
    </div>

    <div v-else-if="phase === 'writing'" class="card">
      <div class="prompt-display">📜 <strong>{{ prompt }}</strong></div>
      <p class="hint">Tell the story using only emojis. You have one shot - no text, no spoilers.</p>
      <textarea
        v-model="myStory"
        class="story-input"
        :disabled="hasSubmitted"
        rows="2"
        placeholder="✏️ 🎉 🤔 ..."
      ></textarea>
      <div class="actions-row">
        <button class="emoji-btn primary" :disabled="!myStory.trim() || hasSubmitted" @click="submitStory">
          {{ hasSubmitted ? '✓ Submitted' : 'Submit' }}
        </button>
        <span class="muted">{{ entries.length }} submission{{ entries.length === 1 ? '' : 's' }}</span>
        <button
          v-if="isFacilitator && entries.length >= 1"
          class="emoji-btn outline"
          :disabled="judging"
          @click="judge"
        >
          {{ judging ? 'Judging…' : '🤖 Have AI Judge' }}
        </button>
      </div>
      <div v-if="aiError" class="ai-error">
        <span class="ai-error-text">⚠️ {{ aiError }}</span>
        <button class="emoji-btn outline small" :disabled="judging" @click="judge">Try again</button>
      </div>
      <div class="entries">
        <div v-for="(e, i) in entries" :key="i" class="entry-row">
          <span class="entry-author">{{ e.author }}:</span>
          <span class="entry-story">{{ e.story }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="phase === 'reveal'" class="card">
      <div class="winner-banner">
        🏆 <strong>{{ winner }}</strong> wins!
      </div>
      <div class="judge-reason">🤖 {{ reason }}</div>
      <div class="entries">
        <div
          v-for="(e, i) in entries"
          :key="i"
          class="entry-row"
          :class="{ winning: i === winnerIndex }"
        >
          <span class="entry-author">{{ e.author }}:</span>
          <span class="entry-story">{{ e.story }}</span>
        </div>
      </div>
      <button class="emoji-btn outline" @click="resetGame">Play Again</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import websocketService from '@/services/websocket';
import { gamesApi } from '@/services/api';
import { aiErrorMessage } from '@/utils/aiError';
import confetti from 'canvas-confetti';

const props = defineProps<{
  currentUserId: string;
  currentUserName: string;
  isFacilitator: boolean;
}>();

type Phase = 'idle' | 'writing' | 'reveal';

const GAME = 'emoji';
const TURN_SECONDS = 60;
const defaultPrompt = 'Sum up this sprint in emojis';

const phase = ref<Phase>('idle');
const prompt = ref('');
const customPrompt = ref('');
const myStory = ref('');
const hasSubmitted = ref(false);
const entries = ref<{ author: string; story: string }[]>([]);
const winner = ref('');
const reason = ref('');
const winnerIndex = ref(-1);
const timer = ref(0);
let timerHandle: number | null = null;
const judging = ref(false);
const aiError = ref('');

const phaseLabel = computed(() => ({ idle: 'Lobby', writing: 'Writing', reveal: 'Winner' }[phase.value]));

function send(payload: Record<string, any>) {
  websocketService.send({ type: 'game_event', game: GAME, ...payload });
}

function onGameEvent(msg: any) {
  if (!msg || msg.game !== GAME) return;
  switch (msg.action) {
    case 'start':
      prompt.value = msg.prompt;
      entries.value = [];
      myStory.value = '';
      hasSubmitted.value = false;
      winner.value = '';
      reason.value = '';
      winnerIndex.value = -1;
      phase.value = 'writing';
      startTimer();
      break;
    case 'submit':
      if (!entries.value.some(e => e.author === msg.author)) {
        entries.value.push({ author: msg.author, story: msg.story });
      }
      break;
    case 'reveal':
      stopTimer();
      winner.value = msg.winner;
      reason.value = msg.reason;
      winnerIndex.value = msg.winner_index;
      phase.value = 'reveal';
      if (msg.winner === props.currentUserName) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.3 } });
      }
      break;
    case 'reset':
      handleReset();
      break;
  }
}

function startGame() {
  const p = customPrompt.value.trim() || defaultPrompt;
  send({ action: 'start', prompt: p });
}

function submitStory() {
  if (!myStory.value.trim() || hasSubmitted.value) return;
  hasSubmitted.value = true;
  send({ action: 'submit', author: props.currentUserName, story: myStory.value.trim() });
}

async function judge() {
  if (!entries.value.length || judging.value) return;
  judging.value = true;
  aiError.value = '';
  try {
    const res = await gamesApi.judgeEmoji(prompt.value, entries.value);
    send({
      action: 'reveal',
      winner: res.data.winner,
      winner_index: res.data.winner_index,
      reason: res.data.reason,
    });
  } catch (e) {
    console.error('Judging failed', e);
    aiError.value = aiErrorMessage(e);
  } finally {
    judging.value = false;
  }
}

function startTimer() {
  stopTimer();
  timer.value = TURN_SECONDS;
  timerHandle = window.setInterval(() => {
    timer.value -= 1;
    if (timer.value <= 0) {
      stopTimer();
      if (props.isFacilitator && entries.value.length) judge();
    }
  }, 1000);
}

function stopTimer() {
  if (timerHandle !== null) {
    clearInterval(timerHandle);
    timerHandle = null;
  }
}

function resetGame() {
  send({ action: 'reset' });
}

function handleReset() {
  stopTimer();
  phase.value = 'idle';
  prompt.value = '';
  entries.value = [];
  myStory.value = '';
  hasSubmitted.value = false;
  winner.value = '';
  reason.value = '';
  winnerIndex.value = -1;
}

onMounted(() => {
  websocketService.on('game_event', onGameEvent);
});

onUnmounted(() => {
  websocketService.off('game_event', onGameEvent);
  stopTimer();
});
</script>

<style scoped>
.emoji-root { display: flex; flex-direction: column; gap: 14px; }

.status {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
}
.badge-idle { background: #64748b; }
.badge-writing { background: #10b981; }
.badge-reveal { background: #f59e0b; }
.timer { margin-left: auto; font-weight: 700; color: #ef4444; }

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hint { color: #475569; }

.prompt-label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: #334155; }
.text-input, .story-input {
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1rem;
  width: 100%;
  font-family: inherit;
}

.story-input { resize: vertical; min-height: 60px; font-size: 1.4rem; }

.prompt-display { font-size: 1.15rem; padding: 10px 14px; background: #fef3c7; border-radius: 8px; }

.actions-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

.entries { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
.entry-row { background: #f8fafc; padding: 8px 12px; border-radius: 8px; display: flex; gap: 8px; }
.entry-row.winning { background: #d1fae5; border: 1px solid #10b981; }
.entry-author { font-weight: 700; color: #334155; }
.entry-story { font-size: 1.2rem; }

.winner-banner { font-size: 1.3rem; color: #15803d; }
.judge-reason { background: #ede9fe; color: #5b21b6; padding: 10px 14px; border-radius: 8px; }

.emoji-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}
.emoji-btn.primary { background: linear-gradient(135deg, #6366f1, #ec4899); }
.emoji-btn.outline { background: #fff; color: #2563eb; border: 2px solid #2563eb; }
.emoji-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.muted { color: #64748b; }

.ai-error {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.92rem;
}
.ai-error-text { flex: 1; min-width: 180px; }
.emoji-btn.small { padding: 6px 12px; font-size: 0.88rem; }

@media (max-width: 540px) {
  .card { padding: 14px; }
  .prompt-display { font-size: 1rem; padding: 8px 10px; }
  .story-input { font-size: 1.2rem; min-height: 56px; }
  .entry-story { font-size: 1.05rem; }
  .emoji-btn { padding: 9px 14px; font-size: 0.92rem; }
  .winner-banner { font-size: 1.1rem; }
  .actions-row { gap: 8px; }
}
</style>
