<template>
  <AppPage variant="app">
    <div class="boards-header">
      <h1>My Retro Boards</h1>
      <div class="boards-header-actions">
        <button
          v-if="authStore.user && authStore.user?.user_type != 'anonymous'"
          class="ai-btn-highlight"
          @click="showAiDialog = true"
        >
          <span class="ai-btn-icon">✨</span> AI Generate Template
        </button>
        <button class="btn btn--primary" @click="router.push('/boards/create')">
          <span class="btn-icon">＋</span> Create New Board
        </button>
        <button class="btn btn--outline" @click="router.push('/boards/templates')">
          <span class="btn-icon">📋</span> Browse Templates
        </button>
      </div>
    </div>

    <!-- <div v-if="loading" class="boards-loading">
      <div class="loader"></div>
    </div> -->

    <div v-if="error" class="boards-error">
      <div class="error-alert">{{ error }}</div>
    </div>

    <div>
      <div v-if="!boards || boards.length === 0" class="boards-empty">
        <div class="surface empty-card">
          <h2>No Boards Yet</h2>
          <p>Create your first retro board to get started!</p>
          <!-- <div class="empty-actions">
            <button class="primary-btn" @click="router.push('/boards/create')">Create Board</button>
            <button class="primary-btn outline" @click="router.push('/boards/templates')">Browse Templates</button>
          </div> -->
        </div>
      </div>

      <template v-else v-for="[blockId, blockBoards] in boardsByBlock" :key="blockId">
        <div class="block-section">
          <h2 class="block-title">
            {{ blockId?.startsWith('msal_') || blockId?.startsWith('google_') || blockId === authStore.user?.id ? 'Self' : (blockId || 'Unassigned Boards') }}
          </h2>
          <div class="boards-grid">
            <div
              v-for="board in blockBoards"
              :key="board.id"
              class="board-card"
              @click="router.push(`/boards/${board.id}`)"
            >
              <div class="board-card-header">
                <h3 class="board-card-title">{{ board.name }}</h3>
                <div class="board-card-actions" v-if="canModifyBoard(board)">
                  <button class="icon-btn" @click.stop="editBoard(board)" title="Edit"><span>✏️</span></button>
                  <button class="icon-btn danger" @click.stop="confirmDelete(board)" title="Delete"><span>🗑️</span></button>
                </div>
              </div>
              <div class="board-card-desc">{{ board.description }}</div>
              <div class="board-card-meta">
                Created {{ formatDate(board.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Delete Confirmation Dialog -->
    <BaseDialog
      :open="deleteDialog"
      title="Delete Board"
      size="sm"
      mobile="dialog"
      @close="deleteDialog = false"
    >
      <p class="dialog-text">Are you sure you want to delete this board? This action cannot be undone.</p>
      <template #actions>
        <button class="btn btn--subtle" @click="deleteDialog = false">Cancel</button>
        <button class="btn btn--danger" @click="deleteBoard">Delete</button>
      </template>
    </BaseDialog>

    <!-- AI Template Generation Dialog -->
    <BaseDialog
      :open="showAiDialog"
      title="Generate AI Template"
      size="md"
      mobile="sheet"
      :persistent="generatingTemplate"
      @close="showAiDialog = false"
    >
      <div class="ai-modal-subtitle">What's on your mind? How would you like to create your template?</div>
      <textarea
        class="ai-modal-textarea"
        v-model="aiPrompt"
        placeholder="Your Prompt"
        rows="4"
        required
      ></textarea>
      <template #actions>
        <button class="btn btn--subtle" @click="showAiDialog = false" :disabled="generatingTemplate">Cancel</button>
        <button
          class="btn btn--primary"
          :disabled="!aiPrompt || generatingTemplate"
          @click="generateAiTemplate"
        >
          <span v-if="generatingTemplate">Thinking...</span>
          <span v-else>Generate Template</span>
        </button>
      </template>
    </BaseDialog>

    <!-- Template Details Dialog -->
    <BaseDialog
      :open="showDetails"
      :title="selectedTemplate?.name"
      size="lg"
      mobile="sheet"
      @close="showDetails = false"
    >
      <div class="modal-desc">{{ selectedTemplate?.description }}</div>
      <div class="modal-columns-list">
        <div v-for="column in selectedTemplate?.columns" :key="column.name" class="modal-column-row">
          <div class="modal-column-icon" :style="{ background: (column.color || '#2563eb') + '22', borderColor: column.color || '#2563eb' }">
            <span>{{ column.icon }}</span>
          </div>
          <div class="modal-column-content">
            <div class="modal-column-name">{{ column.name }}</div>
            <div class="modal-column-desc">{{ column.description }}</div>
          </div>
        </div>
      </div>
      <form id="template-details-form" @submit.prevent="createBoard" class="modal-form">
        <input
          v-model="boardName"
          type="text"
          placeholder="Board Name"
          required
        />
        <select
          v-if="showBlockId"
          v-model="blockId"
          required
        >
          <option value="" disabled>Select a group</option>
          <option v-for="group in userGroups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
      </form>
      <template #actions>
        <button type="button" class="btn btn--subtle" @click="showDetails = false">Cancel</button>
        <button type="submit" form="template-details-form" class="btn btn--primary" :disabled="loading">
          <span v-if="loading">Creating..</span>
          <span v-else>Create Board</span>
        </button>
      </template>
    </BaseDialog>
  </AppPage>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { format } from 'date-fns';
import type { Board } from '@/types';
import { useBoardStore } from '@/stores/board';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { aiApi } from '@/services/api';
import templates from '@/templates.json';
import { useToast } from '@/composables/useToast';
import { aiErrorMessage } from '@/utils/aiError';
import AppPage from '@/components/ui/AppPage.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';

const toast = useToast();
const boardStore = useBoardStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const deleteDialog = ref(false);
const selectedBoard = ref<Board | null>(null);
const boards = ref<Board[] | null>([]);
const { loading, error } = boardStore;

const showAiDialog = ref(false);
const aiPrompt = ref('');
const generatingTemplate = ref(false);
const showDetails = ref(false);
const selectedTemplate = ref<any>(null);
const boardName = ref('');
const blockId = ref('');

// Group boards by block_id
const boardsByBlock = computed(() => {
  const groupedBoards = new Map<string, Board[]>();
  if (boards.value) {
    boards.value.forEach(board => {
      const block_id = board.block_id || 'Unassigned';
      if (!groupedBoards.has(block_id)) {
        groupedBoards.set(block_id, []);
      }
      groupedBoards.get(block_id)?.push(board);
    });
    // Sort each group of boards by creation date (newest first)
    for (const [block_id, boardList] of groupedBoards.entries()) {
      groupedBoards.set(
        block_id, 
        boardList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      );
    }
  }
  return groupedBoards;
});

const fetchBoardsData = async () => {
  try {
    await authStore.initializeAuth();
    if (authStore.isAuthenticated) {
      if (!boards.value) boards.value = [];
      await boardStore.fetchBoards();
      boards.value = boardStore.boards;
    } else {
      router.push({
        path: '/login',
        query: { redirect: route.fullPath }
      });
    }
  } catch (error) {
    console.error('Failed to initialize auth or fetch boards:', error);
  }
};

watch(() => route.path, async (newPath) => {
  if (newPath === '/boards') {
    await fetchBoardsData();
  }
}, { immediate: true });

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy');
};

const canModifyBoard = (board: Board) => {
  return authStore.user?.id === board.facilitator_id;
};

const editBoard = (board: Board) => {
  router.push(`/boards/${board.id}/edit`);
};

const confirmDelete = (board: Board) => {
  selectedBoard.value = board;
  deleteDialog.value = true;
};

const deleteBoard = async () => {
  if (!selectedBoard.value) return;
  try {
    await boardStore.deleteBoard(selectedBoard.value.id);
    await fetchBoardsData();
    deleteDialog.value = false;
  } catch (error) {
    console.error('Failed to delete board:', error);
  }
};

function onAiTemplateGenerated(template: any) {
  // You can either open a modal, or navigate to the board creation page with the template
  // For now, let's navigate to the create page and pass the template as a query param (or use a store)
  router.push({ path: '/boards/create', query: { aiTemplate: JSON.stringify(template) } });
}

const canUserCreateBoard = computed(() => {
  return authStore.user && authStore.user?.user_type != 'anonymous';
});

const showBlockId = computed(() => {
  return authStore.user?.user_type === 'microsoft' && authStore.user?.groups?.length > 1;
});

const userGroups = computed(() => {
  if (authStore.user?.user_type === 'microsoft') {
    return authStore.user.groups || [];
  }
  return [];
});

const selectTemplate = (template: any) => {
  selectedTemplate.value = template;
  boardName.value = '';
  showDetails.value = true;
};

watch(() => authStore.user?.user_type, (newType) => {
  if (newType === 'google') {
    blockId.value = authStore.user?.id || '';
  }
  if (newType === 'email') {
    blockId.value = authStore.user?.id || '';
  }
  if (newType === 'microsoft') {
    if(authStore.user?.groups?.length){
      blockId.value = authStore.user.groups[0] || '';
    } else {
      blockId.value = authStore.user?.id
    }
  }
}, { immediate: true });

const createBoard = async () => {
  if (!boardName.value) return;
  try {
    const board = await boardStore.createBoard({
      name: boardName.value,
      description: selectedTemplate.value.description,
      block_id: blockId.value,
      columns: selectedTemplate.value.columns.map((column: any) => ({
        name: column.name,
        color: column.color,
        description: column.description,
        is_action_column: column.is_action_column
      }))
    });
    router.push(`/boards/${board.id}`);
  } catch (error) {
    toast.error('Failed to create board. Please try again.');
  } finally {
    showDetails.value = false;
  }
};

const generateAiTemplate = async () => {
  if (!aiPrompt.value) return;
  try {
    generatingTemplate.value = true;
    const response = await aiApi.generateTemplate(aiPrompt.value);
    selectedTemplate.value = response.data;
    showAiDialog.value = false;
    showDetails.value = true;
    aiPrompt.value = '';
  } catch (error) {
    toast.error(aiErrorMessage(error));
  } finally {
    generatingTemplate.value = false;
  }
};
</script>
<style scoped>
.boards-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.boards-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
}
.boards-header-actions {
  display: flex;
  gap: 1rem;
}
.btn-icon {
  font-size: 1.2em;
}
.boards-loading, .boards-error, .boards-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
.loader {
  border: 4px solid #eee;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.error-alert {
  color: #e11d48;
  background: #fef2f2;
  border-radius: 8px;
  padding: 18px 24px;
  font-size: 1.1rem;
}
.empty-card {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}
.empty-card h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 18px;
}
.block-section {
  margin-bottom: 36px;
}
.block-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 18px;
}
.boards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.board-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.04);
  padding: clamp(16px, 4vw, 20px);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.18s;
  min-height: 180px;
  position: relative;
}
.board-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 6px 24px 0 rgba(37,99,235,0.10);
}
.board-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.board-card-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0;
  flex: 1;
  word-break: break-word;
}
.board-card-actions {
  display: flex;
  gap: 6px;
}
.icon-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.1em;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.2s;
}
.icon-btn:hover {
  background: #f3f4f6;
}
.icon-btn.danger:hover {
  background: #fee2e2;
  color: #e11d48;
}
.board-card-desc {
  color: #444;
  font-size: 1rem;
  margin: 10px 0 8px 0;
  flex: 1;
  word-break: break-word;
}
.board-card-meta {
  color: #888;
  font-size: 0.95em;
  margin-top: 4px;
}
.dialog-text {
  color: #444;
  margin: 0;
}
@media (max-width: 1100px) {
  .boards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 700px) {
  .boards-grid {
    grid-template-columns: 1fr;
  }
  .boards-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
.ai-btn-highlight {
  background: linear-gradient(135deg, #FF69B4, #FF8C00);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 16px -4px rgba(255, 105, 180, 0.3);
}

.ai-btn-highlight::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.2) 80%,
    transparent 100%);
  animation: shine-effect 2s infinite;
  transform: translateX(-100%);
  pointer-events: none;
}

@keyframes shine-effect {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.ai-btn-highlight:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px -4px rgba(255, 105, 180, 0.4);
}

.ai-btn-highlight:active {
  transform: translateY(0);
  box-shadow: 0 5px 10px -4px rgba(255, 105, 180, 0.3);
}

.ai-btn-icon {
  font-size: 1.2em;
  animation: sparkle 1.5s infinite;
  position: relative;
  z-index: 1;
}

@keyframes sparkle {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.2) rotate(-5deg); }
  50% { transform: scale(1) rotate(0deg); }
  75% { transform: scale(1.2) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}
.board-card-title {
  font-size: 1.18rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 6px;
}
.ai-modal-subtitle {
  color: #444;
  font-size: 1.05rem;
  margin-bottom: 16px;
}
.ai-modal-textarea {
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  outline: none;
  margin-bottom: 0;
  resize: vertical;
  min-height: 80px;
  transition: border 0.2s;
  background: #fafbfc;
  width: 100%;
  box-sizing: border-box;
}
.ai-modal-textarea:focus {
  border: 1.5px solid #2563eb;
  background: #fff;
}
.modal-desc {
  color: #444;
  font-size: 1.05rem;
  margin-bottom: 18px;
  margin-top: 2px;
}
.modal-columns-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}
.modal-column-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.modal-column-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  border: 2px solid;
  margin-top: 2px;
  flex-shrink: 0;
}
.modal-column-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.modal-column-name {
  font-weight: 600;
  color: #222;
  font-size: 1.05em;
}
.modal-column-desc {
  color: #666;
  font-size: 0.98em;
  margin-bottom: 0;
}
.modal-form input, .modal-form select {
  margin-bottom: 14px;
  padding: 10px;
  border-radius: 8px;
  border: 1.5px solid #ddd;
  font-size: 1rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}
.modal-form input:focus, .modal-form select:focus {
  border: 1.5px solid #2563eb;
}
.modal-form input:last-child, .modal-form select:last-child {
  margin-bottom: 0;
}
@media (max-width: 600px) {
  .modal-columns-list {
    gap: 8px;
  }
  .boards-header-actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  .boards-header-actions button {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
  body, html, #app, .main-content {
    overflow-x: hidden !important;
  }
}
</style>