<template>
  <BaseDialog :open="open" :title="`Share ${title}`" size="sm" mobile="sheet" @close="$emit('close')">
    <div class="share-body">
      <div class="share-qr-wrap">
        <img v-if="qr" :src="qr" alt="QR code for the invite link" class="share-qr" />
        <div v-else class="share-qr share-qr--loading"></div>
      </div>
      <p class="share-hint">Scan the QR to open it on a phone - or copy the link and paste it anywhere.</p>
      <div class="share-link">
        <input class="share-input" :value="url" readonly @focus="selectAll" />
        <button class="btn btn--primary btn--sm" @click="copy">{{ copied ? '✓ Copied' : 'Copy' }}</button>
      </div>
    </div>
    <template #actions>
      <button v-if="canNativeShare" class="btn btn--secondary" @click="nativeShare">Share…</button>
      <button class="btn btn--subtle" @click="$emit('close')">Done</button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import QRCode from 'qrcode';
import BaseDialog from './BaseDialog.vue';

const props = withDefaults(
  defineProps<{ open: boolean; url: string; title?: string }>(),
  { title: 'this board' }
);
defineEmits<{ (e: 'update:open', v: boolean): void; (e: 'close'): void }>();

const qr = ref('');
const copied = ref(false);
const canNativeShare = typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function';

watch(
  () => [props.open, props.url],
  async () => {
    if (props.open && props.url) {
      try {
        qr.value = await QRCode.toDataURL(props.url, {
          width: 240,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' },
        });
      } catch {
        qr.value = '';
      }
    }
  },
  { immediate: true }
);

async function copy() {
  try {
    await navigator.clipboard.writeText(props.url);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    /* clipboard blocked - the field is selectable as a fallback */
  }
}

function nativeShare() {
  if ((navigator as any).share) {
    (navigator as any).share({ title: props.title, url: props.url }).catch(() => {});
  }
}

function selectAll(e: FocusEvent) {
  (e.target as HTMLInputElement).select();
}
</script>

<style scoped>
.share-body { text-align: center; }
.share-qr-wrap {
  display: flex;
  justify-content: center;
  margin: 4px 0 14px;
}
.share-qr {
  width: 200px;
  height: 200px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 10px;
  background: #fff;
}
.share-qr--loading { background: #f1f5f9; }
.share-hint {
  color: #64748b;
  font-size: 0.92rem;
  margin: 0 0 14px;
}
.share-link {
  display: flex;
  gap: 8px;
  align-items: center;
}
.share-input {
  flex: 1;
  min-width: 0;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.95rem;
  color: #334155;
  background: #f8fafc;
  outline: none;
}
.share-input:focus { border-color: #6366f1; }
</style>
