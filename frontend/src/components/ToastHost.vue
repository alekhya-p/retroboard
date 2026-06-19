<template>
  <div class="toast-host" aria-live="polite" aria-atomic="true">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="`toast-${toast.type}`"
        @click="dismiss(toast.id)"
      >
        <span class="toast-icon">
          {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'ℹ' }}
        </span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts, dismiss } = useToast();
</script>

<style scoped>
.toast-host {
  position: fixed;
  top: 84px;
  right: 16px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  max-width: min(360px, calc(100vw - 32px));
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff;
  color: #1e293b;
  box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.28);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-left: 4px solid #64748b;
  font-size: 0.95rem;
  line-height: 1.4;
  cursor: pointer;
}

.toast-success { border-left-color: #16a34a; }
.toast-error { border-left-color: #e11d48; }
.toast-info { border-left-color: #2563eb; }

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  background: #64748b;
}
.toast-success .toast-icon { background: #16a34a; }
.toast-error .toast-icon { background: #e11d48; }
.toast-info .toast-icon { background: #2563eb; }

.toast-message { flex: 1; }

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 600px) {
  .toast-host {
    top: auto;
    bottom: 16px;
    left: 16px;
    right: 16px;
    max-width: none;
  }
}
</style>
