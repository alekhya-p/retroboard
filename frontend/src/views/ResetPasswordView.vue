<template>
  <div class="auth-page">
    <AppPage variant="narrow" flush-top>
      <div class="auth-card">
        <a class="auth-brand" @click="router.push('/')">
          <span class="auth-brand-mark" aria-hidden="true">✦</span>
          <BrandMark class="auth-brand-text" />
        </a>

        <template v-if="!token">
          <h1>Invalid reset link</h1>
          <p class="auth-lede">
            This password reset link is missing or malformed. Please request a new one.
          </p>
          <router-link to="/forgot-password" class="btn btn--primary btn--block auth-cta">
            Request a new link
          </router-link>
        </template>

        <template v-else>
          <h1>Choose a new password</h1>
          <p class="auth-lede">Pick a strong password you don't use anywhere else.</p>

          <form class="auth-form" @submit.prevent="handleSubmit">
            <label class="auth-label" for="reset-password">New password</label>
            <input
              id="reset-password"
              type="password"
              v-model="password"
              placeholder="At least 8 characters"
              class="auth-input"
              autocomplete="new-password"
              minlength="8"
              required
              :disabled="loading"
            />
            <label class="auth-label" for="reset-confirm">Confirm password</label>
            <input
              id="reset-confirm"
              type="password"
              v-model="confirm"
              placeholder="Re-enter your password"
              class="auth-input"
              autocomplete="new-password"
              required
              :disabled="loading"
            />
            <p v-if="error" class="auth-error">{{ error }}</p>
            <button
              type="submit"
              class="btn btn--primary btn--block auth-cta"
              :disabled="loading || !password || !confirm"
            >
              <span v-if="loading">Saving…</span>
              <span v-else>Set new password →</span>
            </button>
          </form>
        </template>

        <router-link to="/login" class="auth-back">← Back to sign in</router-link>
      </div>
    </AppPage>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import AppPage from '@/components/ui/AppPage.vue';
import BrandMark from '@/components/ui/BrandMark.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const token = ref('');
const password = ref('');
const confirm = ref('');
const loading = ref(false);
const error = ref('');

onMounted(() => {
  const t = route.query.token;
  token.value = typeof t === 'string' ? t : '';
});

const handleSubmit = async () => {
  error.value = '';
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters';
    return;
  }
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match';
    return;
  }
  try {
    loading.value = true;
    await authStore.resetPassword(token.value, password.value);
    useToast().success('Your password has been reset. You\'re now signed in.');
    router.push('/boards');
  } catch (err: any) {
    error.value =
      err?.response?.data?.detail ||
      'Could not reset your password. The link may have expired - request a new one.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background:
    radial-gradient(900px 600px at 12% -10%, rgba(99,102,241,0.16), transparent 60%),
    radial-gradient(800px 600px at 95% 10%, rgba(168,85,247,0.14), transparent 55%),
    #f5f6fb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  max-width: 440px;
  margin: 0 auto;
  background: rgba(255,255,255,0.96);
  border-radius: 24px;
  padding: 36px;
  border: 1px solid rgba(15,23,42,0.06);
  box-shadow: 0 30px 60px -25px rgba(15,23,42,0.25);
  backdrop-filter: blur(12px);
  text-align: center;
}

.auth-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-size: 1.1rem;
  margin-bottom: 22px;
  text-decoration: none;
  color: inherit;
}
.auth-brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px; height: 28px;
  border-radius: 9px;
  background: linear-gradient(135deg,#6366f1,#a855f7,#ec4899);
  color: #fff;
  font-size: 0.95rem;
}
.auth-brand-text {
  color: #0f172a;
}

.auth-card h1 {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #0f172a;
  margin: 0 0 10px;
}
.auth-lede {
  color: #64748b;
  font-size: 0.96rem;
  line-height: 1.55;
  margin: 0 0 22px;
}

.auth-form { display: flex; flex-direction: column; gap: 6px; text-align: left; }
.auth-label { font-size: 0.84rem; font-weight: 600; color: #1e293b; margin-top: 6px; }
.auth-label:first-child { margin-top: 0; }
.auth-input {
  padding: 13px 14px;
  border-radius: 12px;
  border: 1.5px solid rgba(15,23,42,0.1);
  background: #fafbff;
  font-size: 0.96rem;
  outline: none;
  transition: border 0.15s, box-shadow 0.15s;
  font-family: inherit;
}
.auth-input:focus {
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
}
.auth-error {
  margin: 6px 0 0;
  color: #e11d48;
  font-size: 0.84rem;
  line-height: 1.4;
}
.auth-cta { margin-top: 12px; }

.auth-back {
  display: inline-block;
  margin-top: 22px;
  font-size: 0.9rem;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}
.auth-back:hover { color: #a855f7; }

@media (max-width: 640px) {
  .auth-card { padding: 26px; }
  /* Avoid a duplicate brand stacked right under the global app header. */
  .auth-brand { display: none; }
}
</style>
