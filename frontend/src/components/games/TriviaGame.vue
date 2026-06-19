<template>
  <div class="trivia-root">
    <div class="status">
      <span class="badge" :class="`badge-${phase}`">{{ phaseLabel }}</span>
      <span v-if="round > 0" class="meta">Question {{ round }} / {{ totalRounds }}</span>
      <span v-if="phase === 'answering' && timer > 0" class="timer">⏰ {{ timer }}s</span>
      <span v-if="phase === 'answering' && playerCount > 0" class="meta answers-meta">
        {{ answersIn }} / {{ playerCount }} answered
      </span>
    </div>

    <div v-if="phase === 'idle'" class="card">
      <template v-if="isFacilitator">
        <div class="config">
          <label>
            Rounds:
            <input v-model.number="configRounds" type="number" min="1" max="10" class="num-input" />
          </label>
          <label>
            Category:
            <select v-model="configCategory" class="select-input">
              <option value="general">General Knowledge</option>
              <option value="technology">Technology</option>
              <option value="movies">Movies</option>
              <option value="science">Science</option>
              <option value="sports">Sports</option>
              <option value="agile/scrum">Agile / Scrum</option>
            </select>
          </label>
        </div>
        <button class="trivia-btn primary" :disabled="busy" @click="startGame">
          {{ busy ? 'Loading questions…' : '▶ Start Trivia Race' }}
        </button>
        <div v-if="aiError" class="ai-error">
          <span class="ai-error-text">⚠️ {{ aiError }}</span>
          <button class="trivia-btn outline small" :disabled="busy" @click="startGame">Try again</button>
        </div>
      </template>
      <p v-else class="muted">Waiting for the host to start the game…</p>
    </div>

    <div v-else-if="phase === 'answering' && question" class="card">
      <div class="question-text">{{ question.question }}</div>
      <div class="options">
        <button
          v-for="(opt, i) in question.options"
          :key="i"
          class="option-btn"
          :class="{
            selected: mySelection === i,
            correct: revealed && i === question.correct_index,
            wrong: revealed && mySelection === i && i !== question.correct_index,
          }"
          :disabled="mySelection !== null || revealed"
          @click="selectAnswer(i)"
        >
          <span class="option-letter">{{ ['A', 'B', 'C', 'D'][i] }}</span>
          <span>{{ opt }}</span>
        </button>
      </div>
      <div v-if="firstCorrect" class="first-correct">
        🎉 {{ firstCorrect }} buzzed in first!
      </div>
    </div>

    <div v-else-if="phase === 'reveal' && question" class="card">
      <div class="question-text">{{ question.question }}</div>
      <div class="answer-reveal">
        ✅ Correct answer: <strong>{{ ['A', 'B', 'C', 'D'][question.correct_index] }}.
        {{ question.options[question.correct_index] }}</strong>
      </div>
      <div class="explanation">💡 {{ question.explanation }}</div>
      <button v-if="round < totalRounds && isFacilitator" class="trivia-btn outline small" :disabled="busy" @click="nextRound">
        Skip wait →
      </button>
      <p v-if="round < totalRounds" class="host-wait muted">Next question in a moment…</p>
      <p v-else class="host-wait muted">Final scores in a moment…</p>
      <div v-if="aiError" class="ai-error">
        <span class="ai-error-text">⚠️ {{ aiError }}</span>
        <button class="trivia-btn outline small" :disabled="busy" @click="nextRound">Try again</button>
      </div>
    </div>

    <div v-else-if="phase === 'finished'" class="card">
      <div class="finished-title">🎉 Game over!</div>
      <button class="trivia-btn outline" @click="resetGame">Play Again</button>
    </div>

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
import { gamesApi, type TriviaQuestion } from '@/services/api';
import { aiErrorMessage } from '@/utils/aiError';
import confetti from 'canvas-confetti';

const props = defineProps<{
  currentUserId: string;
  currentUserName: string;
  isFacilitator: boolean;
}>();

type Phase = 'idle' | 'answering' | 'reveal' | 'finished';

interface Player { id: string; name: string; score: number; }

const GAME = 'trivia';
const TURN_SECONDS = 20;

const phase = ref<Phase>('idle');
const round = ref(0);
const totalRounds = ref(5);
const configRounds = ref(5);
const configCategory = ref('general');
const question = ref<TriviaQuestion | null>(null);
const mySelection = ref<number | null>(null);
const revealed = ref(false);
const firstCorrect = ref('');
const timer = ref(0);
let timerHandle: number | null = null;
const players = ref<Record<string, Player>>({});
const roundAnswers = ref<Set<string>>(new Set());
const busy = ref(false);
const aiError = ref('');
// All questions for this game are fetched once up front (count = rounds).
const usedQuestions = ref<string[]>([]);
const questionQueue = ref<TriviaQuestion[]>([]);
const REVEAL_PAUSE_MS = 4000;
let autoNextTimer: number | null = null;

function clearAutoNext() {
  if (autoNextTimer !== null) {
    clearTimeout(autoNextTimer);
    autoNextTimer = null;
  }
}

function scheduleAutoNext() {
  clearAutoNext();
  if (!props.isFacilitator) return;
  autoNextTimer = window.setTimeout(() => {
    if (phase.value !== 'reveal') return;
    if (round.value < totalRounds.value) nextRound();
    else finishGame();
  }, REVEAL_PAUSE_MS);
}

async function prefetchQuestions(count: number): Promise<void> {
  const res = await gamesApi.triviaBatch(configCategory.value, count, usedQuestions.value);
  const batch = (res.data.questions || []).filter(
    q => q?.question && !usedQuestions.value.includes(q.question),
  );
  if (!batch.length) {
    throw new Error('Could not load trivia questions. Try again.');
  }
  questionQueue.value = batch.slice(0, count);
}

function takeNextQuestion(): TriviaQuestion {
  const q = questionQueue.value.shift();
  if (!q?.question) throw new Error('No more questions in queue.');
  usedQuestions.value.push(q.question);
  return q;
}

const phaseLabel = computed(() => ({ idle: 'Ready', answering: 'Buzz in!', reveal: 'Reveal', finished: 'Game over' }[phase.value]));

const sortedScores = computed(() =>
  Object.values(players.value).slice().sort((a, b) => b.score - a.score),
);

const playerCount = computed(() => Object.keys(players.value).length);
const answersIn = computed(() => roundAnswers.value.size);

function resetRoundAnswers() {
  roundAnswers.value = new Set();
}

function announceSelf() {
  send({ action: 'announce', id: props.currentUserId, name: props.currentUserName });
}

function handleAnnounce(msg: any) {
  ensurePlayer(msg.id, msg.name);
}

function maybeRevealEarly() {
  if (phase.value !== 'answering' || revealed.value) return;
  const total = playerCount.value;
  if (total < 1 || roundAnswers.value.size < total) return;
  if (props.isFacilitator) send({ action: 'reveal' });
}

function send(payload: Record<string, any>) {
  websocketService.send({ type: 'game_event', game: GAME, ...payload });
}

function ensurePlayer(id?: string, name?: string) {
  if (!id) return;
  if (!players.value[id]) players.value[id] = { id, name: name || 'Player', score: 0 };
  else if (name) players.value[id].name = name;
}

function onGameEvent(msg: any) {
  if (!msg || msg.game !== GAME) return;
  switch (msg.action) {
    case 'announce':
      handleAnnounce(msg);
      break;
    case 'start':
    case 'next_round':
      question.value = msg.question;
      round.value = msg.round;
      totalRounds.value = msg.total_rounds || totalRounds.value;
      phase.value = 'answering';
      mySelection.value = null;
      revealed.value = false;
      firstCorrect.value = '';
      resetRoundAnswers();
      startTimer();
      break;
    case 'answer': {
      ensurePlayer(msg.id, msg.name);
      if (msg.id) roundAnswers.value = new Set(roundAnswers.value).add(msg.id);
      const isFirst = !firstCorrect.value && question.value && msg.index === question.value.correct_index;
      if (isFirst) {
        firstCorrect.value = msg.name;
        // First correct gets 100, anyone else who's correct gets 50, wrong gets 0.
        if (players.value[msg.id]) players.value[msg.id].score += 100;
      } else if (question.value && msg.index === question.value.correct_index) {
        if (players.value[msg.id]) players.value[msg.id].score += 50;
      }
      maybeRevealEarly();
      break;
    }
    case 'reveal':
      stopTimer();
      revealed.value = true;
      phase.value = 'reveal';
      scheduleAutoNext();
      break;
    case 'finish':
      handleFinish();
      break;
    case 'reset':
      handleReset();
      break;
  }
}

async function startGame() {
  if (busy.value || !props.isFacilitator) return;
  busy.value = true;
  aiError.value = '';
  questionQueue.value = [];
  try {
    const rounds = Math.max(1, Math.min(10, configRounds.value || 5));
    configRounds.value = rounds;
    await prefetchQuestions(rounds);
    const q = takeNextQuestion();
    send({
      action: 'start',
      question: q,
      round: 1,
      total_rounds: rounds,
    });
  } catch (e) {
    console.error('Failed to start trivia', e);
    aiError.value = aiErrorMessage(e);
  } finally {
    busy.value = false;
  }
}

function selectAnswer(idx: number) {
  if (mySelection.value !== null) return;
  mySelection.value = idx;
  send({ action: 'answer', index: idx, name: props.currentUserName, id: props.currentUserId });
  if (question.value && idx === question.value.correct_index && firstCorrect.value === props.currentUserName) {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 } });
  }
}

async function nextRound() {
  if (busy.value || !props.isFacilitator) return;
  clearAutoNext();
  busy.value = true;
  aiError.value = '';
  try {
    const q = takeNextQuestion();
    send({
      action: 'next_round',
      question: q,
      round: round.value + 1,
      total_rounds: totalRounds.value,
    });
  } catch (e) {
    console.error('Failed to advance trivia', e);
    aiError.value = aiErrorMessage(e);
  } finally {
    busy.value = false;
  }
}

function startTimer() {
  stopTimer();
  timer.value = TURN_SECONDS;
  timerHandle = window.setInterval(() => {
    timer.value -= 1;
    if (timer.value <= 0) {
      stopTimer();
      // Only one caller (anyone first-correct or facilitator) reveals to avoid duplicate events.
      if (props.isFacilitator) send({ action: 'reveal' });
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

function finishGame() {
  if (!props.isFacilitator) return;
  clearAutoNext();
  send({ action: 'finish' });
}

function handleFinish() {
  stopTimer();
  clearAutoNext();
  phase.value = 'finished';
  const winner = sortedScores.value[0];
  if (winner && winner.id === props.currentUserId) {
    confetti({ particleCount: 200, spread: 120, origin: { y: 0.3 } });
  }
}

function handleReset() {
  stopTimer();
  clearAutoNext();
  phase.value = 'idle';
  round.value = 0;
  question.value = null;
  mySelection.value = null;
  revealed.value = false;
  firstCorrect.value = '';
  players.value = {};
  questionQueue.value = [];
  resetRoundAnswers();
}

onMounted(() => {
  websocketService.on('game_event', onGameEvent);
  ensurePlayer(props.currentUserId, props.currentUserName);
  announceSelf();
});

onUnmounted(() => {
  websocketService.off('game_event', onGameEvent);
  stopTimer();
  clearAutoNext();
});
</script>

<style scoped>
.trivia-root { display: flex; flex-direction: column; gap: 14px; }

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
.badge-answering { background: #10b981; }
.badge-reveal { background: #f59e0b; }
.badge-finished { background: #6366f1; }

.meta { color: #475569; font-weight: 600; }
.answers-meta { font-size: 0.88rem; }
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

.question-text { font-size: 1.15rem; font-weight: 600; line-height: 1.45; }

.options { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; }

.option-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid #cbd5e1;
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.98rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.option-btn:hover:not(:disabled) { border-color: #6366f1; background: #eef2ff; }
.option-btn:disabled { cursor: default; opacity: 0.85; }
.option-btn.selected { border-color: #6366f1; background: #eef2ff; }
.option-btn.correct { border-color: #10b981; background: #d1fae5; }
.option-btn.wrong { border-color: #ef4444; background: #fee2e2; }

.option-letter {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.first-correct { color: #15803d; font-weight: 600; }

.answer-reveal { color: #0f172a; font-size: 1.05rem; }
.explanation { color: #475569; background: #f1f5f9; padding: 10px 12px; border-radius: 8px; }

.finished-title { font-size: 1.4rem; font-weight: 700; color: #6366f1; }

.config { display: flex; flex-wrap: wrap; gap: 14px; color: #334155; font-size: 0.92rem; }
.config label { display: flex; align-items: center; gap: 6px; }
.num-input, .select-input { border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px 8px; font-size: 0.92rem; }
.num-input { width: 60px; }

.trivia-btn {
  align-self: flex-start;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}
.trivia-btn.primary { background: linear-gradient(135deg, #6366f1, #ec4899); }
.trivia-btn.outline { background: #fff; color: #2563eb; border: 2px solid #2563eb; }
.trivia-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.scoreboard { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 14px; }
.side-title { font-weight: 700; margin-bottom: 8px; }
.score-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; border-bottom: 1px dashed #e2e8f0; }
.score-row:last-child { border-bottom: none; }
.score-rank { width: 32px; }
.score-name { flex: 1; }
.score-val { font-weight: 700; color: #2563eb; }

.host-wait { margin: 0; font-size: 0.92rem; }

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
.trivia-btn.small { padding: 6px 12px; font-size: 0.88rem; }

@media (max-width: 540px) {
  .card { padding: 14px; }
  .question-text { font-size: 1rem; }
  .options { grid-template-columns: 1fr; gap: 8px; }
  .option-btn { padding: 10px 12px; font-size: 0.92rem; }
  .option-letter { width: 24px; height: 24px; font-size: 0.85rem; }
  .config { gap: 10px; }
  .trivia-btn { padding: 9px 14px; font-size: 0.92rem; }
  .badge { font-size: 0.68rem; padding: 3px 8px; }
  .meta { font-size: 0.82rem; }
}
</style>
