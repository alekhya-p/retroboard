<template>
  <div class="phone" role="img" aria-label="iPhone Safari preview">
    <div class="phone-screen">
      <!-- iOS status bar -->
      <div class="ios-status">
        <span class="ios-time">9:41</span>
        <span class="ios-icons">
          <!-- cellular -->
          <svg class="ios-ic" width="17" height="11" viewBox="0 0 17 11" aria-hidden="true">
            <rect x="0" y="7.5" width="2.6" height="3.5" rx="0.8" fill="currentColor" />
            <rect x="4.7" y="5.5" width="2.6" height="5.5" rx="0.8" fill="currentColor" />
            <rect x="9.4" y="3" width="2.6" height="8" rx="0.8" fill="currentColor" />
            <rect x="14.1" y="0.5" width="2.6" height="10.5" rx="0.8" fill="currentColor" />
          </svg>
          <span class="ios-5g">5G</span>
          <!-- battery -->
          <svg class="ios-ic" width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
            <rect x="0.6" y="0.6" width="21" height="10.8" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-width="1" />
            <rect x="2" y="2" width="16.5" height="8" rx="1.6" fill="currentColor" />
            <path d="M23 4 a1.4 1.4 0 0 1 0 4 Z" fill="currentColor" fill-opacity="0.4" />
          </svg>
        </span>
      </div>
      <div class="ios-island"></div>

      <!-- App content -->
      <div class="phone-scale">
        <div :style="{ zoom }">
          <slot />
        </div>
      </div>

      <!-- Safari bottom bar (URL only) -->
      <div class="safari-bar">
        <div class="safari-url">
          <span class="safari-lock">🔒</span>
          <span class="safari-host">{{ host }}</span>
          <span class="safari-reload">⟳</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{ zoom?: number; url?: string }>(), {
  zoom: 0.55,
  url: 'reaitro.com',
});

// Safari shows just the host in the address bar.
const host = computed(() => props.url.replace(/^https?:\/\//, '').split('/')[0]);
</script>

<style scoped>
.phone {
  position: relative;
  width: 264px;
  flex-shrink: 0;
  padding: 12px;
  border-radius: 48px;
  background: linear-gradient(160deg, #2a2f3a, #0b1018);
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.06),
    0 0 0 2px #20242d,
    0 30px 60px -26px rgba(15, 23, 42, 0.65);
}
.phone::before {
  content: '';
  position: absolute;
  left: -3px;
  top: 130px;
  width: 3px;
  height: 64px;
  background: #20242d;
  border-radius: 3px 0 0 3px;
}
.phone::after {
  content: '';
  position: absolute;
  right: -3px;
  top: 104px;
  width: 3px;
  height: 38px;
  background: #20242d;
  border-radius: 0 3px 3px 0;
}

.phone-screen {
  position: relative;
  height: 528px;
  border-radius: 38px;
  overflow: hidden;
  background: ghostwhite;
  display: flex;
  flex-direction: column;
}

/* status bar */
.ios-status {
  position: relative;
  z-index: 6;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px 2px;
  color: #0f172a;
  background: #fff;
}
.ios-time {
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}
.ios-icons { display: inline-flex; align-items: center; gap: 5px; }
.ios-ic { display: block; }
.ios-5g { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.01em; }

.ios-island {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 74px;
  height: 23px;
  background: #000;
  border-radius: 999px;
  z-index: 7;
}

.phone-scale {
  flex: 1 1 auto;
  overflow: hidden;
  background: ghostwhite;
}

/* Safari bottom bar */
.safari-bar {
  flex-shrink: 0;
  background: #f7f7f8;
  border-top: 1px solid #e2e8f0;
  padding: 8px 14px 10px;
}
.safari-url {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #e7e7ea;
  border-radius: 11px;
  padding: 7px 12px;
  font-size: 0.82rem;
  color: #1f2937;
}
.safari-lock { font-size: 0.7rem; opacity: 0.6; }
.safari-host { font-weight: 500; }
.safari-reload { margin-left: auto; opacity: 0.5; }
</style>
