<template>
  <AppPage variant="marketing" class="lobby-root">
    <div class="lobby-hero">
      <div class="hero-emoji">🎮</div>
      <h1>Team Games</h1>
      <p class="hero-sub">
        Standalone mini-games for remote, offshore, and onshore teams. Spin up a room,
        share the link, and play together - no retro required.
      </p>
    </div>

    <div v-if="!isAccount" class="lobby-note">
      ✨ <strong>Create a free account</strong> and we'll save the game rooms you create and remember your
      play history - so trivia questions and doodle prompts don't repeat on you.
      <router-link to="/login">Sign up free →</router-link>
    </div>

    <div class="lobby-card surface">
      <h2>Start a new room</h2>
      <p class="muted">Anyone with the link can join. The first room you create makes you the host.</p>
      <input
        v-model="roomName"
        class="lobby-input"
        placeholder="Room name (e.g. Friday Fun Hour)"
        maxlength="80"
        @keyup.enter="createRoom"
      />
      <button class="btn btn--secondary lobby-action" :disabled="busy" @click="createRoom">
        {{ busy ? 'Creating…' : '🚀 Create Game Room' }}
      </button>
      <div v-if="errorMsg" class="error-text">{{ errorMsg }}</div>
    </div>

    <div class="lobby-card surface">
      <h2>Join with a link</h2>
      <p class="muted">Paste an invite link or a room ID someone shared with you.</p>
      <input
        v-model="joinValue"
        class="lobby-input"
        placeholder="https://.../play/abc123 or just the room id"
        @keyup.enter="joinRoom"
      />
      <button class="btn btn--outline lobby-action" :disabled="!parsedJoinId" @click="joinRoom">
        Join Room
      </button>
    </div>

    <div v-if="isAccount" class="lobby-card surface">
      <div class="rooms-head">
        <h2>Your game rooms</h2>
        <button class="rooms-refresh" :disabled="roomsLoading" @click="loadRooms" title="Refresh">↻</button>
      </div>
      <p v-if="roomsLoading" class="muted">Loading your rooms…</p>
      <p v-else-if="!myRooms.length" class="muted">
        No rooms yet. Create one above - it'll show up here so you never lose the link.
      </p>
      <ul v-else class="rooms-list">
        <li v-for="room in myRooms" :key="room.id" class="room-row">
          <button class="room-open" @click="openRoom(room.id)">
            <span class="room-name">{{ room.name || 'Untitled room' }}</span>
            <span class="room-meta">{{ formatDate(room.created_at) }}</span>
          </button>
          <div class="room-actions">
            <button class="room-btn" @click="copyRoomLink(room.id)" title="Copy invite link">🔗</button>
            <button class="room-btn room-btn--danger" @click="removeRoom(room)" title="Delete room">🗑</button>
          </div>
        </li>
      </ul>
    </div>

    <div class="lobby-games">
      <div class="game-pill" v-for="g in games" :key="g.name" :style="{ background: g.bg }">
        <span class="emoji">{{ g.emoji }}</span>
        <div>
          <div class="pill-name">{{ g.name }}</div>
          <div class="pill-desc">{{ g.desc }}</div>
        </div>
      </div>
    </div>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppPage from '@/components/ui/AppPage.vue';
import { gameRoomApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import type { GameRoom } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// A real (non-guest) account unlocks saved rooms + non-repeating game content.
const isAccount = computed(
  () => authStore.isAuthenticated && authStore.user?.user_type !== 'anonymous'
);

const myRooms = ref<GameRoom[]>([]);
const roomsLoading = ref(false);

async function loadRooms() {
  if (!isAccount.value) return;
  roomsLoading.value = true;
  try {
    const res = await gameRoomApi.getRooms();
    myRooms.value = res.data || [];
  } catch (e) {
    console.error('Failed to load your game rooms', e);
  } finally {
    roomsLoading.value = false;
  }
}

function openRoom(id: string) {
  router.push(`/play/${id}`);
}

async function copyRoomLink(id: string) {
  const url = `${window.location.origin}/play/${id}`;
  try {
    await navigator.clipboard?.writeText(url);
    toast.success('Invite link copied');
  } catch {
    toast.info(url);
  }
}

async function removeRoom(room: GameRoom) {
  try {
    await gameRoomApi.deleteRoom(room.id);
    myRooms.value = myRooms.value.filter(r => r.id !== room.id);
    toast.success('Room deleted');
  } catch (e: any) {
    toast.error(e?.response?.data?.detail || 'Could not delete the room.');
  }
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

onMounted(loadRooms);

const roomName = ref('');
const joinValue = ref('');
const busy = ref(false);
const errorMsg = ref('');

const games = [
  { name: 'Meeting Roulette', emoji: '🎰', desc: 'Random 1:1 pairings with AI icebreakers - great for new joiners.', bg: '#e0f2fe' },
  { name: 'Doodle Quest', emoji: '🎨', desc: 'Draw an AI word, others guess.', bg: '#fef3c7' },
  { name: 'Trivia Race', emoji: '🧠', desc: 'AI-generated team trivia.', bg: '#dbeafe' },
  { name: 'Emoji Tales', emoji: '😄', desc: 'Tell stories in emojis only.', bg: '#fce7f3' },
  { name: 'Two Truths & a Lie', emoji: '🤥', desc: 'Spot the lie - AI helps if you\'re stuck.', bg: '#dcfce7' },
];

const parsedJoinId = computed(() => {
  const v = joinValue.value.trim();
  if (!v) return '';
  const match = /\/play\/([^/?#]+)/.exec(v);
  if (match) return match[1];
  // Accept a bare id if there are no slashes
  if (!v.includes('/')) return v;
  return '';
});

async function createRoom() {
  if (busy.value) return;
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: '/play' } });
    return;
  }
  busy.value = true;
  errorMsg.value = '';
  try {
    const name = roomName.value.trim() || 'Game Room';
    const res = await gameRoomApi.createRoom({
      name,
      description: 'Standalone game room',
    });
    const id = res.data.id;
    router.push(`/play/${id}`);
  } catch (e: any) {
    console.error(e);
    errorMsg.value = e?.response?.data?.detail || 'Could not create the room. Please sign in and try again.';
  } finally {
    busy.value = false;
  }
}

function joinRoom() {
  const id = parsedJoinId.value;
  if (!id) return;
  router.push(`/play/${id}`);
}
</script>

<style scoped>
.lobby-root {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.lobby-hero { text-align: center; padding: 14px 0; }
.hero-emoji { font-size: 3rem; margin-bottom: 6px; }
.lobby-hero h1 {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 6px;
}
.hero-sub { color: #475569; font-size: 1rem; max-width: 540px; margin: 0 auto; }

.lobby-note {
  background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(236,72,153,0.08));
  border: 1px solid rgba(99,102,241,0.18);
  border-radius: 14px;
  padding: 14px 18px;
  margin: 0 auto 18px;
  max-width: 560px;
  color: #334155;
  font-size: 0.92rem;
  line-height: 1.5;
  text-align: center;
}
.lobby-note a { color: #4f46e5; font-weight: 600; text-decoration: none; white-space: nowrap; }
.lobby-note a:hover { color: #a855f7; }

.rooms-head { display: flex; align-items: center; justify-content: space-between; }
.rooms-refresh {
  background: none; border: none; cursor: pointer; font-size: 1.1rem; color: #6366f1;
  border-radius: 8px; padding: 2px 8px;
}
.rooms-refresh:hover { background: rgba(99,102,241,0.1); }
.rooms-list { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.room-row {
  display: flex; align-items: center; gap: 8px;
  border: 1px solid rgba(15,23,42,0.08); border-radius: 12px; padding: 8px 10px 8px 14px;
  background: #fff;
}
.room-open {
  flex: 1; text-align: left; background: none; border: none; cursor: pointer; padding: 4px 0;
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
}
.room-name { font-weight: 600; color: #0f172a; font-size: 0.98rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.room-meta { font-size: 0.78rem; color: #94a3b8; }
.room-actions { display: flex; gap: 4px; flex-shrink: 0; }
.room-btn {
  background: none; border: none; cursor: pointer; font-size: 1rem; padding: 6px 8px; border-radius: 8px;
}
.room-btn:hover { background: rgba(15,23,42,0.06); }
.room-btn--danger:hover { background: rgba(225,29,72,0.1); }

.lobby-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lobby-card h2 { font-size: 1.15rem; }

.muted { color: #64748b; font-size: 0.92rem; }

.lobby-input {
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1rem;
}

.lobby-action { align-self: flex-start; }

.error-text { color: #b91c1c; font-size: 0.9rem; }

.lobby-games { display: flex; flex-direction: column; gap: 10px; }
.game-pill {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 12px;
}
.emoji { font-size: 1.8rem; }
.pill-name { font-weight: 700; }
.pill-desc { color: #475569; font-size: 0.92rem; }

@media (max-width: 600px) {
  .lobby-root { gap: 16px; }
  .lobby-hero h1 { font-size: 1.6rem; }
  .hero-emoji { font-size: 2.4rem; }
  .hero-sub { font-size: 0.92rem; }
  .lobby-card h2 { font-size: 1.05rem; }
  .lobby-action { align-self: stretch; width: 100%; }
  .game-pill { padding: 10px 12px; gap: 10px; }
  .emoji { font-size: 1.5rem; }
}
</style>
