<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumbs-list">
      <li
        v-for="(item, i) in items"
        :key="i"
        class="bc-item"
        :class="{ 'bc-item--current': i === items.length - 1 }"
      >
        <router-link
          v-if="item.to && i < items.length - 1"
          :to="item.to"
          class="bc-link"
        >{{ item.label }}</router-link>
        <span v-else class="bc-current" aria-current="page">{{ item.label }}</span>
        <span v-if="i < items.length - 1" class="bc-sep" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
  items: { label: string; to?: RouteLocationRaw }[];
}>();
</script>

<style scoped>
.breadcrumbs {
  margin-bottom: 14px;
}

.breadcrumbs-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 0;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
}

.bc-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.bc-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}
.bc-link:hover { text-decoration: underline; }

.bc-current {
  color: #64748b;
  font-weight: 600;
}

.bc-sep {
  display: inline-flex;
  align-items: center;
  color: #94a3b8;
  margin: 0 2px;
  flex-shrink: 0;
}
</style>
