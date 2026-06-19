<template>
  <div
    class="board-message"
    :class="{ 'action-message': isAction }"
    :style="{ backgroundColor: color }"
    draggable="true"
    @dragstart="$emit('dragstart', message)"
    @dragend="$emit('dragend', message)"
  >
    <div class="message-header">
      <div class="message-text">{{ message.text }}</div>
      <div v-if="authStore.user?.id == message.user_id || canEdit" class="message-actions">
        <button class="msg-btn edit" @click="$emit('edit', message)" title="Edit"><span>✏️</span></button>
        <button class="msg-btn delete" @click="$emit('delete', message)" title="Delete"><span>🗑️</span></button>
      </div>
    </div>
    <div class="message-footer">
      <span class="author-avatar">{{ initials }}</span>
      <!-- <span class="author-name">{{ message.user_display_name }}</span> -->
      <!-- <span v-if="isAction" class="action-badge">Action</span> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const props = defineProps({
  message: Object,
  color: String,
  isAction: Boolean,
  canEdit: Boolean
});
const initials = computed(() => {
  if (!props.message?.user_display_name) return '';
  return props.message.user_display_name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();
});
</script>
<style scoped>
.board-message {
  margin: 12px 0;
  padding: 16px 18px 10px 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 1.08rem;
  color: #1e293b;
  position: relative;
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.board-message:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
}
.board-message:active {
  cursor: grabbing;
  transform: translateY(-1px) scale(1.01);
}
.board-message.action-message {
  border-left: 4px solid #3b82f6;
  background: rgba(240, 247, 255, 0.8);
}
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.message-text {
  flex: 1;
  word-break: break-word;
  font-size: 0.95em;
  line-height: 1.4;
  color: #334155;
}
.message-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.board-message:hover .message-actions {
  opacity: 1;
}
.msg-btn {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid transparent;
  color: #64748b;
  font-size: 0.8em;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.msg-btn:hover {
  background: white;
  border-color: #e2e8f0;
  transform: scale(1.1);
}
.msg-btn.edit:hover {
  color: #3b82f6;
}
.msg-btn.delete:hover {
  color: #ef4444;
}
.message-footer {
  display: flex;
  align-items: center;
  margin-top: 12px;
  font-size: 0.97em;
  gap: 8px;
}
.author-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #3730a3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75em;
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.5);
}
</style> 