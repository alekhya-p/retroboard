<template>
  <div class="gp-root">
    <div class="play-header">
      <div>
        <div class="play-title">🎮 Team Game Room</div>
        <div class="play-sub">Standalone game room · share the link to invite players</div>
      </div>
      <div class="play-actions">
        <div class="players-pill">
          <span class="player-dot" style="background:#6366f1">A</span>
          <span class="player-dot" style="background:#ec4899">P</span>
          <span class="player-dot" style="background:#16a34a">S</span>
          <span class="player-dot more">+3</span>
        </div>
        <button class="btn btn--outline">🔗 Copy invite link</button>
      </div>
    </div>

    <div class="game-picker">
      <button
        v-for="g in games"
        :key="g.id"
        class="game-card"
        :class="{ active: g.id === 'doodle' }"
        :style="{ background: g.id === 'doodle' ? g.activeBg : g.bg }"
      >
        <span class="game-emoji">{{ g.emoji }}</span>
        <span class="game-name">{{ g.name }}</span>
      </button>
    </div>

    <div class="game-stage surface">
      <div class="stage-status">
        <span class="stage-badge">Drawing</span>
        <span class="stage-meta">Round 1 / 3 · ✏️ Alex is drawing</span>
        <span class="stage-timer">⏰ 42s</span>
      </div>
      <div class="stage-canvas">
        <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M30 90 Q60 20 100 70 T170 50" fill="none" stroke="#4f46e5" stroke-width="4" stroke-linecap="round" />
          <circle cx="150" cy="40" r="12" fill="none" stroke="#ec4899" stroke-width="4" />
        </svg>
      </div>
      <div class="stage-guess">
        <input class="stage-input" placeholder="Type your guess…" disabled />
        <button class="btn btn--primary btn--sm">Guess</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const games = [
  { id: 'doodle', name: 'Doodle Quest', emoji: '🎨', bg: '#fef3c7', activeBg: '#fcd34d' },
  { id: 'trivia', name: 'Trivia Race', emoji: '🧠', bg: '#dbeafe', activeBg: '#93c5fd' },
  { id: 'emoji', name: 'Emoji Tales', emoji: '😄', bg: '#fce7f3', activeBg: '#f9a8d4' },
  { id: 'two_truths', name: 'Two Truths & a Lie', emoji: '🤥', bg: '#dcfce7', activeBg: '#86efac' },
  { id: 'meeting_roulette', name: 'Meeting Roulette', emoji: '🎰', bg: '#e0f2fe', activeBg: '#7dd3fc' },
];
</script>

<style scoped>
.gp-root { padding: 28px 24px; background: ghostwhite; min-height: 100%; box-sizing: border-box; }

.play-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
.play-title {
  font-size: 1.8rem; font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.play-sub { color: #64748b; font-size: 0.95rem; }
.play-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.players-pill { display: flex; align-items: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 999px; padding: 3px 6px; }
.player-dot {
  width: 28px; height: 28px; margin-left: -6px; border-radius: 50%; color: #fff;
  display: inline-flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;
  border: 2px solid #fff;
}
.player-dot:first-child { margin-left: 0; }
.player-dot.more { background: #4b5563; }

.game-picker { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
.game-card {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  border: none; border-radius: 14px; padding: 14px 18px; cursor: pointer;
  font-weight: 600; color: #1e293b; min-width: 96px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}
.game-card.active { outline: 2px solid #0f172a22; transform: translateY(-2px); }
.game-emoji { font-size: 1.6rem; }
.game-name { font-size: 0.82rem; }

.game-stage { margin-top: 4px; }
.stage-status { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
.stage-badge { background: #fcd34d; color: #92400e; font-weight: 700; font-size: 0.8rem; padding: 4px 10px; border-radius: 999px; }
.stage-meta { color: #475569; font-size: 0.9rem; }
.stage-timer { margin-left: auto; font-weight: 700; color: #0f172a; }
.stage-canvas {
  background: #fff; border: 1.5px dashed #c7d2fe; border-radius: 12px; height: 180px;
  display: flex; align-items: center; justify-content: center;
}
.stage-canvas svg { width: 80%; height: 80%; }
.stage-guess { display: flex; gap: 10px; margin-top: 12px; }
.stage-input { flex: 1; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; font-size: 1rem; background: #fff; }
</style>
