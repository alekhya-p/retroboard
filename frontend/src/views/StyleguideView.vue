<template>
  <AppPage variant="app">
    <header class="sg-head">
      <h1>Design System</h1>
      <p class="sg-sub">
        Every shared primitive in one place. Resize the window (or open on a phone) to see the
        responsive buttons, the dialog → bottom-sheet behaviour, and the live app miniature adapt.
      </p>
      <nav class="sg-toc">
        <a href="#buttons">Buttons</a>
        <a href="#forms">Form controls</a>
        <a href="#surfaces">Surfaces</a>
        <a href="#dialogs">Dialogs &amp; sheets</a>
        <a href="#timer">Timer</a>
        <a href="#toasts">Toasts</a>
        <a href="#draw">Drawing canvas</a>
        <a href="#mini">App-shell miniature</a>
      </nav>
    </header>

    <!-- Buttons -->
    <section id="buttons" class="surface sg-section">
      <h2>Buttons</h2>
      <p class="sg-note">Variants</p>
      <div class="sg-row">
        <button class="btn btn--primary">Primary</button>
        <button class="btn btn--secondary">Secondary</button>
        <button class="btn btn--outline">Outline</button>
        <button class="btn btn--ghost">Ghost</button>
        <button class="btn btn--subtle">Subtle</button>
        <button class="btn btn--danger">Danger</button>
      </div>

      <p class="sg-note">Sizes</p>
      <div class="sg-row">
        <button class="btn btn--primary btn--sm">Small</button>
        <button class="btn btn--primary">Medium</button>
        <button class="btn btn--primary btn--lg">Large</button>
        <button class="btn btn--outline btn--icon" aria-label="Add">＋</button>
      </div>

      <p class="sg-note">States &amp; the BaseButton component</p>
      <div class="sg-row">
        <button class="btn btn--primary" disabled>Disabled</button>
        <BaseButton variant="secondary" :loading="true">Loading</BaseButton>
        <BaseButton variant="primary" size="lg">BaseButton</BaseButton>
      </div>
      <div class="sg-row">
        <button class="btn btn--primary btn--block">Full-width (.btn--block)</button>
      </div>
    </section>

    <!-- Form controls -->
    <section id="forms" class="surface sg-section">
      <h2>Form controls</h2>
      <p class="sg-note">Inputs fill their container with one consistent padding - no doubled side padding.</p>
      <div class="sg-form-grid">
        <div>
          <label class="sg-field-label" for="sg-text">Text input</label>
          <input id="sg-text" class="sg-input" type="text" placeholder="Board name" v-model="sampleName" />
        </div>
        <div>
          <label class="sg-field-label" for="sg-select">Select</label>
          <select id="sg-select" class="sg-input" v-model="sampleSelect">
            <option>Team Alpha</option>
            <option>Team Beta</option>
          </select>
        </div>
        <div class="sg-col-span">
          <label class="sg-field-label" for="sg-area">Textarea</label>
          <textarea id="sg-area" class="sg-input" rows="3" placeholder="Description" v-model="sampleDesc"></textarea>
        </div>
        <div>
          <label class="sg-field-label" for="sg-num">Number</label>
          <input id="sg-num" class="sg-input" type="number" min="1" v-model="sampleNum" />
        </div>
        <div class="sg-inline">
          <label class="sg-field-label" for="sg-color">Color</label>
          <input id="sg-color" type="color" v-model="sampleColor" class="sg-color" />
          <label class="sg-check">
            <input type="checkbox" v-model="sampleCheck" /> Submit anonymously
          </label>
        </div>
      </div>
    </section>

    <!-- Surfaces & tokens -->
    <section id="surfaces" class="sg-section">
      <h2 class="sg-h2-bare">Surfaces &amp; layout</h2>
      <div class="sg-grid">
        <div class="surface">
          <h3>.surface card</h3>
          <p class="sg-muted">One responsive padding (clamp 16-28px). Content never adds extra side padding.</p>
        </div>
        <div class="surface">
          <h3>AppPage</h3>
          <p class="sg-muted">Owns the page gutter + max-width (app / marketing / narrow), so pages don't.</p>
        </div>
        <div class="surface">
          <h3>Color tokens</h3>
          <div class="sg-swatches">
            <span class="sg-swatch" style="background:#2563eb"></span>
            <span class="sg-swatch" style="background:#6366f1"></span>
            <span class="sg-swatch" style="background:#8b5cf6"></span>
            <span class="sg-swatch" style="background:#e11d48"></span>
            <span class="sg-swatch" style="background:#16a34a"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- Dialogs -->
    <section id="dialogs" class="surface sg-section">
      <h2>Dialogs &amp; bottom sheets</h2>
      <p class="sg-note">
        Desktop: both are centered dialogs. Phone: the confirm stays a small centered dialog, the
        form becomes a bottom sheet (with iOS safe-area padding).
      </p>
      <div class="sg-row">
        <button class="btn btn--danger" @click="showConfirm = true">Open confirm (dialog)</button>
        <button class="btn btn--primary" @click="showForm = true">Open form (sheet on mobile)</button>
      </div>
    </section>

    <!-- Timer -->
    <section id="timer" class="surface sg-section">
      <h2>Timer</h2>
      <p class="sg-note">Countdown display chip + the "Set timer" dialog used on a board.</p>
      <div class="sg-row">
        <span class="timer-chip">⏰ 04:32</span>
        <button class="btn btn--outline" @click="showTimer = true">Set timer…</button>
      </div>
    </section>

    <!-- Share -->
    <section id="share" class="surface sg-section">
      <h2>Share (QR + link)</h2>
      <p class="sg-note">Shareable link for boards &amp; game rooms with a scannable QR code and native share.</p>
      <div class="sg-row">
        <button class="btn btn--primary" @click="showShare = true">🔗 Open share dialog</button>
      </div>
    </section>

    <!-- Toasts -->
    <section id="toasts" class="surface sg-section">
      <h2>Toasts</h2>
      <p class="sg-note">Non-blocking notifications (top-right on desktop, bottom on mobile).</p>
      <div class="sg-row">
        <button class="btn btn--subtle" @click="toast.info('Heads up - this is an info toast.')">Info</button>
        <button class="btn btn--primary" @click="toast.success('Saved successfully!')">Success</button>
        <button class="btn btn--danger" @click="toast.error('Something went wrong.')">Error</button>
      </div>
    </section>

    <!-- Drawing canvas -->
    <section id="draw" class="surface sg-section">
      <h2>Drawing canvas (Doodle)</h2>
      <p class="sg-note">
        The responsive, touch-friendly canvas technique used by Doodle Quest. Draw with a mouse or
        finger - touches map correctly to where you press, including the middle.
      </p>
      <canvas
        ref="canvas"
        class="sg-canvas"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointerleave="onUp"
      ></canvas>
      <div class="sg-row" style="margin-top: 10px;">
        <button class="btn btn--subtle btn--sm" @click="clearCanvas">Clear</button>
      </div>
    </section>

    <!-- App-shell miniatures -->
    <section id="mini" class="sg-section">
      <h2 class="sg-h2-bare">App-shell miniatures</h2>
      <p class="sg-muted" style="margin-bottom:18px;">
        Live, scaled-down replicas of the real pages inside a browser shell (desktop) and an
        iPhone shell (mobile).
      </p>

      <h3 class="sg-mini-label">Board page</h3>
      <div class="shell-row">
        <BrowserShell url="reaitro.com/boards/sprint-42" :zoom="0.6" :height="420">
          <BoardPreview layout="desktop" />
        </BrowserShell>
        <PhoneShell url="reaitro.com/boards/sprint-42" :zoom="0.58">
          <BoardPreview layout="mobile" />
        </PhoneShell>
        <PhoneShell url="reaitro.com/boards/sprint-42" :zoom="0.58">
          <BoardPreview layout="mobile" :sheet-open="true" />
        </PhoneShell>
      </div>

      <h3 class="sg-mini-label">Games page</h3>
      <div class="shell-row">
        <BrowserShell url="reaitro.com/play/team-room" :zoom="0.6" :height="420">
          <GamesPreview />
        </BrowserShell>
        <PhoneShell url="reaitro.com/play/team-room" :zoom="0.5">
          <GamesPreview />
        </PhoneShell>
      </div>

      <h3 class="sg-mini-label">Generate template with AI</h3>
      <div class="shell-row">
        <BrowserShell url="reaitro.com/ai-generator" :zoom="0.6" :height="460">
          <AiTemplatePreview />
        </BrowserShell>
        <PhoneShell url="reaitro.com/ai-generator" :zoom="0.5">
          <AiTemplatePreview />
        </PhoneShell>
      </div>
    </section>

    <!-- Confirm dialog -->
    <BaseDialog :open="showConfirm" title="Delete board?" size="sm" mobile="dialog" @close="showConfirm = false">
      <p class="sg-muted" style="margin:0">This is a short yes/no confirmation, so it stays a centered dialog even on mobile.</p>
      <template #actions>
        <button class="btn btn--subtle" @click="showConfirm = false">Cancel</button>
        <button class="btn btn--danger" @click="showConfirm = false">Delete</button>
      </template>
    </BaseDialog>

    <!-- Form dialog / bottom sheet -->
    <BaseDialog :open="showForm" title="Create board" size="md" mobile="sheet" @close="showForm = false">
      <label class="sg-field-label" for="sg-name">Board name</label>
      <input id="sg-name" v-model="sampleName" class="sg-input" type="text" placeholder="Sprint 42 retro" />
      <label class="sg-field-label" for="sg-desc2">Description</label>
      <textarea id="sg-desc2" v-model="sampleDesc" class="sg-input" rows="3" placeholder="What is this retro about?"></textarea>
      <template #actions>
        <button class="btn btn--subtle" @click="showForm = false">Cancel</button>
        <button class="btn btn--primary" @click="onFakeCreate">Create board</button>
      </template>
    </BaseDialog>

    <!-- Share dialog -->
    <ShareDialog :open="showShare" url="https://reaitro.com/boards/sprint-42" title="Sprint 42 Retro" @close="showShare = false" />

    <!-- Timer dialog -->
    <BaseDialog :open="showTimer" title="Set timer" size="sm" mobile="dialog" @close="showTimer = false">
      <label class="sg-field-label" for="sg-timer">Minutes</label>
      <input id="sg-timer" v-model="sampleNum" class="sg-input" type="number" min="1" />
      <template #actions>
        <button class="btn btn--subtle" @click="showTimer = false">Cancel</button>
        <button class="btn btn--primary" @click="showTimer = false">Start</button>
      </template>
    </BaseDialog>
  </AppPage>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import AppPage from '@/components/ui/AppPage.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import ShareDialog from '@/components/ui/ShareDialog.vue';
import BrowserShell from '@/components/ui/BrowserShell.vue';
import PhoneShell from '@/components/ui/PhoneShell.vue';
import BoardPreview from '@/components/ui/previews/BoardPreview.vue';
import GamesPreview from '@/components/ui/previews/GamesPreview.vue';
import AiTemplatePreview from '@/components/ui/previews/AiTemplatePreview.vue';
import { useToast } from '@/composables/useToast';

const toast = useToast();

const showConfirm = ref(false);
const showForm = ref(false);
const showTimer = ref(false);
const showShare = ref(false);

const sampleName = ref('');
const sampleDesc = ref('');
const sampleSelect = ref('Team Alpha');
const sampleNum = ref(5);
const sampleColor = ref('#2563eb');
const sampleCheck = ref(false);

function onFakeCreate() {
  showForm.value = false;
  toast.success('Board created (demo).');
}

/* ---- Self-contained drawing canvas demo (DPR-aware + pointer/touch) ---- */
const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let drawing = false;
let last: { x: number; y: number } | null = null;

function setupCanvas() {
  const c = canvas.value;
  if (!c) return;
  const rect = c.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  c.width = Math.round(rect.width * dpr);
  c.height = Math.round(rect.height * dpr);
  ctx = c.getContext('2d');
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#4f46e5';
  }
}
function pointFromEvent(e: PointerEvent) {
  const c = canvas.value!;
  const rect = c.getBoundingClientRect();
  // Map client coords into the canvas's CSS pixel space (ctx is already scaled by DPR).
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
function onDown(e: PointerEvent) {
  if (!ctx) setupCanvas();
  drawing = true;
  last = pointFromEvent(e);
  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
}
function onMove(e: PointerEvent) {
  if (!drawing || !ctx || !last) return;
  const p = pointFromEvent(e);
  ctx.beginPath();
  ctx.moveTo(last.x, last.y);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  last = p;
}
function onUp() {
  drawing = false;
  last = null;
}
function clearCanvas() {
  const c = canvas.value;
  if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
}
function onResize() {
  setupCanvas();
}

onMounted(() => {
  nextTick(setupCanvas);
  window.addEventListener('resize', onResize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped>
.sg-head { margin-bottom: 8px; }
.sg-head h1 { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
.sg-sub { color: #64748b; max-width: 660px; }

.sg-toc { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.sg-toc a {
  font-size: 0.82rem; font-weight: 600; color: #4f46e5; text-decoration: none;
  background: rgba(99, 102, 241, 0.08); padding: 5px 11px; border-radius: 999px;
}
.sg-toc a:hover { background: rgba(99, 102, 241, 0.16); }

.sg-section { margin-top: 20px; scroll-margin-top: 80px; }
.sg-section h2,
.sg-h2-bare { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 14px; }
.sg-note { color: #64748b; font-size: 0.9rem; margin: 18px 0 8px; font-weight: 600; }
.sg-note:first-of-type { margin-top: 0; }
.sg-muted { color: #64748b; }
code { background: #eef2ff; padding: 1px 6px; border-radius: 4px; font-size: 0.9em; }

.sg-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.sg-row + .sg-row { margin-top: 12px; }

.sg-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.sg-grid h3 { margin: 0 0 6px; font-size: 1.02rem; color: #0f172a; }

.sg-swatches { display: flex; gap: 8px; }
.sg-swatch { width: 28px; height: 28px; border-radius: 8px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.06); }

.sg-form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
.sg-col-span { grid-column: 1 / -1; }
.sg-inline { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.sg-field-label { display: block; font-weight: 600; color: #334155; margin: 0 0 4px; font-size: 0.9rem; }
.sg-input {
  width: 100%; box-sizing: border-box; border: 1.5px solid #e2e8f0; border-radius: 10px;
  padding: 10px 12px; font-size: 1rem; font-family: inherit; outline: none;
}
.sg-input:focus { border-color: #6366f1; }
.sg-color { width: 44px; height: 36px; border: none; background: none; padding: 0; cursor: pointer; }
.sg-check { display: inline-flex; align-items: center; gap: 6px; color: #475569; font-size: 0.92rem; }

.timer-chip {
  display: inline-flex; align-items: center; font-size: 1.4rem; font-weight: 700; color: #0f172a;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 6px 16px;
}

.sg-canvas {
  width: 100%;
  height: 260px;
  background: #fff;
  border: 1.5px dashed #c7d2fe;
  border-radius: 12px;
  touch-action: none;
  cursor: crosshair;
  display: block;
}

/* ---- App-shell miniatures ---- */
.sg-mini-label { font-size: 0.95rem; font-weight: 700; color: #334155; margin: 22px 0 12px; }
.shell-row { display: flex; gap: 32px; flex-wrap: wrap; align-items: flex-start; }
</style>
