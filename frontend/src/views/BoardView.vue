<template>
  <div style="min-height: 1200px; background-color: ghostwhite;">
    <AppPage variant="wide" class="board-page">
    <div class="board-view-root">
      
      <div class="board-header-row">
        <div class="board-header-main">
          <h1>{{ board?.name }}</h1>
          <div class="user-avatars-inline" v-if="uniqueUsers.length">
            <div
              v-for="(user, index) in uniqueUsers.slice(0, 4)"
              :key="user.id"
              class="avatar"
              :title="capitalize(user.display_name)"
            >
              {{ getInitials(user.display_name) }}
            </div>
            <div v-if="uniqueUsers.length > 4" class="avatar more">
              +{{ uniqueUsers.length - 4 }}
            </div>
          </div>
        </div>
        <div class="board-header-actions" v-if="canAddMessages">
          <button class="btn btn--secondary" :disabled="generatingIcebreaker" @click="generateIcebreaker">
            <span v-if="generatingIcebreaker">🎲 Thinking…</span>
            <span v-else>🎲 AI Icebreaker</span>
          </button>
          <button class="btn btn--primary" @click="openGames">
            🎮 Play Games
          </button>
          <button class="btn btn--outline" @click="exportActionItems">
            ⬇️ Export Actions
          </button>
          <button v-if="canModifyBoard" class="btn btn--primary" :disabled="generatingSummary" @click="generateSummary">
            <span v-if="generatingSummary">Generating...</span>
            <span v-else>✨ Generate Summary</span>
          </button>
          <button v-if="canModifyBoard" class="btn btn--outline" @click="showActionsSheet = true">
            ⚙️ Board Options
          </button>
        </div>
        <button v-if="canAddMessages" class="btn btn--primary btn--block board-actions-trigger" @click="showActionsSheet = true">
          ⚙️ Board actions
        </button>
        <div v-if="endTime && endTime > new Date()" class="board-timer">
            <span>⏰ {{ formattedTime }} </span>
        </div>
        <div class="board-desc">{{ board?.description }}</div>
      </div>

      <div v-if="board?.summary" class="ai-summary-block">
        <div class="ai-summary-header" @click="aiSummaryCollapsed = !aiSummaryCollapsed">
          <span class="ai-summary-title">✨ AI Summary</span>
          <button class="ai-summary-toggle">{{ aiSummaryCollapsed ? 'Show' : 'Hide' }}</button>
        </div>
        <div v-show="!aiSummaryCollapsed" class="ai-summary-content">
          <template v-for="(block, idx) in formattedSummary" :key="idx">
            <h3 v-if="block.type === 'heading' && block.level === 1" v-html="block.html"></h3>
            <h4 v-else-if="block.type === 'heading' && block.level === 2" v-html="block.html"></h4>
            <h5 v-else-if="block.type === 'heading'" v-html="block.html"></h5>
            <ul v-else-if="block.type === 'list'">
              <li v-for="(item, i) in block.items" :key="i" v-html="item"></li>
            </ul>
            <p v-else v-html="block.html"></p>
          </template>
        </div>
      </div>
    </div>


    <div v-if="loading" class="loading-block">Loading...</div>
    <div v-if="error && !loading" class="error-block">{{ error }}</div>

    

    <!-- Quick column switcher: jump straight to a column instead of scrolling
         past every message (especially useful on mobile where columns stack). -->
    <div v-if="!loading && !error && board && board.columns.length > 1" class="column-jump-nav">
      <span class="column-jump-label">Jump to</span>
      <button
        v-for="col in board.columns"
        :key="col.id"
        class="column-jump-chip"
        @click="scrollToColumn(col.id)"
      >
        <span class="column-jump-dot" :style="{ background: col.color }"></span>
        {{ col.name }}
      </button>
    </div>

    <div v-if="!loading && !error && board" class="container">
      <div class="row">
        <BoardColumn class="col-12 col-md-6 col-lg-4 col-xl-4" v-for="col in board.columns" :key="col.id"
          :id="'board-col-' + col.id"
          ref="boardColumnRefs" :column="col" :messages="messagesForColumn(col.id)" :isAction="col.is_action_column"
          :canEdit="canModifyBoard" @edit="editMessage" @delete="deleteMessage" @dragstart="onDragStart" @drop="onDrop">
          <template #add-message>
            <div v-if="canAddMessages" class="add-message-row">
              <input v-model="newMessages[col.id]" :placeholder="'Add a message'" @keyup.enter="addMessage(col.id)"
                class="add-message-input" />
              <button class="add-message-btn" :disabled="!newMessages[col.id] || !newMessages[col.id].trim()"
                @click="addMessage(col.id)">＋</button>
            </div>
            <div class="anonymous-toggle" v-if="canAddMessages">
              <input type="checkbox" :id="'anon-' + col.id" v-model="isAnonymous[col.id]">
              <label :for="'anon-' + col.id">Submit Anonymously</label>
            </div>
          </template>
        </BoardColumn>
      </div>
    </div>

    <!-- Share board (QR + link) -->
    <ShareDialog :open="shareDialog" :url="shareUrl" :title="board?.name || 'this board'" @close="shareDialog = false" />

    <!-- Mobile actions bottom sheet -->
    <BaseDialog :open="showActionsSheet" title="Board actions" size="md" mobile="sheet" @close="showActionsSheet = false">
      <div class="action-sheet">
        <button class="action-item" :disabled="generatingIcebreaker" @click="sheetDo(generateIcebreaker)">
          <span class="action-ic">🎲</span> AI Icebreaker
        </button>
        <button class="action-item" @click="sheetDo(openGames)">
          <span class="action-ic">🎮</span> Play Games
        </button>
        <button class="action-item" @click="sheetDo(exportActionItems)">
          <span class="action-ic">⬇️</span> Export Actions
        </button>
        <template v-if="canModifyBoard">
          <button class="action-item" :disabled="generatingSummary" @click="sheetDo(generateSummary)">
            <span class="action-ic">✨</span> Generate Summary
          </button>
          <button v-if="!endTime || endTime <= new Date()" class="action-item" @click="sheetDo(() => showTimerDialog = true)">
            <span class="action-ic">⏰</span> Start Timer
          </button>
          <button v-else class="action-item" @click="sheetDo(toggleTimer)">
            <span class="action-ic">⏰</span> Remove Timer
          </button>
          <button class="action-item" @click="sheetDo(shareBoard)">
            <span class="action-ic">🔗</span> Share Board
          </button>
          <button class="action-item" @click="sheetDo(editBoard)">
            <span class="action-ic">✏️</span> Edit Board
          </button>
          <button class="action-item" @click="sheetDo(toggleShowAllMessages)">
            <span class="action-ic">💬</span> {{ board?.configurations.show_all_messages ? 'Hide Messages' : 'Show All Messages' }}
          </button>
          <button class="action-item action-item--danger" @click="sheetDo(() => deleteDialog = true)">
            <span class="action-ic">🗑️</span> Delete Board
          </button>
        </template>
      </div>
    </BaseDialog>

    <!-- Delete Confirmation Dialog -->
    <BaseDialog :open="deleteDialog" title="Delete Board" size="sm" mobile="dialog" @close="deleteDialog = false">
      <p class="dialog-text">Are you sure you want to delete this board? This action cannot be undone.</p>
      <template #actions>
        <button class="btn btn--subtle" @click="deleteDialog = false">Cancel</button>
        <button class="btn btn--danger" @click="deleteBoard">Delete</button>
      </template>
    </BaseDialog>

    <!-- Edit Message Dialog -->
    <BaseDialog
      :open="editMessageDialog && !!selectedMessage"
      title="Edit Message"
      size="md"
      mobile="sheet"
      @close="editMessageDialog = false"
    >
      <textarea v-model="editMessageForm.text" class="edit-message-input" rows="3" />
      <select v-model="editMessageForm.column_id" class="edit-message-select">
        <option v-for="col in board?.columns" :key="col.id" :value="col.id">{{ col.name }}</option>
      </select>
      <template #actions>
        <button class="btn btn--subtle" @click="editMessageDialog = false">Cancel</button>
        <button class="btn btn--primary" @click="saveMessageEdit">Save</button>
      </template>
    </BaseDialog>

    <!-- Timer Dialog -->
    <BaseDialog :open="showTimerDialog" title="Set Timer" size="sm" mobile="dialog" @close="showTimerDialog = false">
      <label for="timerMinutes" class="dialog-label">Enter minutes</label>
      <input id="timerMinutes" type="number" v-model="timerMinutes" min="1" class="timer-input" />
      <template #actions>
        <button class="btn btn--subtle" @click="showTimerDialog = false">Cancel</button>
        <button class="btn btn--primary" @click="startTimer">Start</button>
      </template>
    </BaseDialog>

    <!-- Icebreaker Dialog -->
    <BaseDialog :open="icebreakerDialog" title="🎲 AI Icebreaker" size="md" mobile="dialog" @close="icebreakerDialog = false">
      <div v-if="generatingIcebreaker" class="icebreaker-loading">
        <span class="spinner"></span>
        <span>Coming up with a good one…</span>
      </div>
      <div v-else-if="icebreakerError" class="icebreaker-text">
        😕 Couldn't load an icebreaker. Please try again.
      </div>
      <div v-else class="icebreaker-text">{{ icebreakerText }}</div>
      <template #actions>
        <button class="btn btn--outline" :disabled="generatingIcebreaker" @click="generateIcebreaker">
          🔄 Another one
        </button>
        <button class="btn btn--primary" @click="icebreakerDialog = false">Close</button>
      </template>
    </BaseDialog>
    </AppPage>
  </div>


</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Message, Board } from '@/types';
import { useBoardStore } from '@/stores/board';
import { useAuthStore } from '@/stores/auth';
import BoardColumn from '@/components/BoardColumn.vue';
import AppPage from '@/components/ui/AppPage.vue';
import websocketService from '@/services/websocket';
import { boardApi } from '@/services/api';
import confetti from 'canvas-confetti';
import { parseMarkdown } from '@/utils/markdown';
import { useToast } from '@/composables/useToast';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import ShareDialog from '@/components/ui/ShareDialog.vue';

const toast = useToast();

const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();
const authStore = useAuthStore();

const deleteDialog = ref(false);
const editMessageDialog = ref(false);
const selectedMessage = ref<Message | null>(null);
const generatingSummary = ref(false);
const refreshInterval = ref<number | null>(null);
const aiSummaryCollapsed = ref(false);

function openGames() {
  if (board.value) router.push(`/boards/${board.value.id}/games`);
}
const generatingIcebreaker = ref(false);
const icebreakerDialog = ref(false);
const icebreakerText = ref('');
// Icebreakers shown this session so we don't repeat within the same session.
const usedIcebreakers = ref<string[]>([]);
const icebreakerError = ref(false);
const showActionsSheet = ref(false);

// Run a board action from the mobile actions bottom-sheet, closing it first.
function sheetDo(fn: () => void) {
  showActionsSheet.value = false;
  fn();
}

const board = ref<Board | null>(null);
const messages = ref<Message[] | null>([]);
const users = ref([]);
const newMessages = reactive<Record<string, string>>({});
const isAnonymous = reactive<Record<string, boolean>>({});

const endTime = ref<Date | null>(null);
const timerInterval = ref<number | null>(null);
const currentTime = ref(new Date());
const timerMinutes = ref<number>(1);
const showTimerDialog = ref(false);

function scrollToColumn(columnId: string) {
  const el = document.getElementById('board-col-' + columnId);
  if (!el) return;
  const header = document.querySelector('.app-header') as HTMLElement | null;
  const nav = document.querySelector('.column-jump-nav') as HTMLElement | null;
  const offset = (header?.offsetHeight || 0) + (nav?.offsetHeight || 0) + 12;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}

const editMessageForm = ref({
  text: '',
  column_id: ''
});


function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (
    parts[0].charAt(0).toUpperCase() +
    (parts[1]?.charAt(0)?.toUpperCase())
  );
}

function capitalize(name) {
  if (!name) return '';
  return name
    .split(' ') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const { loading, error } = boardStore;

const canModifyBoard = computed(() => {
  return authStore.isAuthenticated && authStore.user?.id === board.value?.facilitator_id;
});
const canAddMessages = computed(() => {
  return authStore.isAuthenticated;
});

const filteredMessages = computed(() => {
  if (!board.value) return [];
  if (board.value.configurations.show_all_messages || canModifyBoard.value) {
    return messages.value;
  }
  if (authStore.user) {
    return messages.value.filter(message =>
      message.user_id === authStore.user?.id ||
      message.user_display_name === authStore.user?.display_name
    );
  }
  return [];
});

function messagesForColumn(columnId) {
  return filteredMessages.value.filter(m => m.column_id === columnId);
}

// Render the AI summary through a small markdown parser so headings, bold,
// italic and lists actually format instead of leaking raw `*` and `#` characters.
const formattedSummary = computed(() => parseMarkdown(board.value?.summary || ''));


const uniqueUsers = computed(() => {
  const seen = new Set();
  return users.value.filter(user => {
    if (seen.has(user.id) || user.id === authStore.user?.id) {
      return false;
    }
    seen.add(user.id);
    return true;
  });
});

// Dynamically set grid columns based on number of columns
const gridStyle = computed(() => {
  const count = board.value?.columns?.length || 1;
  if (count <= 3) return { gridTemplateColumns: `repeat(${count}, 1fr)` };
  if (count <= 6) return { gridTemplateColumns: `repeat(3, 1fr)` };
  if (count <= 7) return { gridTemplateColumns: `repeat(3, 1fr)` };
  return { gridTemplateColumns: `repeat(4, 1fr)` };
});

const boardColumnRefs = ref([]);

function syncMessageHeights() {
  nextTick(() => {
    // Reset all heights first
    boardColumnRefs.value.forEach(col => {
      if (col && col.messageRefs) {
        col.messageRefs.forEach(msgEl => {
          if (msgEl && msgEl.$el) msgEl.$el.style.height = '';
        });
      }
    });
    // Find max messages in any column
    const maxMsgs = Math.max(...boardColumnRefs.value.map(col => col?.messageRefs?.length || 0));
    for (let i = 0; i < maxMsgs; i++) {
      // For each row of messages
      let maxHeight = 0;
      const msgEls = boardColumnRefs.value.map(col => col?.messageRefs?.[i]?.$el).filter(Boolean);
      msgEls.forEach(el => {
        el.style.height = '';
        maxHeight = Math.max(maxHeight, el.offsetHeight);
      });
      msgEls.forEach(el => {
        el.style.height = maxHeight + 'px';
      });
    }
  });
}

// Handler functions
function handleInitialData(data) {
  board.value = data.board;
  messages.value = data.messages;
  users.value = data.users;
}
function handleMessageCreated(data) {
  // Prevent duplicate messages by ID
  if (!messages.value.some(m => m.id === data.id)) {
    messages.value.push(data);
  }
}
function handleUserConnected(data) {
  users.value.push(data);
}
function handleUserDisconnected(data) {
  const idx = users.value.findIndex(u => u.id === data.id);
  if (idx !== -1) users.value.splice(idx, 1);
}
function handleMessageUpdated(data) {
  const index = messages.value.findIndex(m => m.id === data.id);
  if (index !== -1) {
    messages.value[index] = data;
  }
}
function handleMessageDeleted(data) {
  const index = messages.value.findIndex(m => m.id === data.id);
  if (index !== -1) {
    messages.value.splice(index, 1);
  }
}
function handleBoardUpdated(data) {
  Object.assign(board.value, data);
  if (board.value.configurations?.show_all_messages) {
    boardStore.fetchBoardMessages(board.value.id).then(() => {
      messages.value = boardStore.messages;
    });
  }
  if (board.value?.end_time) {
    endTime.value = new Date(board.value.end_time);
    startCountdown();
  }
}
function handleBoardDeleted() {
  router.push('/boards');
}

onMounted(async () => {
  const boardId = route.params.id as string;
  try {
    if (authStore.isAuthenticated) {
      await boardStore.fetchBoard(boardId);

      websocketService.connect(boardId);

      websocketService.on('initial_data', handleInitialData);
      websocketService.on('message_created', handleMessageCreated);
      websocketService.on('user_connected', handleUserConnected);
      websocketService.on('user_disconnected', handleUserDisconnected);
      websocketService.on('message_updated', handleMessageUpdated);
      websocketService.on('message_deleted', handleMessageDeleted);
      websocketService.on('board_updated', handleBoardUpdated);
      websocketService.on('board_deleted', handleBoardDeleted);

      if (board.value?.end_time) {
        endTime.value = new Date(board.value.end_time);
        startCountdown();
      }
    } else {
      router.push({ path: '/login', query: { redirect: route.fullPath } });
    }
  } catch (error) {
    console.error('Failed to fetch board:', error);
  }
  window.addEventListener('resize', syncMessageHeights);
});

onUnmounted(() => {
  if (refreshInterval.value) clearInterval(refreshInterval.value);
  if (timerInterval.value) clearInterval(timerInterval.value);

  // Unregister WebSocket handlers
  websocketService.off('initial_data', handleInitialData);
  websocketService.off('message_created', handleMessageCreated);
  websocketService.off('user_connected', handleUserConnected);
  websocketService.off('user_disconnected', handleUserDisconnected);
  websocketService.off('message_updated', handleMessageUpdated);
  websocketService.off('message_deleted', handleMessageDeleted);
  websocketService.off('board_updated', handleBoardUpdated);
  websocketService.off('board_deleted', handleBoardDeleted);

  websocketService.disconnect();
  window.removeEventListener('resize', syncMessageHeights);
});

watch([() => board.value?.columns, () => messages.value], () => syncMessageHeights());

async function addMessage(columnId) {
  if (!board.value || !authStore.isAuthenticated) return;
  const text = newMessages[columnId];
  if (!text || !text.trim()) return;
  
  const isAnon = isAnonymous[columnId];
  
  boardStore.createMessage({
    text: text.trim(),
    column_id: columnId,
    retro_id: board.value.id,
    user_id: isAnon ? null : (authStore.user?.id || null),
    user_display_name: isAnon ? 'Secret Agent' : (authStore.user?.display_name || 'Anonymous'),
    is_action: board.value.columns.find(c => c.id === columnId)?.is_action_column || false,
    is_anonymous: isAnon || false
  });
  
  newMessages[columnId] = '';
  
  // Gamification: Trigger confetti for "went well", "glad", or "success" columns
  const colName = board.value.columns.find(c => c.id === columnId)?.name.toLowerCase() || '';
  if (colName.includes('well') || colName.includes('glad') || colName.includes('success')) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

const shareDialog = ref(false);
const shareUrl = computed(() => `${window.location.origin}/boards/${board.value?.id}`);
const shareBoard = () => {
  shareDialog.value = true;
}


// Format the remaining time
const formattedTime = computed(() => {
  if (!endTime.value) return '00:00';
  const diff = Math.max(0, endTime.value.getTime() - currentTime.value.getTime());
  const minutes = Math.floor(diff / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});

// Start the countdown timer
function startCountdown() {
  if (timerInterval.value) clearInterval(timerInterval.value);
  timerInterval.value = setInterval(() => {
    currentTime.value = new Date();
    if (endTime.value && currentTime.value >= endTime.value) {
      clearInterval(timerInterval.value);
      endTime.value = null;
      toast.info('⏰ Time is up!');
    }
  }, 1000);
}

// Start the timer
function startTimer() {
  const now = new Date();
  endTime.value = new Date(now.getTime() + timerMinutes.value * 60000);
  if (!board.value) return;
  const updateData = {
    ...board.value,
    end_time: endTime.value.toISOString()
  };
  delete updateData.id;
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
  boardStore.updateBoard(board.value.id, updateData);
  startCountdown();
  showTimerDialog.value = false;
}

// Toggle the timer (remove if present, otherwise show)
function toggleTimer() {
  if (endTime.value) {
    clearInterval(timerInterval.value);
    endTime.value = new Date();
    const updateData = {
      ...board.value,
      end_time: endTime.value.toISOString()
    };
    delete updateData.id;
    boardStore.updateBoard(board.value.id, updateData);
  } else {
    showTimerDialog.value = true;
  }
}

function onDragStart(message, fromColumnId) {
  window._draggedMessage = { ...message, fromColumnId };
}
async function onDrop(event, toColumnId) {
  const dragged = window._draggedMessage;
  if (!dragged || dragged.column_id === toColumnId) return;
  boardStore.updateMessage(dragged.id, { ...dragged, column_id: toColumnId });
  //await boardStore.fetchBoardMessages(board.value.id);
  //messages.value = boardStore.messages;
  window._draggedMessage = null;
}

function editBoard() {
  router.push(`/boards/${board.value.id}/edit`);
}
function editMessage(message) {
  selectedMessage.value = message;
  editMessageForm.value = {
    text: message.text,
    column_id: message.column_id
  };
  editMessageDialog.value = true;
}

async function deleteMessage(message) {
  boardStore.deleteMessage(message.id)
  //await boardStore.fetchBoardMessages(board.value.id);
  //messages.value = boardStore.messages;
}

async function saveMessageEdit() {
  if (!selectedMessage.value) return;
  await boardStore.updateMessage(selectedMessage.value.id, {
    text: editMessageForm.value.text,
    column_id: editMessageForm.value.column_id
  });
  //await boardStore.fetchBoardMessages(board.value.id);
  //messages.value = boardStore.messages;
  editMessageDialog.value = false;
}
async function deleteBoard() {
  if (!board.value) return;
  await boardStore.deleteBoard(board.value.id);
  router.push('/boards');
}
async function generateSummary() {
  if (!board.value) return;
  generatingSummary.value = true;
  await boardStore.generateSummary(board.value.id);
  //await boardStore.fetchBoardById(board.value.id);
  //board.value = boardStore.currentBoard;
  generatingSummary.value = false;
}
async function toggleShowAllMessages() {
  if (!board.value) return;
  const updateData = {
    ...board.value,
    configurations: {
      ...board.value.configurations,
      show_all_messages: !board.value.configurations.show_all_messages
    }
  };
  delete updateData.id;
  await boardStore.updateBoard(board.value.id, updateData);
}

async function exportActionItems() {
  if (!board.value || !messages.value) return;
  
  let markdown = `# Action Items - ${board.value.name}\n\n`;
  const actionMsgs = messages.value.filter(m => m.is_action);
  
  if (actionMsgs.length === 0) {
    toast.info("No action items found on this board.");
    return;
  }
  
  actionMsgs.forEach(msg => {
    markdown += `- [ ] ${msg.text} (Created by: ${msg.user_display_name})\n`;
  });
  
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `retro-actions-${board.value.name.replace(/\s+/g, '-').toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

async function generateIcebreaker() {
  if (!board.value || generatingIcebreaker.value) return;
  // Open the dialog immediately so the user gets instant feedback while the
  // AI request is in flight, instead of a frozen-looking screen.
  generatingIcebreaker.value = true;
  icebreakerError.value = false;
  icebreakerDialog.value = true;
  try {
    const res = await boardApi.generateIcebreaker(board.value.id, usedIcebreakers.value);
    icebreakerText.value = res.data.icebreaker;
    if (res.data.icebreaker) usedIcebreakers.value.push(res.data.icebreaker);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.3 }
    });
  } catch (err) {
    console.error("Failed to get icebreaker:", err);
    icebreakerError.value = true;
  } finally {
    generatingIcebreaker.value = false;
  }
}
</script>

<style scoped>
/* Width + horizontal gutter are owned by the AppPage(wide) wrapper now. */
.board-view-root {
  margin-bottom: 8px;
}

.board-header-row {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 18px;
  flex-wrap: wrap;
  min-height: 56px;
}

.board-header-main {
  flex: 1 1 0%;
  min-width: 180px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.board-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* On phones, collapse the action row into a single button that opens a
   bottom sheet (see .board-actions-trigger + the actions BaseDialog). */
.board-actions-trigger {
  display: none;
}

.action-sheet {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  border-radius: 10px;
  padding: 14px 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
}
.action-item:hover { background: #f1f5f9; }
.action-item:disabled { opacity: 0.5; cursor: not-allowed; }
.action-item--danger { color: #e11d48; }
.action-ic { font-size: 1.2em; width: 1.6em; text-align: center; }

@media (max-width: 640px) {
  .board-header-actions { display: none; }
  .board-actions-trigger { display: inline-flex; }
}


.board-header-main h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 6px;
}

.user-avatars-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

.user-avatars-inline .avatar {
  width: 36px;
  height: 36px;
  font-size: 1rem;
  border-radius: 50%;
  background-color: #2563eb;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
}

.user-avatars-inline .avatar.more {
  background-color: #4b5563;
}

.user-avatars-inline .avatar::after {
  content: '';
  position: absolute;
  right: 1px;
  bottom: 1px;
  width: 6px;
  height: 6px;
  background: #22c55e;
  border: 2px solid #fff;
  border-radius: 50%;
  box-sizing: content-box;
  z-index: 2;
}

.board-desc {
  color: #444;
  font-size: 1.15rem;
  margin-bottom: 2px;
  max-width: 100%;
}

.column-jump-nav {
  position: sticky;
  top: 68px;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding: 10px 12px;
  margin: 0 0 14px 0;
  background: rgba(248, 250, 252, 0.94);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 12px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.column-jump-label {
  flex-shrink: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.column-jump-chip {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  color: #1e293b;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
}

.column-jump-chip:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.column-jump-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.board-timer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 1.8rem;
  font-weight: 700;
  justify-content: center;
}

.timer-input {
  width: 100%;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 1rem;
  margin-top: 10px;
}


.ai-summary-block {
  background: #ffffff;
  border: 1px solid #e6ebf5;
  border-radius: 16px;
  margin-bottom: 28px;
  box-shadow: 0 6px 24px -12px rgba(13, 63, 170, 0.18);
  max-width: 100%;
  overflow: hidden;
}

.ai-summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.06), rgba(124, 58, 237, 0.06));
  border-bottom: 1px solid #eef1f8;
}

.ai-summary-title {
  font-weight: 700;
  color: #2563eb;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
}

.ai-summary-toggle {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}

.ai-summary-toggle:hover {
  background: #c7d2fe;
}

.ai-summary-content {
  color: #334155;
  font-size: 0.98rem;
  padding: 18px 22px 20px 22px;
}

.ai-summary-content ul {
  margin: 8px 0 14px;
  padding: 0;
  list-style: none;
}

.ai-summary-content li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 7px;
  line-height: 1.5;
}
.ai-summary-content li::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 0.6em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
}

.ai-summary-content h3,
.ai-summary-content h4,
.ai-summary-content h5 {
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
  margin: 18px 0 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #eef1f8;
}
/* The first section heading shouldn't push a big gap at the top. */
.ai-summary-content > h3:first-child,
.ai-summary-content > h4:first-child,
.ai-summary-content > h5:first-child {
  margin-top: 0;
}

.ai-summary-content h3 { font-size: 1.12rem; }
.ai-summary-content h4 { font-size: 1.04rem; }
.ai-summary-content h5 { font-size: 0.98rem; }

.ai-summary-content p {
  margin: 0 0 10px 0;
  line-height: 1.6;
}

.ai-summary-content strong { color: #0f172a; }
.ai-summary-content code {
  background: #eef2ff;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.92em;
}

.loading-block,
.error-block {
  text-align: center;
  font-size: 1.2rem;
  margin: 32px 0;
}

.columns-grid {
  gap: 20px 16px;
}

.column-header-block {
  grid-column: 1 / -1;
  margin-bottom: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 8px;
}

.column-header-title {
  display: flex;
  align-items: center;
  font-size: 1.2em;
  font-weight: 700;
  color: #222;
  margin-bottom: 2px;
}

.column-header-icon {
  font-size: 1.3em;
  margin-right: 8px;
}

.column-header-name {
  font-weight: 700;
}

.column-header-desc {
  color: #666;
  font-size: 1.05em;
  margin-bottom: 2px;
}

.add-message-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 0 0;
}

.anonymous-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 0.85rem;
  color: #64748b;
}

.anonymous-toggle input[type="checkbox"] {
  accent-color: #3b82f6;
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.anonymous-toggle label {
  cursor: pointer;
  user-select: none;
}

.add-message-input {
  flex: 1;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}

.add-message-input:focus {
  border: 1.5px solid #2563eb;
}

.add-message-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.add-message-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.dialog-text {
  color: #334155;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.dialog-label {
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
}

.icebreaker-text {
  font-size: 1.15rem;
  line-height: 1.5;
  color: #1f2937;
}

.icebreaker-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  font-size: 1rem;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #e0e7ff;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.edit-message-input {
  width: 100%;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 1rem;
  margin-bottom: 10px;
}

.edit-message-select {
  width: 100%;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 1rem;
}

.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* This centers the columns as a group */
  /* REMOVE margin-right: -12px; margin-left: -12px; */
}

.col-12,
.col-md-6,
.col-lg-4,
.col-xl-4 {
  position: relative;
  width: 100%;
  /* Reduce or remove padding if you want tighter columns */
  padding-right: 8px;
  padding-left: 8px;
}

.col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

@media (min-width: 810px) {
  .col-md-6 {
    flex: 0 0 46%;
    max-width: 46%;
  }

  .modal {
    max-width: 90%;
  }
}

@media (min-width: 1300px) {
  .col-lg-4 {
    flex: 0 0 30%;
    max-width: 30%;
  }

  .modal {
    max-width: 30%;
  }
}

@media (min-width: 1700px) {
  .col-xl-4 {
    flex: 0 0 23%;
    max-width: 23%;
  }

  .modal {
    max-width: 23%;
  }
}

@media (min-width: 2300px) {
  .col-xl-4 {
    flex: 0 0 15%;
    max-width: 15%;
  }

  .modal {
    max-width: 15%;
  }
}

@media (max-width: 1200px) {
  .board-header-main {
    max-width: 100%;
  }

  .board-controls {
    min-width: auto;
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 900px) {
  .columns-grid {
    gap: 14px 0;
  }
  .fixed-menu-btn {
    top: 12px;
    right: 10px;
    padding: 8px 10px;
  }
}

@media (max-width: 600px) {
  .columns-grid {
    gap: 10px 0;
  }

  .board-header-main h1 {
    font-size: 1.5rem;
    margin-bottom: 2px;
  }

  .board-desc {
    font-size: 0.98rem;
  }

  .board-header-actions .btn {
    flex: 1 1 auto;
  }

  .board-timer {
    font-size: 1.4rem;
  }

  .icebreaker-text {
    font-size: 1.05rem;
  }
}

/* Menu Button Styles */
.menu-btn {
  position: relative;
  background: none;
  border: none;
  font-size: 1.5rem;
  padding: 8px;
  cursor: pointer;
  color: #2563eb;
  transition: color 0.2s;
  outline: none;
}

.menu-btn:hover {
  color: #1d4ed8;
}

.fixed-menu-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 1001;
  box-shadow: none;
  background: #fff;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  padding: 8px 12px;
  display: flex;
  align-items: center;
}

.menu-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background-color: #e11d48;
  border-radius: 50%;
}

</style>