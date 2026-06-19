<template>
  <div class="mr-root">
    <div class="status">
      <span class="badge" :class="`badge-${phase}`">{{ phaseLabel }}</span>
      <span v-if="round > 0" class="meta">Round {{ round }} / {{ totalRounds }}</span>
      <span v-if="phase === 'mingling' && timer > 0" class="timer">⏰ {{ formattedTime }}</span>
    </div>

    <!-- Lobby -->
    <div v-if="phase === 'idle'" class="card">
      <p class="hint">
        Meeting Roulette randomly pairs everyone in the room for short 1:1 chats.
        Perfect for welcoming new teammates or warming up a hybrid team - each pair gets
        an AI-generated icebreaker to break the silence.
      </p>
      <div class="config">
        <label>
          Rounds:
          <input v-model.number="configRounds" type="number" min="1" max="6" class="num-input" />
        </label>
        <label>
          Minutes per round:
          <input v-model.number="configMinutes" type="number" min="1" max="15" class="num-input" />
        </label>
        <label>
          Group size:
          <select v-model.number="configGroupSize" class="select-input">
            <option :value="2">Pairs (2)</option>
            <option :value="3">Trios (3)</option>
          </select>
        </label>
        <label class="full-width">
          Context for AI (optional - helps tailor icebreakers):
          <input
            v-model="configContext"
            class="text-input"
            placeholder="e.g. welcoming Maya from the new design team"
          />
        </label>
      </div>
      <button class="mr-btn primary" :disabled="busy || playerCount < 2" @click="startGame">
        {{ busy ? 'Setting up…' : `▶ Start Meeting Roulette (${playerCount} player${playerCount === 1 ? '' : 's'})` }}
      </button>
      <p v-if="playerCount < 2" class="muted small">Waiting for at least one more player to join the room…</p>
      <div v-if="aiError" class="ai-error">
        <span class="ai-error-text">⚠️ {{ aiError }}</span>
        <button class="mr-btn outline small" :disabled="busy" @click="startGame">Try again</button>
      </div>
    </div>

    <!-- Mingling -->
    <div v-else-if="phase === 'mingling'" class="card">
      <h3 class="card-title">Round {{ round }} matchups</h3>
      <p class="hint">Find your pair, hop on a video call (or huddle up), and chat for {{ configMinutes }} minute{{ configMinutes === 1 ? '' : 's' }}.</p>

      <div class="groups">
        <div
          v-for="(group, idx) in currentGroups"
          :key="idx"
          class="group-card"
          :class="{ mine: groupContainsMe(group) }"
        >
          <div class="group-header">
            <span class="group-tag">Group {{ idx + 1 }}</span>
            <span v-if="groupContainsMe(group)" class="group-yours">👋 You're in this one</span>
          </div>
          <div class="group-members">
            <span
              v-for="m in group"
              :key="m.id"
              class="member-pill"
              :class="{ self: m.id === currentUserId }"
            >
              {{ m.name }}
            </span>
          </div>
          <div class="group-question">
            💬 <strong>{{ currentQuestions[idx] || 'Take a moment to introduce yourselves.' }}</strong>
          </div>
        </div>
      </div>

      <div class="actions-row">
        <button
          v-if="isFacilitator || isHost"
          class="mr-btn outline"
          :disabled="busy"
          @click="advanceRound"
        >
          {{ round < totalRounds ? `Skip to Round ${round + 1} →` : 'End early →' }}
        </button>
      </div>
      <div v-if="aiError" class="ai-error">
        <span class="ai-error-text">⚠️ {{ aiError }}</span>
        <button class="mr-btn outline small" :disabled="busy" @click="advanceRound">Try again</button>
      </div>
    </div>

    <!-- Finished -->
    <div v-else-if="phase === 'finished'" class="card">
      <div class="finished-title">🎉 That's a wrap!</div>
      <p class="hint">Everyone has met {{ uniqueMetCount }} new {{ uniqueMetCount === 1 ? 'person' : 'people' }} this session.</p>
      <button v-if="isFacilitator || isHost" class="mr-btn outline" @click="resetGame">Play Again</button>
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

type Phase = 'idle' | 'mingling' | 'finished';

interface Player { id: string; name: string; }
interface Group { id: string; members: Player[]; }

const GAME = 'meeting_roulette';

const phase = ref<Phase>('idle');
const round = ref(0);
const totalRounds = ref(3);
const configRounds = ref(3);
const configMinutes = ref(5);
const configGroupSize = ref(2);
const configContext = ref('');
const busy = ref(false);
const aiError = ref('');

const players = ref<Record<string, Player>>({});
const currentGroups = ref<Player[][]>([]);
const currentQuestions = ref<string[]>([]);
const pairingHistory = ref<Set<string>>(new Set());
// Questions already used across rounds this session, so later rounds don't repeat.
const usedQuestions = ref<string[]>([]);
const timer = ref(0);
let timerHandle: number | null = null;
const hostId = ref('');

const playerList = computed(() => Object.values(players.value));
const playerCount = computed(() => playerList.value.length);
const isHost = computed(() => hostId.value === props.currentUserId);

const phaseLabel = computed(() => ({
  idle: 'Lobby',
  mingling: 'Mingling',
  finished: 'Done',
}[phase.value]));

const formattedTime = computed(() => {
  const m = Math.floor(timer.value / 60).toString().padStart(2, '0');
  const s = (timer.value % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});

const uniqueMetCount = computed(() => {
  // Rough count of unique others I've been grouped with across the session.
  let count = 0;
  for (const key of pairingHistory.value) {
    if (key.includes(`|${props.currentUserId}|`)) count += 1;
  }
  return count;
});

// ---- WebSocket ------------------------------------------------------------

function send(payload: Record<string, any>) {
  websocketService.send({ type: 'game_event', game: GAME, ...payload });
}

function ensurePlayer(id?: string, name?: string) {
  if (!id) return;
  if (!players.value[id]) players.value[id] = { id, name: name || 'Player' };
  else if (name) players.value[id].name = name;
}

function onGameEvent(msg: any) {
  if (!msg || msg.game !== GAME) return;
  switch (msg.action) {
    case 'announce': handleAnnounce(msg); break;
    case 'start': handleStart(msg); break;
    case 'round': handleRound(msg); break;
    case 'finish': handleFinish(); break;
    case 'reset': handleReset(); break;
  }
}

// Every player announces themselves on mount so the lobby roster builds up
// even if the user joined the WebSocket room before opening the game.
function announceSelf() {
  send({ action: 'announce', id: props.currentUserId, name: props.currentUserName });
}

function handleAnnounce(msg: any) {
  ensurePlayer(msg.id, msg.name);
}

function groupContainsMe(group: Player[]): boolean {
  return group.some(p => p.id === props.currentUserId);
}

// ---- Pairing logic --------------------------------------------------------

function pairKey(group: Player[]): string {
  return '|' + group.map(p => p.id).sort().join('|') + '|';
}

function buildGroups(): Player[][] {
  const pool = Object.values(players.value);
  if (pool.length < 2) return [];
  // Shuffle (Fisher-Yates), then try a couple of attempts to avoid repeats.
  const size = configGroupSize.value;
  let best: Player[][] = [];
  let bestRepeats = Infinity;
  for (let attempt = 0; attempt < 15; attempt++) {
    const shuffled = pool.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const groups: Player[][] = [];
    for (let i = 0; i < shuffled.length; i += size) {
      groups.push(shuffled.slice(i, i + size));
    }
    // If the final group is a singleton, fold the lone player into the previous group.
    if (groups.length >= 2 && groups[groups.length - 1].length === 1) {
      const lone = groups.pop()!;
      groups[groups.length - 1].push(...lone);
    }
    const repeats = groups.reduce(
      (sum, g) => sum + (g.length >= 2 && pairingHistory.value.has(pairKey(g)) ? 1 : 0),
      0,
    );
    if (repeats < bestRepeats) {
      best = groups;
      bestRepeats = repeats;
      if (bestRepeats === 0) break;
    }
  }
  return best;
}

// ---- Phase transitions ----------------------------------------------------

async function startGame() {
  if (busy.value) return;
  if (playerCount.value < 2) return;
  busy.value = true;
  aiError.value = '';
  try {
    const groups = buildGroups();
    if (!groups.length) {
      busy.value = false;
      return;
    }
    const questions = await fetchQuestionsFor(groups.length, 'Round 1');
    send({
      action: 'start',
      host: props.currentUserId,
      round: 1,
      total_rounds: configRounds.value,
      minutes_per_round: configMinutes.value,
      groups,
      questions,
    });
  } catch (e) {
    console.error('Failed to start Meeting Roulette', e);
    aiError.value = aiErrorMessage(e);
  } finally {
    busy.value = false;
  }
}

async function fetchQuestionsFor(numGroups: number, roundLabel: string): Promise<string[]> {
  const res = await gamesApi.rouletteQuestions(
    numGroups, configContext.value.trim() || 'general', roundLabel, usedQuestions.value
  );
  const questions = res.data.questions || [];
  usedQuestions.value.push(...questions);
  return questions;
}

function handleStart(msg: any) {
  hostId.value = msg.host || '';
  totalRounds.value = msg.total_rounds || configRounds.value;
  configMinutes.value = msg.minutes_per_round || configMinutes.value;
  round.value = msg.round || 1;
  currentGroups.value = msg.groups || [];
  currentQuestions.value = msg.questions || [];
  pairingHistory.value = new Set(currentGroups.value.map(pairKey));
  aiError.value = '';
  phase.value = 'mingling';
  startTimer();
  // Celebration if my group includes the host (they're often the new joiner / facilitator).
  if (currentGroups.value.some(g => groupContainsMe(g))) {
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.4 } });
  }
}

async function advanceRound() {
  if (busy.value) return;
  busy.value = true;
  aiError.value = '';
  try {
    if (round.value >= totalRounds.value) {
      send({ action: 'finish' });
      return;
    }
    const groups = buildGroups();
    const nextRound = round.value + 1;
    const questions = await fetchQuestionsFor(groups.length, `Round ${nextRound}`);
    send({
      action: 'round',
      round: nextRound,
      groups,
      questions,
    });
  } catch (e) {
    console.error('Failed to advance Meeting Roulette round', e);
    aiError.value = aiErrorMessage(e);
  } finally {
    busy.value = false;
  }
}

function handleRound(msg: any) {
  round.value = msg.round || round.value + 1;
  currentGroups.value = msg.groups || [];
  currentQuestions.value = msg.questions || [];
  for (const g of currentGroups.value) pairingHistory.value.add(pairKey(g));
  aiError.value = '';
  startTimer();
}

function startTimer() {
  stopTimer();
  timer.value = Math.max(1, configMinutes.value) * 60;
  timerHandle = window.setInterval(() => {
    timer.value -= 1;
    if (timer.value <= 0) {
      stopTimer();
      // Only the host advances automatically to avoid duplicate events.
      if (isHost.value) {
        advanceRound();
      }
    }
  }, 1000);
}

function stopTimer() {
  if (timerHandle !== null) {
    clearInterval(timerHandle);
    timerHandle = null;
  }
}

function handleFinish() {
  stopTimer();
  phase.value = 'finished';
}

function resetGame() {
  send({ action: 'reset' });
}

function handleReset() {
  stopTimer();
  phase.value = 'idle';
  round.value = 0;
  currentGroups.value = [];
  currentQuestions.value = [];
  pairingHistory.value = new Set();
  hostId.value = '';
  aiError.value = '';
}

onMounted(() => {
  websocketService.on('game_event', onGameEvent);
  ensurePlayer(props.currentUserId, props.currentUserName);
  announceSelf();
});

onUnmounted(() => {
  websocketService.off('game_event', onGameEvent);
  stopTimer();
});
</script>

<style scoped>
.mr-root { display: flex; flex-direction: column; gap: 14px; }

.status {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
  flex-wrap: wrap;
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
.badge-mingling { background: #10b981; }
.badge-finished { background: #6366f1; }

.meta { color: #475569; font-weight: 600; font-size: 0.92rem; }
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

.card-title { font-size: 1.15rem; font-weight: 700; color: #0f172a; }
.hint { color: #475569; line-height: 1.45; }

.config {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.config label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
  color: #334155;
  font-size: 0.92rem;
}

.config label.full-width { grid-column: 1 / -1; }

.num-input, .select-input, .text-input {
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.95rem;
}

.num-input { width: 70px; }

.groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.group-card {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-card.mine {
  background: #fef3c7;
  border-color: #f59e0b;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.18);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-tag {
  background: #0f172a;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  letter-spacing: 0.5px;
}

.group-yours { color: #92400e; font-weight: 700; font-size: 0.88rem; }

.group-members {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.member-pill {
  background: #fff;
  border: 1.5px solid #cbd5e1;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
}

.member-pill.self {
  background: #6366f1;
  color: #fff;
  border-color: #6366f1;
}

.group-question {
  background: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px dashed #cbd5e1;
  color: #1f2937;
}

.actions-row { display: flex; gap: 10px; flex-wrap: wrap; }

.finished-title { font-size: 1.4rem; font-weight: 700; color: #6366f1; }

.mr-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}
.mr-btn.primary { background: linear-gradient(135deg, #6366f1, #ec4899); }
.mr-btn.outline { background: #fff; color: #2563eb; border: 2px solid #2563eb; }
.mr-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.players-panel {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
}
.side-title { font-weight: 700; margin-bottom: 8px; }
.player-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed #e2e8f0; }
.player-row:last-child { border-bottom: none; }
.player-tag { color: #6366f1; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; }

.muted { color: #64748b; }
.small { font-size: 0.88rem; }

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
.mr-btn.small { padding: 6px 12px; font-size: 0.88rem; }

@media (max-width: 540px) {
  .card { padding: 14px; }
  .card-title { font-size: 1rem; }
  .config { grid-template-columns: 1fr; gap: 10px; }
  .groups { grid-template-columns: 1fr; gap: 10px; }
  .group-card { padding: 12px; }
  .group-question { font-size: 0.92rem; padding: 8px 10px; }
  .member-pill { padding: 5px 10px; font-size: 0.88rem; }
  .mr-btn { padding: 9px 14px; font-size: 0.92rem; }
  .timer { font-size: 0.95rem; }
}
</style>
