<template>
  <div class="browser">
    <div class="browser-bar">
      <div class="browser-dots">
        <span class="browser-dot" style="background:#ff5f57"></span>
        <span class="browser-dot" style="background:#febc2e"></span>
        <span class="browser-dot" style="background:#28c840"></span>
      </div>
      <div class="browser-url">{{ url }}</div>
    </div>
    <div class="browser-screen" :style="{ height: height + 'px' }">
      <div class="browser-scale" :style="{ zoom }">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ url?: string; zoom?: number; height?: number }>(), {
  url: 'reaitro.com',
  zoom: 0.6,
  height: 400,
});
</script>

<style scoped>
.browser {
  width: 620px;
  max-width: 100%;
  flex: 1 1 420px;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 24px 50px -24px rgba(15, 23, 42, 0.4);
}
.browser-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}
.browser-dots { display: flex; gap: 6px; }
.browser-dot { width: 11px; height: 11px; border-radius: 50%; }
.browser-url {
  flex: 1;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 0.78rem;
  color: #64748b;
}
.browser-screen {
  overflow: hidden;
  background: ghostwhite;
}
.browser-scale {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
