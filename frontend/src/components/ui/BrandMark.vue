<template>
  <span class="brandmark" :aria-label="`reAItro`">
    <span class="brandmark__re">re</span><span class="brandmark__ai">AI</span><span class="brandmark__tro">tro</span>
  </span>
</template>

<script setup lang="ts">
// The product wordmark: "retro" with "AI" highlighted in the middle → reAItro.
// "re" and "tro" inherit the surrounding text colour (currentColor) so the
// mark adapts to light or dark contexts; "AI" always pops in the brand gradient.
</script>

<style scoped>
.brandmark {
  display: inline;
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
}
.brandmark__re,
.brandmark__tro {
  color: currentColor;
}
.brandmark__ai {
  font-weight: 800;
  background: var(--brand-gradient, linear-gradient(135deg, #6366f1, #a855f7, #ec4899));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
