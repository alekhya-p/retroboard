<template>
  <div
    class="board-column-card"
    :style="{ borderTop: `6px solid ${column.color}` }"
    @dragover.prevent
    @drop="onDrop"
  >
    <div class="column-header-row">
      <span v-if="column.icon" class="column-header-icon">{{ column.icon }}</span>
      <span class="column-header-name">{{ column.name }}</span>
      <span v-if="column.is_action_column" class="action-badge">Actions</span>
    </div>
    <div class="column-header-desc">
      <span
        ref="descSpan"
        :class="{ 'desc-ellipsis': !descExpanded }"
      >{{ column.description }}</span>
      <button v-if="descCanExpand" class="desc-toggle" @click="descExpanded = !descExpanded">
        {{ descExpanded ? 'Show less' : 'Show more' }}
      </button>
    </div>
    <div class="column-body">
      <div class="add-message-slot" v-if="messages.length != 0" style="margin-bottom: 14px; margin-top: 2px;">
        <slot name="add-message"></slot>
      </div>
      <div class="column-messages">
        <BoardMessage
          v-for="(msg, i) in messages"
          :key="msg.id"
          :ref="el => messageRefs[i] = el"
          :message="msg"
          :color="column.color + '44'"
          :isAction="isAction"
          :canEdit="canEdit"
          @dragstart="onDragStart(msg)"
          @dragend="$emit('dragend', msg)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
      <div class="add-message-slot" v-if="messages.length == 0">
        <slot name="add-message"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, defineExpose } from 'vue';
import BoardMessage from './BoardMessage.vue';
const emit = defineEmits(['dragstart', 'drop', 'dragend', 'edit', 'delete']);
const props = defineProps({
  column: Object,
  messages: Array,
  isAction: Boolean,
  canEdit: Boolean
});

function onDragStart(msg) {
  emit('dragstart', msg, props.column.id);
}
function onDrop(event) {
  emit('drop', event, props.column.id);
}
const descExpanded = ref(false);
const descCanExpand = ref(false);
const descSpan = ref(null);
function checkDescOverflow() {
  if (descSpan.value && !descExpanded.value) {
    descCanExpand.value = descSpan.value.scrollWidth > descSpan.value.clientWidth;
  }
}
onMounted(() => {
  nextTick(checkDescOverflow);
  window.addEventListener('resize', checkDescOverflow);
});
watch(() => props.column.description, () => nextTick(checkDescOverflow));
watch(descExpanded, (val) => {
  if (!val) nextTick(checkDescOverflow);
});
// Expose message card refs for height syncing
const messageRefs = ref([]);
defineExpose({ messageRefs });
</script>

<style scoped>
.board-column-card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-top: 6px solid #3b82f6;
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
  margin: 4px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}
.column-header-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 20px 20px 8px 20px;
  background: transparent;
}
.column-header-icon {
  font-size: 1.4em;
  margin-right: 4px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}
.column-header-name {
  font-size: 1.25em;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;
}
.action-badge {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.8em;
  font-weight: 600;
  margin-left: auto;
  box-shadow: 0 2px 4px rgba(37,99,235,0.2);
}
.column-header-desc {
  color: #475569;
  font-size: 0.95em;
  margin: 0 20px 12px 20px;
  max-width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.4;
}
.desc-ellipsis {
  display: inline-block;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.column-header-desc .desc-toggle {
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(255,255,255,0.8);
  border-radius: 4px;
  color: #3b82f6;
  font-size: 0.85em;
  font-weight: 500;
  margin-left: 8px;
  cursor: pointer;
  padding: 2px 6px;
  transition: all 0.2s;
}
.column-header-desc .desc-toggle:hover {
  background: white;
  transform: translateY(-1px);
}
.column-body {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0 0 16px 16px;
  padding: 12px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  min-height: 180px;
  flex: 1 1 auto;
  height: 100%;
}
.column-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
  flex: 1 1 auto;
  min-height: 40px;
}
.add-message-slot {
  padding-top: 14px;
  margin-top: 12px;
  flex-shrink: 0;
  transition: opacity 0.2s;
}
.add-message-slot:hover {
  opacity: 0.9;
}
@media (max-width: 900px) {
  .column-header-row {
    padding: 16px 12px 8px 12px;
  }
  .column-body {
    padding: 12px 12px 16px 12px;
  }
  .column-header-desc {
    margin: 0 12px 8px 12px;
  }
}
</style> 