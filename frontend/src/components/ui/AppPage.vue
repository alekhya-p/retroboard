<template>
  <div class="app-page" :class="[`app-page--${variant}`, { 'app-page--flush-top': flushTop }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * The single page layout wrapper. Owns the responsive horizontal gutter and
 * the content max-width so individual pages stop inventing their own padding
 * (the cause of inconsistent / doubled spacing on mobile).
 *
 *  - app:       standard logged-in tool pages (boards, board, play)
 *  - marketing: wider marketing / content pages
 *  - narrow:    focused forms (create/edit board)
 */
withDefaults(
  defineProps<{
    variant?: 'app' | 'marketing' | 'narrow' | 'wide';
    flushTop?: boolean;
  }>(),
  { variant: 'app', flushTop: false }
);
</script>

<style scoped>
.app-page {
  width: 100%;
  margin-inline: auto;
  padding: clamp(18px, 3vw, 32px) var(--page-gutter);
  box-sizing: border-box;
  text-align: left;
}

.app-page--flush-top {
  padding-top: 0;
}

.app-page--app {
  max-width: var(--page-max-app);
}
.app-page--marketing {
  max-width: var(--page-max-marketing);
}
.app-page--narrow {
  max-width: var(--page-max-narrow);
}
.app-page--wide {
  max-width: var(--page-max-wide);
}
</style>
