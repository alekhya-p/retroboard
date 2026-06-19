<template>
  <div class="doodle-root">
    <div class="doodle-status">
      <div class="status-line">
        <span class="status-badge" :class="`badge-${phase}`">{{ phaseLabel }}</span>
        <span v-if="round > 0" class="status-meta">Round {{ round }} / {{ totalRounds }}</span>
        <span v-if="phase === 'drawing' && drawerName" class="status-meta">
          ✏️ {{ drawerName }} is drawing
        </span>
        <span v-if="timer > 0 && phase === 'drawing'" class="status-timer">⏰ {{ timer }}s</span>
      </div>

      <div v-if="phase === 'idle'" class="prompt-line muted">
        <template v-if="isFacilitator">Configure rounds below, then start the game.</template>
        <template v-else>Waiting for the host to start Doodle Quest…</template>
      </div>
      <div v-else-if="phase === 'drawing' && isDrawer" class="prompt-line">
        Your word: <strong class="word-reveal">{{ word }}</strong>
      </div>
      <div v-else-if="phase === 'drawing'" class="prompt-line">
        Guess the drawing! Word has <strong>{{ word.length }}</strong> letters.
        <span v-if="latestHint" class="hint-pill">💡 {{ latestHint }}</span>
      </div>
      <div v-else-if="phase === 'reveal'" class="prompt-line">
        The word was <strong class="word-reveal">{{ word }}</strong>.
        <span v-if="winnerName"> 🏆 {{ winnerName }} guessed it!</span>
        <span v-else> Nobody got it this round.</span>
      </div>
      <div v-else-if="phase === 'finished'" class="prompt-line">
        🎉 Game over! Final scores below.
      </div>

      <div v-if="aiError" class="ai-error">
        <span class="ai-error-text">⚠️ {{ aiError }}</span>
        <button class="doodle-btn small" :disabled="busy || hintLoading" @click="retryAiAction">Try again</button>
      </div>
    </div>

    <div class="doodle-main">
      <div class="canvas-wrap">
        <canvas
          ref="canvasRef"
          class="doodle-canvas"
          :class="{ drawable: isDrawer && phase === 'drawing' }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @pointerleave="onPointerUp"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend.prevent="onTouchEnd"
          @touchcancel.prevent="onTouchEnd"
        ></canvas>
        <div v-if="phase === 'idle'" class="canvas-overlay">
          <template v-if="isFacilitator">
            <button class="doodle-btn primary" :disabled="busy" @click="startGame">
              {{ busy ? 'Loading words…' : '▶ Start Doodle Quest' }}
            </button>
            <div class="overlay-controls">
              <label>
                Rounds:
                <input v-model.number="configRounds" type="number" min="1" max="10" class="num-input" />
              </label>
              <label>
                Theme:
                <select v-model="configTheme" class="select-input">
                  <option value="general">General</option>
                  <option value="agile/tech">Agile &amp; Tech</option>
                  <option value="movies">Movies</option>
                  <option value="food">Food</option>
                  <option value="office life">Office Life</option>
                </select>
              </label>
              <label>
                Difficulty:
                <select v-model="configDifficulty" class="select-input">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
            </div>
          </template>
        </div>

        <div v-if="isDrawer && phase === 'drawing'" class="canvas-toolbar">
          <div class="palette">
            <button
              v-for="c in palette"
              :key="c"
              class="swatch"
              :class="{ active: color === c }"
              :style="{ background: c }"
              @click="color = c; eraser = false"
              aria-label="Pick color"
            ></button>
          </div>
          <div class="tool-group">
            <button
              v-for="s in sizes"
              :key="s"
              class="size-btn"
              :class="{ active: lineWidth === s && !eraser }"
              @click="lineWidth = s; eraser = false"
            >
              <span class="dot" :style="{ width: s + 4 + 'px', height: s + 4 + 'px' }"></span>
            </button>
            <button class="tool-btn" :class="{ active: eraser }" @click="eraser = !eraser">🧽</button>
            <button class="tool-btn" @click="clearCanvas">🗑️ Clear</button>
            <button class="tool-btn" :disabled="hintsUsed >= 3 || hintLoading" @click="requestHint">
              {{ hintLoading ? '...' : `💡 Hint (${3 - hintsUsed})` }}
            </button>
          </div>
        </div>
      </div>

      <div class="doodle-side">
        <div class="side-section">
          <div class="side-title">Scoreboard</div>
          <div v-if="!sortedScores.length" class="muted small">No scores yet.</div>
          <div v-for="(p, i) in sortedScores" :key="p.id" class="score-row">
            <span class="score-rank">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}` }}</span>
            <span class="score-name">{{ p.name }}</span>
            <span class="score-val">{{ p.score }}</span>
          </div>
        </div>

        <div class="side-section guesses">
          <div class="side-title">Guesses</div>
          <div ref="chatRef" class="chat-list">
            <div v-for="(g, i) in guesses" :key="i" class="chat-row" :class="{ correct: g.correct, system: g.system }">
              <span v-if="!g.system" class="chat-author">{{ g.name }}:</span>
              <span class="chat-text">{{ g.text }}</span>
            </div>
          </div>
          <div v-if="phase === 'drawing' && !isDrawer" class="chat-input-row">
            <input
              v-model="guessInput"
              class="chat-input"
              placeholder="Type your guess..."
              maxlength="60"
              @keyup.enter="submitGuess"
            />
            <button class="doodle-btn small" :disabled="!guessInput.trim()" @click="submitGuess">Send</button>
          </div>
          <div v-else-if="phase === 'drawing' && isDrawer" class="muted small">
            You're drawing - sit back and watch the guesses roll in.
          </div>
        </div>

        <div v-if="phase === 'reveal' || phase === 'finished'" class="side-section">
          <button v-if="phase === 'reveal' && round < totalRounds && isFacilitator" class="doodle-btn primary" :disabled="busy" @click="nextRound">
            Next Round →
          </button>
          <p v-else-if="phase === 'reveal' && round < totalRounds" class="muted small">Next round in a moment…</p>
          <button v-else-if="phase === 'reveal'" class="doodle-btn primary" :disabled="busy" @click="finishGame">
            See Final Scores
          </button>
          <button v-else class="doodle-btn outline" @click="resetGame">Play Again</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import websocketService from '@/services/websocket';
import { gamesApi } from '@/services/api';
import { aiErrorMessage } from '@/utils/aiError';
import confetti from 'canvas-confetti';

const props = defineProps<{
  currentUserId: string;
  currentUserName: string;
  isFacilitator: boolean;
}>();

type Phase = 'idle' | 'drawing' | 'reveal' | 'finished';

interface Player { id: string; name: string; score: number; }
interface Guess { name: string; text: string; correct?: boolean; system?: boolean; }

const GAME = 'doodle';
const CANVAS_W = 800;
const CANVAS_H = 500;

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chatRef = ref<HTMLDivElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;

const phase = ref<Phase>('idle');
const round = ref(0);
const totalRounds = ref(3);
const configRounds = ref(3);
const configTheme = ref('general');
const configDifficulty = ref('easy');

const word = ref('');
const drawerId = ref('');
const drawerName = ref('');
const winnerName = ref('');
const timer = ref(0);
let timerHandle: number | null = null;
const TURN_SECONDS = 60;

const players = ref<Record<string, Player>>({});
const guesses = ref<Guess[]>([]);
const guessInput = ref('');
const latestHint = ref('');
const hintsUsed = ref(0);
const hintLoading = ref(false);
const busy = ref(false);
// Words already used this session, plus a pre-fetched batch we serve one at a
// time, so the AI doesn't hand out the same prompt twice (and we hit the API once
// per ~10 rounds instead of every round).
const usedWords = ref<string[]>([]);
const wordQueue = ref<string[]>([]);
const rotationOrder = ref<string[]>([]);
const rotationIndex = ref(0);
let autoNextTimer: number | null = null;

async function prefetchWords(count: number): Promise<void> {
  const res = await gamesApi.drawingPrompts(
    configTheme.value,
    configDifficulty.value,
    count,
    usedWords.value,
  );
  const batch = (res.data.words || []).filter(w => w && !usedWords.value.includes(w));
  if (!batch.length) {
    throw new Error('Could not load drawing words. Try again.');
  }
  wordQueue.value = batch.slice(0, count);
}

function takeNextWord(): string {
  const w = wordQueue.value.shift();
  if (!w) throw new Error('No more words in queue.');
  usedWords.value.push(w);
  return w;
}
// Inline, friendly AI error state. `aiErrorAction` records which call failed so
// the Retry button can re-run exactly that request.
const aiError = ref('');
const aiErrorAction = ref<'start' | 'next' | 'hint' | null>(null);

const palette = ['#0f172a', '#ef4444', '#f97316', '#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
const sizes = [2, 4, 8, 14];
const color = ref(palette[0]);
const lineWidth = ref(4);
const eraser = ref(false);

const isDrawer = computed(() => drawerId.value === props.currentUserId);

const phaseLabel = computed(() => {
  switch (phase.value) {
    case 'idle': return 'Ready';
    case 'drawing': return 'Drawing';
    case 'reveal': return 'Round end';
    case 'finished': return 'Game over';
  }
});

const sortedScores = computed(() =>
  Object.values(players.value)
    .slice()
    .sort((a, b) => b.score - a.score),
);

// ---- WebSocket plumbing ----------------------------------------------------

function send(payload: Record<string, any>) {
  websocketService.send({ type: 'game_event', game: GAME, ...payload });
}

function announceSelf() {
  send({ action: 'announce', id: props.currentUserId, name: props.currentUserName });
}

function handleAnnounce(msg: any) {
  ensurePlayer(msg.id, msg.name);
}

function buildRotationOrder(): string[] {
  const ids = Object.keys(players.value);
  if (!ids.length) return [props.currentUserId];
  const start = Math.floor(Math.random() * ids.length);
  return [...ids.slice(start), ...ids.slice(0, start)];
}

function clearAutoNext() {
  if (autoNextTimer !== null) {
    clearTimeout(autoNextTimer);
    autoNextTimer = null;
  }
}

function scheduleAutoNext() {
  clearAutoNext();
  if (!props.isFacilitator || round.value >= totalRounds.value) return;
  autoNextTimer = window.setTimeout(() => {
    if (phase.value === 'reveal' && round.value < totalRounds.value) nextRound();
  }, 3000);
}

function onGameEvent(msg: any) {
  if (!msg || msg.game !== GAME) return;
  const sender = msg.sender || {};
  switch (msg.action) {
    case 'announce': handleAnnounce(msg); break;
    case 'start': handleStart(msg); break;
    case 'stroke': handleStroke(msg); break;
    case 'clear': clearLocalCanvas(); break;
    case 'guess': handleGuess(msg, sender); break;
    case 'correct': handleCorrect(msg); break;
    case 'reveal': handleReveal(msg); break;
    case 'hint': handleHint(msg); break;
    case 'next_round': handleNextRound(msg); break;
    case 'finish': handleFinish(); break;
    case 'reset': handleReset(); break;
  }
}

// ---- Canvas drawing --------------------------------------------------------

// All strokes are stored and broadcast in a fixed LOGICAL coordinate space
// (CANVAS_W x CANVAS_H) so every client reproduces the same drawing regardless
// of their viewport. The backing bitmap, however, is sized to the element's
// real on-screen size multiplied by devicePixelRatio for crisp lines, and the
// 2D context is transformed so we can keep issuing draw calls in logical units.
interface Stroke { x0: number; y0: number; x1: number; y1: number; c: string; w: number; }
const strokes: Stroke[] = [];

function applyContextScale() {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;
  // Reset any prior transform, then map logical units -> device pixels.
  ctx.setTransform(canvas.width / CANVAS_W, 0, 0, canvas.height / CANVAS_H, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

function repaint() {
  if (!ctx) return;
  ctx.save();
  // Clear in device space, then paint white background + all stored strokes.
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvasRef.value!.width, canvasRef.value!.height);
  ctx.restore();
  applyContextScale();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  for (const s of strokes) paintSegment(s.x0, s.y0, s.x1, s.y1, s.c, s.w);
}

function resizeCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  // Match the bitmap resolution to the displayed CSS size * devicePixelRatio so
  // touch/click coordinates map 1:1 and lines stay sharp on high-DPI screens.
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  // Fall back to the logical aspect ratio if the element hasn't been laid out yet.
  const cssW = rect.width || CANVAS_W;
  const cssH = rect.height || CANVAS_H;
  const targetW = Math.max(1, Math.round(cssW * dpr));
  const targetH = Math.max(1, Math.round(cssH * dpr));
  if (canvas.width === targetW && canvas.height === targetH && ctx) return;
  canvas.width = targetW;
  canvas.height = targetH;
  ctx = canvas.getContext('2d');
  // Re-render the existing drawing so a resize/orientation change isn't a wipe.
  repaint();
}

function clearLocalCanvas() {
  strokes.length = 0;
  repaint();
}

// Paint a segment without recording it (used for repaint + remote strokes).
function paintSegment(x0: number, y0: number, x1: number, y1: number, c: string, w: number) {
  if (!ctx) return;
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

function drawSegment(x0: number, y0: number, x1: number, y1: number, c: string, w: number) {
  strokes.push({ x0, y0, x1, y1, c, w });
  paintSegment(x0, y0, x1, y1, c, w);
}

let lastPoint: { x: number; y: number } | null = null;
let drawing = false;

// Map a client (screen) coordinate to the logical canvas space so peers see the
// same drawing. Scaling by the bitmap/rect ratio guarantees a touch in the
// middle of the element draws in the middle of the canvas.
function clientToLogical(clientX: number, clientY: number) {
  const canvas = canvasRef.value!;
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / (rect.width || 1)) * CANVAS_W;
  const y = ((clientY - rect.top) / (rect.height || 1)) * CANVAS_H;
  return { x, y };
}

function startStroke(clientX: number, clientY: number) {
  if (!isDrawer.value || phase.value !== 'drawing') return;
  drawing = true;
  lastPoint = clientToLogical(clientX, clientY);
}

function extendStroke(clientX: number, clientY: number) {
  if (!drawing || !lastPoint) return;
  const p = clientToLogical(clientX, clientY);
  const c = eraser.value ? '#ffffff' : color.value;
  const w = eraser.value ? lineWidth.value * 4 : lineWidth.value;
  drawSegment(lastPoint.x, lastPoint.y, p.x, p.y, c, w);
  send({ action: 'stroke', x0: lastPoint.x, y0: lastPoint.y, x1: p.x, y1: p.y, c, w });
  lastPoint = p;
}

function endStroke() {
  drawing = false;
  lastPoint = null;
}

function onPointerDown(e: PointerEvent) {
  // Touch is handled by the dedicated touch listeners (which can preventDefault
  // reliably); avoid double-drawing here.
  if (e.pointerType === 'touch') return;
  if (!isDrawer.value || phase.value !== 'drawing') return;
  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  startStroke(e.clientX, e.clientY);
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerType === 'touch') return;
  extendStroke(e.clientX, e.clientY);
}

function onPointerUp() {
  endStroke();
}

function onTouchStart(e: TouchEvent) {
  const t = e.touches[0];
  if (t) startStroke(t.clientX, t.clientY);
}

function onTouchMove(e: TouchEvent) {
  const t = e.touches[0];
  if (t) extendStroke(t.clientX, t.clientY);
}

function onTouchEnd() {
  endStroke();
}

function handleStroke(msg: any) {
  if (msg.sender && msg.sender.id === props.currentUserId) return; // local already painted
  drawSegment(msg.x0, msg.y0, msg.x1, msg.y1, msg.c, msg.w);
}

function clearCanvas() {
  clearLocalCanvas();
  send({ action: 'clear' });
}

// ---- Game flow -------------------------------------------------------------

async function startGame() {
  if (busy.value || !props.isFacilitator) return;
  busy.value = true;
  aiError.value = '';
  aiErrorAction.value = null;
  wordQueue.value = [];
  try {
    const rounds = Math.max(1, Math.min(10, configRounds.value || 3));
    configRounds.value = rounds;
    await prefetchWords(rounds);
    const newWord = takeNextWord();
    rotationOrder.value = buildRotationOrder();
    rotationIndex.value = 0;
    const firstId = rotationOrder.value[0];
    const first = players.value[firstId] || { id: props.currentUserId, name: props.currentUserName };
    send({
      action: 'start',
      word: newWord,
      drawer: { id: first.id, name: first.name },
      total_rounds: rounds,
      round: 1,
      rotation: rotationOrder.value,
    });
  } catch (e) {
    console.error('Failed to start Doodle Quest', e);
    aiError.value = aiErrorMessage(e);
    aiErrorAction.value = 'start';
  } finally {
    busy.value = false;
  }
}

function handleStart(msg: any) {
  clearAutoNext();
  word.value = msg.word;
  drawerId.value = msg.drawer?.id || '';
  drawerName.value = msg.drawer?.name || 'Drawer';
  totalRounds.value = msg.total_rounds || 3;
  round.value = msg.round || 1;
  if (Array.isArray(msg.rotation) && msg.rotation.length) {
    rotationOrder.value = msg.rotation;
    rotationIndex.value = Math.max(0, msg.rotation.indexOf(drawerId.value));
  }
  phase.value = 'drawing';
  winnerName.value = '';
  latestHint.value = '';
  hintsUsed.value = 0;
  ensurePlayer(msg.drawer?.id, msg.drawer?.name);
  guesses.value = [{ system: true, name: 'Game', text: `Round ${round.value} started. ${drawerName.value} is drawing.` }];
  clearLocalCanvas();
  startTimer();
}

function ensurePlayer(id?: string, name?: string) {
  if (!id) return;
  if (!players.value[id]) {
    players.value[id] = { id, name: name || 'Player', score: 0 };
  } else if (name) {
    players.value[id].name = name;
  }
}

function submitGuess() {
  const text = guessInput.value.trim();
  if (!text) return;
  send({ action: 'guess', text, name: props.currentUserName, id: props.currentUserId });
  guessInput.value = '';
}

function handleGuess(msg: any, sender: any) {
  const guesserId = msg.id || sender.id;
  const guesserName = msg.name || sender.display_name || 'Player';
  ensurePlayer(guesserId, guesserName);
  const isCorrect = normalize(msg.text) === normalize(word.value);
  guesses.value.push({ name: guesserName, text: msg.text, correct: isCorrect });
  scrollChat();
  if (isCorrect && phase.value === 'drawing') {
    // Only the original drawer announces the win to avoid double-scoring.
    if (isDrawer.value) {
      send({
        action: 'correct',
        winner: { id: guesserId, name: guesserName },
        word: word.value,
        time_left: timer.value,
      });
    }
  }
}

function normalize(s: string): string {
  return (s || '').toLowerCase().trim().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');
}

function handleCorrect(msg: any) {
  if (phase.value !== 'drawing') return;
  stopTimer();
  const winnerId = msg.winner?.id;
  const winnerN = msg.winner?.name || 'Player';
  winnerName.value = winnerN;
  ensurePlayer(winnerId, winnerN);
  // Guesser score scales with remaining time, drawer gets a flat bonus.
  const guessPoints = 50 + Math.max(0, Math.floor((msg.time_left || 0) / 2));
  if (winnerId && players.value[winnerId]) players.value[winnerId].score += guessPoints;
  if (drawerId.value && players.value[drawerId.value]) players.value[drawerId.value].score += 25;
  guesses.value.push({ system: true, name: 'Game', text: `${winnerN} got it! +${guessPoints} pts. Drawer +25 pts.` });
  scrollChat();
  phase.value = 'reveal';
  if (winnerId === props.currentUserId) {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 } });
  }
  scheduleAutoNext();
}

function handleReveal(msg: any) {
  stopTimer();
  winnerName.value = '';
  guesses.value.push({ system: true, name: 'Game', text: `Time's up! The word was "${msg.word}".` });
  scrollChat();
  phase.value = 'reveal';
  scheduleAutoNext();
}

async function requestHint() {
  if (!isDrawer.value || hintLoading.value || hintsUsed.value >= 3) return;
  hintLoading.value = true;
  aiError.value = '';
  aiErrorAction.value = null;
  try {
    const previous = guesses.value.filter(g => g.system && g.text.startsWith('Hint: ')).map(g => g.text.slice(6));
    const res = await gamesApi.drawingHint(word.value, previous);
    send({ action: 'hint', hint: res.data.hint });
  } catch (e) {
    console.error('Failed to fetch hint', e);
    aiError.value = aiErrorMessage(e);
    aiErrorAction.value = 'hint';
  } finally {
    hintLoading.value = false;
  }
}

function handleHint(msg: any) {
  latestHint.value = msg.hint;
  hintsUsed.value += 1;
  guesses.value.push({ system: true, name: 'Game', text: `Hint: ${msg.hint}` });
  scrollChat();
}

async function nextRound() {
  if (busy.value) return;
  if (!props.isFacilitator) return;
  clearAutoNext();
  busy.value = true;
  aiError.value = '';
  aiErrorAction.value = null;
  try {
    const nextWord = takeNextWord();
    const nextDrawer = pickNextDrawer();
    send({
      action: 'next_round',
      word: nextWord,
      drawer: nextDrawer,
      round: round.value + 1,
      rotation_index: rotationIndex.value,
    });
  } catch (e) {
    console.error('Failed to advance round', e);
    aiError.value = aiErrorMessage(e);
    aiErrorAction.value = 'next';
  } finally {
    busy.value = false;
  }
}

function retryAiAction() {
  switch (aiErrorAction.value) {
    case 'start': startGame(); break;
    case 'next': nextRound(); break;
    case 'hint': requestHint(); break;
  }
}

function pickNextDrawer(): { id: string; name: string } {
  const order = rotationOrder.value.length ? rotationOrder.value : buildRotationOrder();
  if (!rotationOrder.value.length) rotationOrder.value = order;
  if (order.length <= 1) {
    const only = players.value[order[0]] || { id: props.currentUserId, name: props.currentUserName };
    return { id: only.id, name: only.name };
  }
  rotationIndex.value = (rotationIndex.value + 1) % order.length;
  const id = order[rotationIndex.value];
  const p = players.value[id];
  return { id, name: p?.name || 'Drawer' };
}

function handleNextRound(msg: any) {
  clearAutoNext();
  word.value = msg.word;
  drawerId.value = msg.drawer?.id || '';
  drawerName.value = msg.drawer?.name || 'Drawer';
  round.value = msg.round || round.value + 1;
  if (typeof msg.rotation_index === 'number') rotationIndex.value = msg.rotation_index;
  phase.value = 'drawing';
  winnerName.value = '';
  latestHint.value = '';
  hintsUsed.value = 0;
  ensurePlayer(msg.drawer?.id, msg.drawer?.name);
  guesses.value.push({ system: true, name: 'Game', text: `Round ${round.value}: ${drawerName.value} is drawing.` });
  scrollChat();
  clearLocalCanvas();
  startTimer();
}

function finishGame() {
  send({ action: 'finish' });
}

function handleFinish() {
  stopTimer();
  phase.value = 'finished';
  guesses.value.push({ system: true, name: 'Game', text: 'Game over!' });
  scrollChat();
  const winner = sortedScores.value[0];
  if (winner && winner.id === props.currentUserId) {
    confetti({ particleCount: 200, spread: 120, origin: { y: 0.3 } });
  }
}

function resetGame() {
  send({ action: 'reset' });
}

function handleReset() {
  stopTimer();
  clearAutoNext();
  phase.value = 'idle';
  round.value = 0;
  word.value = '';
  drawerId.value = '';
  drawerName.value = '';
  winnerName.value = '';
  latestHint.value = '';
  hintsUsed.value = 0;
  guesses.value = [];
  players.value = {};
  rotationOrder.value = [];
  rotationIndex.value = 0;
  wordQueue.value = [];
  aiError.value = '';
  aiErrorAction.value = null;
  clearLocalCanvas();
}

// ---- Timer -----------------------------------------------------------------

function startTimer() {
  stopTimer();
  timer.value = TURN_SECONDS;
  timerHandle = window.setInterval(() => {
    timer.value -= 1;
    if (timer.value <= 0) {
      stopTimer();
      if (isDrawer.value && phase.value === 'drawing') {
        send({ action: 'reveal', word: word.value });
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

function scrollChat() {
  nextTick(() => {
    const el = chatRef.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
}

let resizeObserver: ResizeObserver | null = null;

function onWindowResize() {
  // Reflow can fire many times during an orientation change; keep it cheap -
  // resizeCanvas() bails out when the bitmap size is already correct.
  resizeCanvas();
}

onMounted(() => {
  nextTick(() => resizeCanvas());
  // Recompute the bitmap whenever the element's box changes (layout shifts,
  // sidebar collapse, orientation change) so coordinates stay in sync and the
  // drawing is preserved via repaint().
  if (typeof ResizeObserver !== 'undefined' && canvasRef.value) {
    resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(canvasRef.value);
  }
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('orientationchange', onWindowResize);
  websocketService.on('game_event', onGameEvent);
  ensurePlayer(props.currentUserId, props.currentUserName);
  announceSelf();
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', onWindowResize);
  window.removeEventListener('orientationchange', onWindowResize);
  websocketService.off('game_event', onGameEvent);
  stopTimer();
  clearAutoNext();
});
</script>

<style scoped>
.doodle-root {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.doodle-status {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
}

.status-line {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
}

.badge-idle { background: #64748b; }
.badge-drawing { background: #10b981; }
.badge-reveal { background: #f59e0b; }
.badge-finished { background: #6366f1; }

.status-meta { color: #475569; font-size: 0.92rem; font-weight: 600; }
.status-timer { margin-left: auto; font-weight: 700; color: #ef4444; }

.prompt-line {
  margin-top: 8px;
  color: #0f172a;
  font-size: 1.02rem;
}

.prompt-line.muted { color: #64748b; }
.word-reveal {
  background: #fef3c7;
  padding: 2px 8px;
  border-radius: 6px;
  letter-spacing: 1px;
}

.hint-pill {
  display: inline-block;
  margin-left: 8px;
  background: #ede9fe;
  color: #5b21b6;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.88rem;
}

.doodle-main {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
  gap: 18px;
}

@media (max-width: 820px) {
  .doodle-main {
    grid-template-columns: 1fr;
  }
  .guesses { height: 260px; }
  /* Give touch users a bigger, squarer drawing area on narrow screens. */
  .doodle-canvas {
    aspect-ratio: 4 / 3;
    min-height: 320px;
  }
}

@media (max-width: 540px) {
  .canvas-toolbar {
    left: 6px;
    right: 6px;
    bottom: 6px;
    padding: 6px 8px;
    gap: 6px;
  }
  .palette { gap: 4px; flex-wrap: wrap; }
  .swatch { width: 22px; height: 22px; }
  .size-btn, .tool-btn { padding: 4px 8px; font-size: 0.78rem; }
  .canvas-overlay { padding: 12px; }
  .overlay-controls { font-size: 0.85rem; gap: 8px; }
  .status-badge { font-size: 0.68rem; padding: 3px 8px; }
  .status-meta { font-size: 0.82rem; }
  .prompt-line { font-size: 0.95rem; }
  .word-reveal { font-size: 0.95rem; letter-spacing: 0.5px; }
  .doodle-btn { padding: 8px 12px; font-size: 0.88rem; }
  .doodle-btn.small { padding: 5px 10px; }
  .side-section { padding: 10px 12px; }
  .guesses { height: 220px; }
  .chat-list { font-size: 0.85rem; }
  .score-rank { width: 26px; }
}

.canvas-wrap {
  position: relative;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.doodle-canvas {
  display: block;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 8 / 5;
  background: #fff;
  /* Prevent the page from scrolling/zooming while drawing so the touch reaches
     the canvas interior; the bitmap is sized to this CSS box * DPR in JS. */
  touch-action: none;
  -ms-touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: not-allowed;
}

.doodle-canvas.drawable { cursor: crosshair; }

.canvas-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 20px;
}

.overlay-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  font-size: 0.92rem;
  color: #334155;
}

.overlay-controls label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.num-input, .select-input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 0.92rem;
}

.num-input { width: 60px; }

.canvas-toolbar {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
}

.palette {
  display: flex;
  gap: 6px;
}

.swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}

.swatch.active {
  border-color: #0f172a;
  transform: scale(1.1);
}

.tool-group {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}

.size-btn, .tool-btn {
  border: 1px solid #cbd5e1;
  background: #fff;
  border-radius: 8px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 0.88rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.size-btn.active, .tool-btn.active {
  border-color: #6366f1;
  background: #ede9fe;
}

.tool-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.dot { background: #0f172a; border-radius: 50%; display: inline-block; }

.doodle-side {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.side-section {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
}

.side-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f172a;
  margin-bottom: 8px;
}

.score-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.score-row:last-child { border-bottom: none; }

.score-rank { width: 32px; }
.score-name { flex: 1; }
.score-val { font-weight: 700; color: #2563eb; }

.guesses { display: flex; flex-direction: column; height: 320px; }
.chat-list {
  flex: 1;
  overflow-y: auto;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.92rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-row.correct { color: #15803d; font-weight: 700; }
.chat-row.system { color: #6366f1; font-style: italic; }
.chat-author { font-weight: 700; margin-right: 4px; color: #334155; }

.chat-input-row {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.chat-input {
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.92rem;
}

.doodle-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.doodle-btn.primary { background: linear-gradient(135deg, #6366f1, #ec4899); }
.doodle-btn.outline { background: #fff; color: #2563eb; border: 2px solid #2563eb; }
.doodle-btn.small { padding: 6px 12px; font-size: 0.88rem; }
.doodle-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.doodle-btn:hover:not(:disabled) { filter: brightness(1.05); }

.muted { color: #64748b; }
.small { font-size: 0.88rem; }

.ai-error {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.92rem;
}
.ai-error-text { flex: 1; min-width: 180px; }
</style>
