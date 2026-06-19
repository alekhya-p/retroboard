<template>
  <div class="ttl-root">
    <div class="status">
      <span class="badge" :class="`badge-${phase}`">{{ phaseLabel }}</span>
      <span v-if="phase === 'voting' && currentTarget" class="meta">
        Voting on <strong>{{ currentTarget.name }}</strong>
        ({{ targetIndex + 1 }} / {{ voteQueue.length }})
      </span>
      <span v-if="phase === 'submitting'" class="meta">
        {{ submittedCount }} of {{ playerCount }} players ready
      </span>
    </div>

    <!-- Lobby -->
    <div v-if="phase === 'idle'" class="card">
      <p class="hint">
        Everyone submits two true statements and one lie about themselves. The team votes
        on which one is the lie. Voters who guess correctly score points; players whose
        lie fools the room also score.
      </p>
      <div class="config">
        <label>
          Topic hint for the AI (optional):
          <input v-model="topic" class="text-input" placeholder="e.g. travel, food, work, hobbies" />
        </label>
      </div>
      <button class="ttl-btn primary" @click="startGame">▶ Start Two Truths &amp; a Lie</button>
    </div>

    <!-- Submission phase -->
    <div v-else-if="phase === 'submitting'" class="card">
      <h3 class="card-title">Your three statements</h3>
      <p class="hint">Two truths, one lie. Mark which one is the lie.</p>

      <div v-for="i in 3" :key="i" class="stmt-row">
        <label :class="['lie-toggle', { active: lieIndex === i - 1 }]">
          <input type="radio" :value="i - 1" v-model="lieIndex" :disabled="hasSubmitted" />
          <span>Lie</span>
        </label>
        <input
          v-model="myStatements[i - 1]"
          class="stmt-input"
          :placeholder="placeholders[i - 1]"
          :disabled="hasSubmitted"
          maxlength="140"
        />
      </div>

      <div class="actions-row">
        <button class="ttl-btn outline" :disabled="aiLoading || hasSubmitted" @click="getAiInspiration">
          {{ aiLoading ? '...' : '🤖 AI: suggest a lie' }}
        </button>
        <button
          class="ttl-btn primary"
          :disabled="!canSubmit || hasSubmitted"
          @click="submitStatements"
        >
          {{ hasSubmitted ? '✓ Submitted - waiting for others' : 'Submit' }}
        </button>
        <button
          v-if="isFacilitator && submittedCount >= 2 && !votingStarted"
          class="ttl-btn outline"
          @click="beginVoting"
        >
          Start Voting ({{ submittedCount }} ready)
        </button>
      </div>

      <div v-if="aiError" class="ai-error">
        <span class="ai-error-text">⚠️ {{ aiError }}</span>
        <button class="ttl-btn outline small" :disabled="aiLoading || hasSubmitted" @click="getAiInspiration">Try again</button>
      </div>

      <div v-if="aiSuggestions.length" class="ai-suggestions">
        <div class="muted small">Tap one to drop it into the highlighted lie slot:</div>
        <button
          v-for="(s, i) in aiSuggestions"
          :key="i"
          class="suggestion-pill"
          @click="useAiSuggestion(s)"
        >
          {{ s }}
        </button>
      </div>
    </div>

    <!-- Voting phase -->
    <div v-else-if="phase === 'voting' && currentTarget" class="card">
      <h3 class="card-title">Spot the lie about {{ currentTarget.name }}</h3>
      <p v-if="isOwnTurn" class="hint muted">
        You can't vote on your own statements. Sit tight while the team decides.
      </p>
      <div class="stmt-options">
        <button
          v-for="(s, i) in currentTarget.statements"
          :key="i"
          class="vote-option"
          :class="{ selected: myVote === i, locked: hasVoted || isOwnTurn }"
          :disabled="hasVoted || isOwnTurn"
          @click="castVote(i)"
        >
          <span class="vote-letter">{{ ['A', 'B', 'C'][i] }}</span>
          <span>{{ s }}</span>
        </button>
      </div>
      <div class="vote-meta">
        <span>{{ votesIn }} / {{ eligibleVoterCount }} votes in</span>
        <button
          v-if="(isFacilitator || isOwnTurn) && votesIn >= 1"
          class="ttl-btn outline small"
          @click="revealLie"
        >
          Reveal Lie →
        </button>
      </div>
    </div>

    <!-- Reveal phase -->
    <div v-else-if="phase === 'reveal' && currentTarget" class="card">
      <h3 class="card-title">Reveal: {{ currentTarget.name }}</h3>
      <div v-for="(s, i) in currentTarget.statements" :key="i" class="reveal-row" :class="{
        lie: i === currentTarget.lieIndex,
        truth: i !== currentTarget.lieIndex
      }">
        <span class="reveal-tag">{{ i === currentTarget.lieIndex ? '🤥 LIE' : '✅ TRUTH' }}</span>
        <span class="reveal-text">{{ s }}</span>
      </div>
      <div class="reveal-summary">
        🎯 {{ correctVoters.length }} / {{ eligibleVoterCount }} caught the lie.
        <span v-if="fooled.length">
          <strong>{{ currentTarget.name }}</strong> fooled {{ fooled.join(', ') }}.
        </span>
      </div>
      <div class="actions-row">
        <button
          v-if="isFacilitator || isOwnTurn"
          class="ttl-btn primary"
          @click="nextOrFinish"
        >
          {{ targetIndex < voteQueue.length - 1 ? 'Next Player →' : 'See Final Scores' }}
        </button>
      </div>
    </div>

    <!-- Finished -->
    <div v-else-if="phase === 'finished'" class="card">
      <div class="finished-title">🎉 Game over!</div>
      <button v-if="isFacilitator" class="ttl-btn outline" @click="resetGame">Play Again</button>
    </div>

    <!-- Scoreboard -->
    <div class="scoreboard">
      <div class="side-title">Scoreboard</div>
      <div v-if="!sortedScores.length" class="muted small">No scores yet.</div>
      <div v-for="(p, i) in sortedScores" :key="p.id" class="score-row">
        <span class="score-rank">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}` }}</span>
        <span class="score-name">{{ p.name }}</span>
        <span class="score-val">{{ p.score }}</span>
      </div>
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

type Phase = 'idle' | 'submitting' | 'voting' | 'reveal' | 'finished';

interface Player { id: string; name: string; score: number; }
interface Submission { id: string; name: string; statements: string[]; lieIndex: number; }

const GAME = 'two_truths';

const phase = ref<Phase>('idle');
const topic = ref('');

// Per-player local state
const myStatements = ref<string[]>(['', '', '']);
const lieIndex = ref(0);
const hasSubmitted = ref(false);
const aiSuggestions = ref<string[]>([]);
const aiLoading = ref(false);
const aiError = ref('');
// Suggestions already shown this session, so "Try again" gives fresh ones.
const usedSuggestions = ref<string[]>([]);

// Shared state, kept in sync via WS
const players = ref<Record<string, Player>>({});
const submissions = ref<Record<string, Submission>>({});
const voteQueue = ref<string[]>([]);
const targetIndex = ref(0);
const votes = ref<Record<string, number>>({}); // voterId -> chosen index
const votingStarted = ref(false);
const myVote = ref<number | null>(null);

const placeholders = [
  'e.g. I once swam with dolphins in Hawaii',
  'e.g. My first job was at a movie theatre',
  'e.g. I can solve a Rubik\'s cube in under a minute',
];

const phaseLabel = computed(() => ({
  idle: 'Ready',
  submitting: 'Writing',
  voting: 'Vote',
  reveal: 'Reveal',
  finished: 'Game over',
}[phase.value]));

const playerList = computed(() => Object.values(players.value));
const playerCount = computed(() => playerList.value.length);
const submittedCount = computed(() => Object.keys(submissions.value).length);

const currentTarget = computed<Submission | null>(() => {
  const id = voteQueue.value[targetIndex.value];
  return id ? submissions.value[id] || null : null;
});

const isOwnTurn = computed(() => currentTarget.value?.id === props.currentUserId);
const hasVoted = computed(() => myVote.value !== null);

const eligibleVoterCount = computed(() => Math.max(0, playerCount.value - 1));
const votesIn = computed(() => Object.keys(votes.value).length);

const correctVoters = computed(() => {
  if (!currentTarget.value) return [] as string[];
  const lie = currentTarget.value.lieIndex;
  return Object.entries(votes.value)
    .filter(([, v]) => v === lie)
    .map(([id]) => players.value[id]?.name || 'Player');
});

const fooled = computed(() => {
  if (!currentTarget.value) return [] as string[];
  const lie = currentTarget.value.lieIndex;
  return Object.entries(votes.value)
    .filter(([id, v]) => v !== lie && id !== currentTarget.value!.id)
    .map(([id]) => players.value[id]?.name || 'Player');
});

const canSubmit = computed(() =>
  myStatements.value.every(s => s.trim().length > 0) && lieIndex.value >= 0,
);

const sortedScores = computed(() =>
  Object.values(players.value).slice().sort((a, b) => b.score - a.score),
);

// ---- WebSocket plumbing ----------------------------------------------------

function send(payload: Record<string, any>) {
  websocketService.send({ type: 'game_event', game: GAME, ...payload });
}

function ensurePlayer(id?: string, name?: string) {
  if (!id) return;
  if (!players.value[id]) players.value[id] = { id, name: name || 'Player', score: 0 };
  else if (name) players.value[id].name = name;
}

function announceSelf() {
  send({ action: 'announce', id: props.currentUserId, name: props.currentUserName });
}

function handleAnnounce(msg: any) {
  ensurePlayer(msg.id, msg.name);
}

function onGameEvent(msg: any) {
  if (!msg || msg.game !== GAME) return;
  const sender = msg.sender || {};
  switch (msg.action) {
    case 'announce': handleAnnounce(msg); break;
    case 'start': handleStart(msg); break;
    case 'submit': handleSubmit(msg, sender); break;
    case 'begin_voting': handleBeginVoting(msg); break;
    case 'vote': handleVote(msg, sender); break;
    case 'reveal': handleReveal(); break;
    case 'next': handleNext(msg); break;
    case 'finish': handleFinish(); break;
    case 'reset': handleReset(); break;
  }
}

// ---- Phase handlers --------------------------------------------------------

function startGame() {
  send({ action: 'start' });
}

function handleStart(_msg: any) {
  ensurePlayer(props.currentUserId, props.currentUserName);
  phase.value = 'submitting';
  hasSubmitted.value = false;
  myStatements.value = ['', '', ''];
  lieIndex.value = 0;
  aiSuggestions.value = [];
  aiError.value = '';
  submissions.value = {};
  voteQueue.value = [];
  targetIndex.value = 0;
  votes.value = {};
  votingStarted.value = false;
  myVote.value = null;
}

async function getAiInspiration() {
  if (aiLoading.value) return;
  aiLoading.value = true;
  aiError.value = '';
  try {
    const res = await gamesApi.lieInspiration(topic.value.trim() || 'general', usedSuggestions.value);
    aiSuggestions.value = res.data.lies || [];
    usedSuggestions.value.push(...aiSuggestions.value);
  } catch (e) {
    console.error('Failed to get lie inspiration', e);
    aiError.value = aiErrorMessage(e);
  } finally {
    aiLoading.value = false;
  }
}

function useAiSuggestion(s: string) {
  if (hasSubmitted.value) return;
  myStatements.value[lieIndex.value] = s;
}

function submitStatements() {
  if (!canSubmit.value || hasSubmitted.value) return;
  const payload = {
    action: 'submit',
    id: props.currentUserId,
    name: props.currentUserName,
    statements: myStatements.value.map(s => s.trim()),
    lieIndex: lieIndex.value,
  };
  if (!send(payload)) return;
  hasSubmitted.value = true;
  handleSubmit(payload, { id: props.currentUserId, display_name: props.currentUserName });
}

function handleSubmit(msg: any, sender: any) {
  const id = msg.id || sender.id;
  const name = msg.name || sender.display_name || 'Player';
  ensurePlayer(id, name);
  submissions.value[id] = {
    id,
    name,
    statements: msg.statements,
    lieIndex: msg.lieIndex,
  };
}

function beginVoting() {
  if (votingStarted.value) return;
  // Shuffle so the order isn't predictable.
  const order = Object.keys(submissions.value).slice();
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  send({ action: 'begin_voting', order });
}

function handleBeginVoting(msg: any) {
  voteQueue.value = msg.order || [];
  targetIndex.value = 0;
  votes.value = {};
  myVote.value = null;
  votingStarted.value = true;
  phase.value = 'voting';
}

function castVote(i: number) {
  if (hasVoted.value || isOwnTurn.value) return;
  myVote.value = i;
  send({ action: 'vote', id: props.currentUserId, name: props.currentUserName, index: i });
}

function handleVote(msg: any, sender: any) {
  const voterId = msg.id || sender.id;
  if (!voterId || voterId === currentTarget.value?.id) return;
  votes.value[voterId] = msg.index;
  // Auto-reveal once every eligible voter has weighed in.
  if (Object.keys(votes.value).length >= eligibleVoterCount.value) {
    // Anyone can trigger the auto-reveal, but to avoid double-sending we let
    // the player being voted on (the target) do it; if they're disconnected,
    // the facilitator falls back via the manual button.
    if (currentTarget.value?.id === props.currentUserId) {
      send({ action: 'reveal' });
    }
  }
}

function revealLie() {
  if (phase.value !== 'voting') return;
  send({ action: 'reveal' });
}

function handleReveal() {
  if (phase.value !== 'voting' || !currentTarget.value) return;
  const target = currentTarget.value;
  const lie = target.lieIndex;
  // Score: 50 to each correct voter, 25 bonus to target per fooled voter.
  for (const [voterId, choice] of Object.entries(votes.value)) {
    if (voterId === target.id) continue;
    if (choice === lie) {
      ensurePlayer(voterId, players.value[voterId]?.name);
      players.value[voterId].score += 50;
    } else {
      ensurePlayer(target.id, target.name);
      players.value[target.id].score += 25;
    }
  }
  phase.value = 'reveal';
  if (correctVoters.value.includes(props.currentUserName)) {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 } });
  }
}

function nextOrFinish() {
  if (targetIndex.value < voteQueue.value.length - 1) {
    send({ action: 'next', index: targetIndex.value + 1 });
  } else {
    send({ action: 'finish' });
  }
}

function handleNext(msg: any) {
  targetIndex.value = msg.index ?? targetIndex.value + 1;
  votes.value = {};
  myVote.value = null;
  phase.value = 'voting';
}

function handleFinish() {
  phase.value = 'finished';
  const winner = sortedScores.value[0];
  if (winner && winner.id === props.currentUserId) {
    confetti({ particleCount: 200, spread: 120, origin: { y: 0.3 } });
  }
}

function resetGame() {
  send({ action: 'reset' });
}

function handleReset() {
  phase.value = 'idle';
  myStatements.value = ['', '', ''];
  lieIndex.value = 0;
  hasSubmitted.value = false;
  aiSuggestions.value = [];
  aiError.value = '';
  players.value = {};
  submissions.value = {};
  voteQueue.value = [];
  targetIndex.value = 0;
  votes.value = {};
  votingStarted.value = false;
  myVote.value = null;
}

onMounted(() => {
  websocketService.on('game_event', onGameEvent);
  ensurePlayer(props.currentUserId, props.currentUserName);
  announceSelf();
});

onUnmounted(() => {
  websocketService.off('game_event', onGameEvent);
});
</script>

<style scoped>
.ttl-root { display: flex; flex-direction: column; gap: 14px; }

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
.badge-submitting { background: #10b981; }
.badge-voting { background: #6366f1; }
.badge-reveal { background: #f59e0b; }
.badge-finished { background: #ec4899; }

.meta { color: #475569; font-weight: 600; font-size: 0.92rem; }

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
.hint.muted { font-style: italic; }

.config { display: flex; flex-wrap: wrap; gap: 14px; color: #334155; font-size: 0.92rem; }
.config label { display: flex; flex-direction: column; gap: 6px; min-width: 280px; flex: 1; font-weight: 600; }

.text-input, .stmt-input {
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1rem;
  font-family: inherit;
  width: 100%;
}

.stmt-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.lie-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1.5px dashed #cbd5e1;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  user-select: none;
  min-width: 64px;
  justify-content: center;
}

.lie-toggle input { display: none; }
.lie-toggle.active {
  background: #fef3c7;
  border: 1.5px solid #f59e0b;
  color: #92400e;
}

.actions-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.ai-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.suggestion-pill {
  background: #ede9fe;
  color: #5b21b6;
  border: 1px solid #c4b5fd;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.88rem;
  cursor: pointer;
}

.suggestion-pill:hover { background: #ddd6fe; }

.players-status {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  margin-top: 6px;
}
.status-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 0.92rem;
}
.status-tag { color: #64748b; }
.status-tag.ready { color: #15803d; font-weight: 700; }
.status-name { font-weight: 600; }

.stmt-options { display: flex; flex-direction: column; gap: 10px; }

.vote-option {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  border: 1.5px solid #cbd5e1;
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.vote-option:hover:not(:disabled) { border-color: #6366f1; background: #eef2ff; }
.vote-option.selected { border-color: #6366f1; background: #eef2ff; }
.vote-option:disabled { cursor: not-allowed; opacity: 0.85; }
.vote-option.locked { opacity: 0.85; }

.vote-letter {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vote-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #475569;
  font-size: 0.92rem;
  flex-wrap: wrap;
  gap: 8px;
}

.reveal-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid transparent;
}
.reveal-row.lie { background: #fee2e2; border-color: #ef4444; }
.reveal-row.truth { background: #d1fae5; border-color: #10b981; }
.reveal-tag { font-weight: 700; min-width: 76px; }

.reveal-summary { background: #ede9fe; color: #5b21b6; padding: 10px 12px; border-radius: 8px; }

.finished-title { font-size: 1.4rem; font-weight: 700; color: #6366f1; }

.ttl-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}
.ttl-btn.primary { background: linear-gradient(135deg, #6366f1, #ec4899); }
.ttl-btn.outline { background: #fff; color: #2563eb; border: 2px solid #2563eb; }
.ttl-btn.small { padding: 6px 12px; font-size: 0.88rem; }
.ttl-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.scoreboard { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 14px; }
.side-title { font-weight: 700; margin-bottom: 8px; }
.score-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; border-bottom: 1px dashed #e2e8f0; }
.score-row:last-child { border-bottom: none; }
.score-rank { width: 32px; }
.score-name { flex: 1; }
.score-val { font-weight: 700; color: #2563eb; }

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

@media (max-width: 540px) {
  .card { padding: 14px; }
  .card-title { font-size: 1rem; }
  .stmt-row { flex-wrap: wrap; gap: 6px; }
  .lie-toggle { min-width: 56px; padding: 5px 8px; font-size: 0.78rem; }
  .stmt-input { font-size: 0.92rem; padding: 8px 10px; }
  .vote-option { padding: 10px 12px; font-size: 0.92rem; }
  .vote-letter { width: 24px; height: 24px; font-size: 0.85rem; }
  .reveal-tag { min-width: 64px; font-size: 0.8rem; }
  .reveal-text { font-size: 0.92rem; }
  .actions-row { gap: 8px; }
  .ttl-btn { padding: 9px 14px; font-size: 0.92rem; }
  .suggestion-pill { font-size: 0.82rem; padding: 5px 10px; }
}
</style>
