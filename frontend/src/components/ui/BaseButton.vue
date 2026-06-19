<template>
  <component
    :is="tag"
    class="btn"
    :class="[`btn--${variant}`, sizeClass, { 'btn--block': block, 'btn--icon': icon }]"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? (disabled || loading) : undefined"
    :aria-disabled="disabled || loading ? 'true' : undefined"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true"></span>
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    tag?: 'button' | 'a' | 'router-link';
    type?: 'button' | 'submit' | 'reset';
    block?: boolean;
    icon?: boolean;
    loading?: boolean;
    disabled?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    tag: 'button',
    type: 'button',
    block: false,
    icon: false,
    loading: false,
    disabled: false,
  }
);

const sizeClass = computed(() => (props.size === 'md' ? '' : `btn--${props.size}`));
</script>

<!-- styles come from the global design-system.css (.btn family) -->
