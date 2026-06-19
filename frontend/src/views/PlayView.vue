<template>
  <AppPage variant="app">
    <div v-if="loading" class="loading-state">Loading game room…</div>

    <div v-else-if="error" class="error-state">
      <h2>Couldn't load the game</h2>
      <p>{{ error }}</p>
      <button class="btn btn--secondary" @click="router.push('/play')">Back to lobby</button>
    </div>

    <div v-else-if="board" class="play-shell">
      <div class="play-header">
        <div>
          <div class="play-title">🎮 {{ board.name }}</div>
          <div class="play-sub">Standalone game room · share the link to invite players</div>
        </div>
        <div class="play-actions">
          <div class="players-pill" v-if="players.length">
            <span v-for="p in players.slice(0, 6)" :key="p.id" class="player-dot" :title="p.display_name">
              {{ (p.display_name || '?').charAt(0).toUpperCase() }}
            </span>
            <span v-if="players.length > 6" class="player-dot more">+{{ players.length - 6 }}</span>
          </div>
          <button class="btn btn--outline" @click="shareDialog = true">🔗 Invite players</button>
        </div>
      </div>

      <!-- Game picker -->
      <div v-if="!activeGameId" class="game-picker">
        <button
          v-for="g in games"
          :key="g.id"
          type="button"
          class="game-card"
          :style="{ background: g.bg }"
          @click="selectGame(g.id)"
        >
          <span class="game-emoji">{{ g.emoji }}</span>
          <span class="game-name">{{ g.name }}</span>
        </button>
      </div>

      <!-- Single game -->
      <template v-else>
        <Breadcrumbs :items="crumbs" />
        <GameHeroCard :game="currentGame" />
        <div class="game-stage surface">
          <GameHost
            :game-id="activeGameId"
            :current-user-id="authStore.user?.id || ''"
            :current-user-name="authStore.user?.display_name || 'Player'"
            :is-facilitator="isFacilitator"
          />
        </div>
      </template>
    </div>

    <ShareDialog
      v-if="board"
      :open="shareDialog"
      :url="`${origin}/play/${board.id}`"
      :title="board.name || 'this game room'"
      @close="shareDialog = false"
    />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import AppPage from '@/components/ui/AppPage.vue';
import { useRoute, useRouter } from 'vue-router';
import type { GameRoom } from '@/types';
import { gameRoomApi } from '@/services/api';
import websocketService from '@/services/websocket';
import { useAuthStore } from '@/stores/auth';
import GameHost from '@/components/games/GameHost.vue';
import GameHeroCard from '@/components/games/GameHeroCard.vue';
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue';
import ShareDialog from '@/components/ui/ShareDialog.vue';
import { GAMES, getGame } from '@/components/games/gamesCatalog';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const board = ref<GameRoom | null>(null);
const loading = ref(true);
const error = ref('');
const players = ref<{ id: string; display_name: string }[]>([]);
const shareDialog = ref(false);
const origin = typeof window !== 'undefined' ? window.location.origin : '';

const games = GAMES;
const activeGameId = computed(() => route.params.gameId as string | undefined);
const currentGame = computed(() => getGame(activeGameId.value));

const isFacilitator = computed(() =>
  !!board.value && board.value.facilitator_id === authStore.user?.id,
);

const crumbs = computed(() => [
  { label: 'Games', to: '/play' },
  { label: board.value?.name || 'Room', to: `/play/${route.params.id}` },
  { label: currentGame.value?.name || 'Game' },
]);

function handleInitial(msg: any) {
  if (msg?.board) board.value = msg.board;
  if (Array.isArray(msg?.users)) players.value = msg.users;
}

function handleUserConnected(user: any) {
  if (!user?.id) return;
  if (!players.value.some(p => p.id === user.id)) players.value.push(user);
}

function handleUserDisconnected(user: any) {
  if (!user?.id) return;
  players.value = players.value.filter(p => p.id !== user.id);
}

function selectGame(gameId: string | null) {
  const roomId = route.params.id as string;
  const path = gameId ? `/play/${roomId}/${gameId}` : `/play/${roomId}`;
  router.push(path);
  if (isFacilitator.value) {
    websocketService.send({ type: 'room_event', action: 'select_game', game_id: gameId });
  }
}

function onRoomEvent(msg: any) {
  if (msg?.action !== 'select_game') return;
  if (isFacilitator.value) return;
  const roomId = route.params.id as string;
  const path = msg.game_id ? `/play/${roomId}/${msg.game_id}` : `/play/${roomId}`;
  if (route.path !== path) router.push(path);
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }
  const id = route.params.id as string;
  try {
    const res = await gameRoomApi.getRoom(id);
    board.value = res.data;
    websocketService.connect(id, 'game-room');
    websocketService.on('initial_data', handleInitial);
    websocketService.on('user_connected', handleUserConnected);
    websocketService.on('user_disconnected', handleUserDisconnected);
    websocketService.on('room_event', onRoomEvent);
  } catch (e: any) {
    error.value = e?.response?.data?.detail || 'Game room not found.';
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  websocketService.off('initial_data', handleInitial);
  websocketService.off('user_connected', handleUserConnected);
  websocketService.off('user_disconnected', handleUserDisconnected);
  websocketService.off('room_event', onRoomEvent);
  websocketService.disconnect();
});
</script>

<style scoped>
.loading-state, .error-state {
  text-align: center;
  padding: 60px 20px;
  color: #475569;
}

.error-state h2 { margin-bottom: 8px; color: #0f172a; }
.error-state p { margin-bottom: 16px; }

.play-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.play-title {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.play-sub { color: #64748b; font-size: 0.95rem; }

.play-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

.players-pill {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 3px 6px;
  gap: -2px;
}

.player-dot {
  width: 28px;
  height: 28px;
  margin-left: -6px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 2px solid #fff;
  font-size: 0.8rem;
}

.player-dot.more { background: #475569; }

.game-picker {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.game-card {
  flex: 1 1 180px;
  border: none;
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: transform 0.15s ease;
  color: #0f172a;
  font-weight: 600;
  text-align: center;
  font-family: inherit;
}

.game-card:hover { transform: translateY(-2px); }

.game-emoji { font-size: 2rem; }
.game-name { font-size: 1rem; }

@media (max-width: 600px) {
  .play-title { font-size: 1.4rem; }
  .play-sub { font-size: 0.85rem; }
  .play-actions { width: 100%; }
  .play-actions .btn { flex: 1; }
  .game-picker { gap: 8px; }
  .game-card { flex: 1 1 140px; padding: 10px; }
  .game-emoji { font-size: 1.5rem; }
  .game-name { font-size: 0.9rem; }
  .player-dot { width: 24px; height: 24px; font-size: 0.7rem; }
}
</style>
