<template>
  <AppPage variant="app">
    <Breadcrumbs :items="crumbs" />

    <template v-if="!gameId">
      <h1 class="bg-title">🎮 Team Games</h1>
      <p class="bg-sub">Pick a game - everyone on this board can join live.</p>
      <div class="bg-grid">
        <button
          v-for="g in games"
          :key="g.id"
          type="button"
          class="bg-card"
          :style="{ background: g.bg }"
          @click="selectGame(g.id)"
        >
          <div class="bg-emoji">{{ g.emoji }}</div>
          <div class="bg-name">{{ g.name }}</div>
          <div class="bg-desc">{{ g.description }}</div>
          <div class="bg-meta">{{ g.players }}</div>
        </button>
      </div>
    </template>

    <template v-else>
      <GameHeroCard :game="currentGame" />
      <div class="surface bg-stage">
        <GameHost
          :game-id="gameId"
          :current-user-id="userId"
          :current-user-name="userName"
          :is-facilitator="isFacilitator"
        />
      </div>
    </template>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppPage from '@/components/ui/AppPage.vue';
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue';
import GameHost from '@/components/games/GameHost.vue';
import GameHeroCard from '@/components/games/GameHeroCard.vue';
import { GAMES, getGame } from '@/components/games/gamesCatalog';
import { useBoardStore } from '@/stores/board';
import { useAuthStore } from '@/stores/auth';
import websocketService from '@/services/websocket';

const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();
const authStore = useAuthStore();

const games = GAMES;
const boardId = computed(() => route.params.id as string);
const gameId = computed(() => route.params.gameId as string | undefined);
const currentGame = computed(() => getGame(gameId.value));

const board = computed(() => boardStore.currentBoard);
const boardName = computed(() => board.value?.name || 'Board');
const userId = computed(() => authStore.user?.id || '');
const userName = computed(() => authStore.user?.display_name || 'Player');
const isFacilitator = computed(() => !!board.value && board.value.facilitator_id === authStore.user?.id);

const crumbs = computed(() => {
  const base = [{ label: boardName.value, to: `/boards/${boardId.value}` }];
  if (!gameId.value) return [...base, { label: 'Games' }];
  return [
    ...base,
    { label: 'Games', to: `/boards/${boardId.value}/games` },
    { label: currentGame.value?.name || 'Game' },
  ];
});

function selectGame(id: string | null) {
  const path = id
    ? `/boards/${boardId.value}/games/${id}`
    : `/boards/${boardId.value}/games`;
  router.push(path);
  if (isFacilitator.value) {
    websocketService.send({ type: 'room_event', action: 'select_game', game_id: id });
  }
}

function onRoomEvent(msg: any) {
  if (msg?.action !== 'select_game') return;
  if (isFacilitator.value) return;
  const path = msg.game_id
    ? `/boards/${boardId.value}/games/${msg.game_id}`
    : `/boards/${boardId.value}/games`;
  if (route.path !== path) router.push(path);
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }
  try {
    await boardStore.fetchBoard(boardId.value);
  } catch (e) {
    // breadcrumb falls back to "Board"; games still work over the socket
  }
  // Games ride the board's room so everyone on the board sees them live.
  websocketService.connect(boardId.value);
  websocketService.on('room_event', onRoomEvent);
});

onUnmounted(() => {
  websocketService.off('room_event', onRoomEvent);
  websocketService.disconnect();
});
</script>

<style scoped>
.bg-title {
  font-size: clamp(1.6rem, 4vw, 2rem);
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px;
}
.bg-sub {
  color: #64748b;
  margin: 0 0 20px;
}

.bg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.bg-card {
  display: block;
  text-align: left;
  border: none;
  cursor: pointer;
  color: #0f172a;
  border-radius: 16px;
  padding: 22px 20px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  font-family: inherit;
  width: 100%;
}
.bg-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
}
.bg-emoji { font-size: 2.2rem; margin-bottom: 8px; }
.bg-name { font-size: 1.2rem; font-weight: 700; margin-bottom: 6px; }
.bg-desc { font-size: 0.95rem; color: #334155; line-height: 1.4; margin-bottom: 10px; }
.bg-meta {
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
  background: rgba(255, 255, 255, 0.55);
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
}

.bg-stage { padding: clamp(14px, 3vw, 24px); }
</style>
