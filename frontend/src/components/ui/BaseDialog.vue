<template>
  <teleport to="body">
    <transition name="bd-fade">
      <div
        v-if="open"
        class="bd-overlay"
        :class="`bd-overlay--${mobile}`"
        @click.self="onBackdrop"
      >
        <transition :name="mobile === 'sheet' ? 'bd-sheet' : 'bd-pop'" appear>
          <div
            v-if="open"
            class="bd-panel"
            :class="[`bd-panel--${size}`, `bd-panel--${mobile}`]"
            role="dialog"
            aria-modal="true"
            :aria-label="title || undefined"
          >
            <div v-if="mobile === 'sheet'" class="bd-grabber" aria-hidden="true"></div>

            <header v-if="title || $slots.header || !hideClose" class="bd-header">
              <slot name="header">
                <h2 v-if="title" class="bd-title">{{ title }}</h2>
              </slot>
              <button
                v-if="!hideClose"
                type="button"
                class="bd-close"
                aria-label="Close"
                @click="close"
              >×</button>
            </header>

            <div class="bd-body">
              <slot />
            </div>

            <footer v-if="$slots.actions" class="bd-actions">
              <slot name="actions" />
            </footer>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    /** desktop width */
    size?: 'sm' | 'md' | 'lg';
    /** how it renders on small screens */
    mobile?: 'sheet' | 'dialog';
    /** when true, backdrop click / ESC do not close */
    persistent?: boolean;
    hideClose?: boolean;
  }>(),
  { size: 'md', mobile: 'sheet', persistent: false, hideClose: false }
);

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'close'): void;
}>();

function close() {
  emit('update:open', false);
  emit('close');
}

function onBackdrop() {
  if (!props.persistent) close();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open && !props.persistent) close();
}

watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) {
      window.addEventListener('keydown', onKeydown);
    } else {
      window.removeEventListener('keydown', onKeydown);
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  if (typeof document !== 'undefined') document.body.style.overflow = '';
});
</script>

<style scoped>
.bd-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.bd-panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 24px 60px -20px rgba(15, 23, 42, 0.35);
  width: 100%;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}
.bd-panel--sm { max-width: 380px; }
.bd-panel--md { max-width: 480px; }
.bd-panel--lg { max-width: 680px; }

.bd-grabber {
  /* Only meaningful as a bottom-sheet affordance - hidden on desktop dialogs. */
  display: none;
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: #cbd5e1;
  margin: 10px auto 2px;
  flex-shrink: 0;
}

.bd-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px 6px;
  flex-shrink: 0;
}
.bd-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.bd-close {
  background: none;
  border: none;
  font-size: 1.6rem;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
  padding: 0 4px;
  margin: -2px -4px 0 0;
  flex-shrink: 0;
}
.bd-close:hover { color: #475569; }

.bd-body {
  padding: 12px 22px 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.bd-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 22px 22px;
  flex-shrink: 0;
}

/* ---------- Mobile: bottom sheet ---------- */
@media (max-width: 640px) {
  .bd-panel--sheet .bd-grabber { display: block; }
  .bd-overlay--sheet {
    align-items: flex-end;
    padding: 0;
  }
  .bd-panel--sheet {
    max-width: none;
    border-radius: 20px 20px 0 0;
    max-height: 92vh;
    /* keep clear of the iOS/Android home indicator & browser bars */
    padding-bottom: var(--safe-bottom);
  }
  .bd-panel--sheet .bd-actions {
    /* stack so big finger targets, full width */
    flex-direction: column-reverse;
    padding-bottom: calc(22px + var(--safe-bottom));
  }
  .bd-panel--sheet .bd-actions > * {
    width: 100%;
  }

  /* dialog mode on mobile: still centered but comfortably sized */
  .bd-overlay--dialog { padding: 16px; }
  .bd-panel--dialog { max-width: 100%; }
}

/* ---------- Transitions ---------- */
.bd-fade-enter-active,
.bd-fade-leave-active { transition: opacity 0.2s ease; }
.bd-fade-enter-from,
.bd-fade-leave-to { opacity: 0; }

.bd-pop-enter-active,
.bd-pop-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.bd-pop-enter-from,
.bd-pop-leave-to { transform: translateY(8px) scale(0.98); opacity: 0; }

.bd-sheet-enter-active,
.bd-sheet-leave-active { transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease; }
.bd-sheet-enter-from,
.bd-sheet-leave-to { transform: translateY(8px) scale(0.98); opacity: 0; }

@media (max-width: 640px) {
  .bd-sheet-enter-from,
  .bd-sheet-leave-to { transform: translateY(100%); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .bd-pop-enter-active,
  .bd-pop-leave-active,
  .bd-sheet-enter-active,
  .bd-sheet-leave-active { transition: opacity 0.15s ease; }
  .bd-pop-enter-from,
  .bd-sheet-enter-from { transform: none; }
}
</style>
