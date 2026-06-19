<template>
  <div class="ai-root">
    <div class="ai-eyebrow"><span class="ai-eyebrow-dot"></span> AI template generator</div>
    <h1 class="ai-h1">Generate a custom retro from a prompt</h1>

    <div class="ai-card surface">
      <h2>What kind of retro do you want?</h2>
      <p class="ai-sub">Give the AI a one-sentence brief - the more flavor, the better.</p>
      <textarea class="ai-textarea" rows="3" readonly>A retro for our launch week, with a wrestling theme</textarea>
      <div class="ai-chips">
        <span class="ai-chip">Async, 4 time zones</span>
        <span class="ai-chip">Risk-focused, pre-launch</span>
        <span class="ai-chip">Star Wars hackathon</span>
      </div>
      <div class="ai-card-actions">
        <button class="btn btn--secondary"><span>✨</span> Generate template</button>
        <button class="btn btn--ghost">Browse ready-made →</button>
      </div>
    </div>

    <div class="ai-draft surface">
      <span class="ai-draft-tag">Draft template</span>
      <h3>Royal Rumble Retro</h3>
      <p class="ai-draft-desc">A high-energy retro themed around a wrestling pay-per-view.</p>
      <div class="ai-draft-cols">
        <div class="ai-draft-col" v-for="c in draftCols" :key="c.name" :style="{ borderTopColor: c.color }">
          <div class="ai-draft-col-name">{{ c.name }}</div>
          <p>{{ c.desc }}</p>
          <span v-if="c.action" class="ai-action-pill">Action column</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const draftCols = [
  { name: '🏆 Title Wins', desc: 'Where we pinned our goals.', color: '#16a34a', action: false },
  { name: '🪑 Steel Chairs', desc: 'What hit us out of nowhere.', color: '#f59e0b', action: false },
  { name: '🔔 Next Match', desc: 'Moves to make next sprint.', color: '#2563eb', action: true },
];
</script>

<style scoped>
.ai-root { padding: 28px 24px; background: ghostwhite; min-height: 100%; box-sizing: border-box; }
.ai-eyebrow {
  display: inline-flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #4f46e5; font-weight: 600;
  background: rgba(99, 102, 241, 0.1); padding: 6px 12px; border-radius: 999px;
}
.ai-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; }
.ai-h1 { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 14px 0 18px; }

.ai-card h2 { font-size: 1.3rem; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
.ai-sub { color: #64748b; margin: 0 0 14px; }
.ai-textarea {
  width: 100%; box-sizing: border-box; border: 1.5px solid #e2e8f0; border-radius: 12px;
  padding: 12px 14px; font-size: 1rem; font-family: inherit; background: #fafbff; resize: none; color: #334155;
}
.ai-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0; }
.ai-chip { background: rgba(99, 102, 241, 0.08); color: #4f46e5; border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 999px; padding: 6px 12px; font-size: 0.82rem; font-weight: 500; }
.ai-card-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }

.ai-draft { margin-top: 18px; }
.ai-draft-tag { background: rgba(99, 102, 241, 0.12); color: #4f46e5; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 999px; }
.ai-draft h3 { font-size: 1.4rem; color: #0f172a; margin: 10px 0 4px; }
.ai-draft-desc { color: #475569; margin: 0 0 14px; }
.ai-draft-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
.ai-draft-col { background: #fff; border: 1px solid rgba(15, 23, 42, 0.06); border-top: 4px solid; border-radius: 12px; padding: 14px; }
.ai-draft-col-name { font-weight: 700; color: #0f172a; font-size: 0.96rem; }
.ai-draft-col p { color: #475569; font-size: 0.85rem; margin: 6px 0 0; }
.ai-action-pill { display: inline-block; margin-top: 8px; background: rgba(99, 102, 241, 0.12); color: #4f46e5; font-size: 0.72rem; font-weight: 600; padding: 3px 8px; border-radius: 999px; }
</style>
