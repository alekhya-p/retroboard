<template>
  <div v-if="game" class="game-hero" :style="{ background: game.bg }">
    <span class="game-hero-emoji" aria-hidden="true">{{ game.emoji }}</span>
    <div class="game-hero-copy">
      <h2 class="game-hero-name">{{ game.name }}</h2>
      <p class="game-hero-desc">{{ game.description }}</p>
      <span class="game-hero-meta">{{ game.players }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameDef } from './gamesCatalog';

defineProps<{
  game: GameDef | undefined;
}>();
</script>

<style scoped>
.game-hero {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  border-radius: 16px;
  padding: 16px 18px;
  margin-bottom: 16px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
}

.game-hero-emoji {
  font-size: 2.4rem;
  line-height: 1;
  flex-shrink: 0;
}

.game-hero-copy {
  min-width: 0;
}

.game-hero-name {
  margin: 0 0 4px;
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
}

.game-hero-desc {
  margin: 0 0 8px;
  font-size: 0.92rem;
  color: #334155;
  line-height: 1.45;
}

.game-hero-meta {
  font-size: 0.78rem;
  font-weight: 600;
  color: #475569;
  background: rgba(255, 255, 255, 0.55);
  padding: 3px 10px;
  border-radius: 999px;
}

@media (max-width: 540px) {
  .game-hero {
    padding: 14px;
    gap: 10px;
  }
  .game-hero-emoji { font-size: 2rem; }
  .game-hero-name { font-size: 1.1rem; }
  .game-hero-desc { font-size: 0.85rem; }
}
</style>
