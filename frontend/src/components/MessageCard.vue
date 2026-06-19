<template>
  <v-card class="message-card mb-2" :class="{ 'action-message': message.is_action }">
    <v-card-text>
      <div class="d-flex justify-space-between align-center">
        <div class="text-subtitle-2">{{ message.user_display_name }}</div>
        <div class="text-caption">{{ formatDate(message.created_at) }}</div>
      </div>
      <div class="mt-2">{{ message.text }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="canModify"
        icon="mdi-pencil"
        size="small"
        variant="text"
        @click="$emit('edit', message)"
      />
      <v-btn
        v-if="canModify"
        icon="mdi-delete"
        size="small"
        variant="text"
        color="error"
        @click="$emit('delete', message)"
      />
      <v-spacer />
      <v-btn
        v-if="board?.configurations.enable_likes && canLike"
        :icon="isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
        size="small"
        variant="text"
        :color="isLiked ? 'error' : undefined"
        @click="$emit('toggle-like', message)"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import type { Message, Board } from '@/types';
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{
  message: Message;
  board: Board | null;
}>();

const emit = defineEmits<{
  (e: 'edit', message: Message): void;
  (e: 'delete', message: Message): void;
  (e: 'toggle-like', message: Message): void;
}>();

const authStore = useAuthStore();

const canModify = computed(() => {
  if (!authStore.user) return false;
  return (
    authStore.user.id === props.message.user_id ||
    authStore.user.id === props.board?.facilitator_id
  );
});

const canLike = computed(() => {
  if (!authStore.user) return false;
  return authStore.user.user_type != "anonymous"
});

const isLiked = computed(() => {
  if (!authStore.user) return false;
  return props.message.likes.includes(authStore.user.id);
});

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy HH:mm');
};
</script>

<style scoped>
.message-card {
  transition: all 0.3s ease;
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-message {
  border-left: 4px solid var(--v-primary-base);
}
</style> 