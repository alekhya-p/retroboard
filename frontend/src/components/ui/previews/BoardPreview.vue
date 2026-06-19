<template>
  <div class="bp-root" :class="[`bp-root--${layout}`, { 'bp-root--sheet': sheetOpen }]">
    <div class="bp-header">
      <div class="bp-title-row">
        <h1>Sprint 42 Retro</h1>
        <div class="bp-avatars">
          <span class="bp-avatar" style="background:#2563eb">AK</span>
          <span class="bp-avatar" style="background:#8b5cf6">PN</span>
          <span class="bp-avatar" style="background:#16a34a">SL</span>
          <span class="bp-avatar bp-avatar--more">+2</span>
        </div>
      </div>
      <div v-if="layout === 'desktop'" class="bp-actions">
        <button class="btn btn--secondary">🎲 AI Icebreaker</button>
        <button class="btn btn--primary">🎮 Play Games</button>
        <button class="btn btn--outline">⬇️ Export</button>
        <button class="btn btn--primary">✨ Summary</button>
        <button class="btn btn--outline">⚙️ Board Options</button>
      </div>
      <button v-else class="btn btn--primary btn--block bp-actions-trigger">⚙️ Board actions</button>
      <div class="bp-desc">Our end-of-sprint retrospective for the payments squad.</div>
    </div>

    <div class="bp-cols" :class="`bp-cols--${layout}`">
      <div class="bp-col" v-for="col in columns" :key="col.id">
        <BoardColumn :column="col" :messages="msgsFor(col.id)" :isAction="col.is_action_column" :canEdit="false" />
      </div>
    </div>

    <!-- Board actions bottom sheet (open state) -->
    <div v-if="sheetOpen" class="bp-sheet-overlay">
      <div class="bp-sheet">
        <div class="bp-sheet-grab"></div>
        <div class="bp-sheet-title">Board actions</div>
        <div class="bp-sheet-list">
          <div class="bp-sheet-item"><span class="bp-sheet-ic">🎲</span> AI Icebreaker</div>
          <div class="bp-sheet-item"><span class="bp-sheet-ic">🎮</span> Play Games</div>
          <div class="bp-sheet-item"><span class="bp-sheet-ic">⬇️</span> Export Actions</div>
          <div class="bp-sheet-item"><span class="bp-sheet-ic">✨</span> Generate Summary</div>
          <div class="bp-sheet-item"><span class="bp-sheet-ic">⏰</span> Start Timer</div>
          <div class="bp-sheet-item"><span class="bp-sheet-ic">🔗</span> Share Board</div>
          <div class="bp-sheet-item"><span class="bp-sheet-ic">✏️</span> Edit Board</div>
          <div class="bp-sheet-item"><span class="bp-sheet-ic">💬</span> Show All Messages</div>
          <div class="bp-sheet-item bp-sheet-item--danger"><span class="bp-sheet-ic">🗑️</span> Delete Board</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardColumn from '@/components/BoardColumn.vue';

withDefaults(defineProps<{ layout?: 'desktop' | 'mobile'; sheetOpen?: boolean }>(), {
  layout: 'desktop',
  sheetOpen: false,
});

const columns = [
  { id: 'c1', name: 'What went well', color: '#16a34a', description: 'Wins from the sprint', is_action_column: false, icon: '✅' },
  { id: 'c2', name: 'To improve', color: '#f59e0b', description: 'Bumps in the road', is_action_column: false, icon: '🛠️' },
  { id: 'c3', name: 'Action items', color: '#2563eb', description: 'What we will do next', is_action_column: true, icon: '🎯' },
];
const messages = [
  { id: 'm1', column_id: 'c1', text: 'Clean release, zero rollbacks 🎉', user_id: 'u1', user_display_name: 'Alex Kim' },
  { id: 'm2', column_id: 'c1', text: 'Pairing sessions were great', user_id: 'u2', user_display_name: 'Priya N' },
  { id: 'm3', column_id: 'c2', text: 'Standups ran long', user_id: 'u3', user_display_name: 'Sam Lee' },
  { id: 'm4', column_id: 'c2', text: 'Flaky CI on Fridays', user_id: 'u5', user_display_name: 'Dana R' },
  { id: 'm5', column_id: 'c3', text: 'Timebox standup to 15 min', user_id: 'u4', user_display_name: 'Jordan' },
];
function msgsFor(id: string) {
  return messages.filter(m => m.column_id === id);
}
</script>

<style scoped>
.bp-root {
  position: relative;
  padding: 28px 24px;
  background: ghostwhite;
  min-height: 100%;
  box-sizing: border-box;
}
/* For the "sheet open" miniature, cap the content to roughly the phone's
   visible area so the bottom sheet lands at the bottom of the screen. */
.bp-root--sheet {
  height: 760px;
  overflow: hidden;
}
.bp-header { margin-bottom: 18px; }
.bp-title-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.bp-title-row h1 { font-size: 2.2rem; font-weight: 700; color: #222; margin: 0; }
.bp-avatars { display: flex; gap: 6px; }
.bp-avatar {
  width: 34px; height: 34px; border-radius: 50%; color: #fff; font-weight: 700; font-size: 0.85rem;
  display: inline-flex; align-items: center; justify-content: center;
}
.bp-avatar--more { background: #4b5563; }
.bp-actions { display: flex; gap: 12px; flex-wrap: wrap; margin: 14px 0 8px; }
.bp-actions-trigger { margin: 14px 0 8px; }
.bp-desc { color: #444; font-size: 1.15rem; }

/* Board actions bottom sheet (open-state miniature) */
.bp-sheet-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: flex-end;
}
.bp-sheet {
  width: 100%;
  background: #fff;
  border-radius: 22px 22px 0 0;
  padding: 14px 18px 22px;
  box-shadow: 0 -10px 40px rgba(15, 23, 42, 0.2);
}
.bp-sheet-grab {
  width: 42px;
  height: 5px;
  border-radius: 999px;
  background: #cbd5e1;
  margin: 0 auto 12px;
}
.bp-sheet-title { font-weight: 700; font-size: 1.2rem; color: #0f172a; margin-bottom: 8px; }
.bp-sheet-list { display: flex; flex-direction: column; }
.bp-sheet-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 6px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
}
.bp-sheet-item--danger { color: #e11d48; }
.bp-sheet-ic { font-size: 1.2em; width: 1.5em; text-align: center; }

.bp-cols { display: flex; gap: 16px; align-items: flex-start; }
.bp-cols--desktop { flex-direction: row; }
.bp-cols--mobile { flex-direction: column; }
.bp-col { flex: 1 1 0; min-width: 0; }
.bp-cols--mobile .bp-col { width: 100%; }
</style>
