<template>
  <div class="login-page">
    <AppPage variant="narrow" class="login-shell" flush-top>
      <div class="login-grid">
      <!-- Marketing side -->
      <section class="login-pitch">
        <a class="login-brand" @click="router.push('/')">
          <span class="login-brand-mark" aria-hidden="true">✦</span>
          <BrandMark class="login-brand-text" />
        </a>

        <span class="login-eyebrow">
          <span class="login-eyebrow-dot"></span>
          Free · AI-powered · No credit card
        </span>

        <h1>
          Remote retros your team
          <span class="login-gradient">actually shows up for</span>
        </h1>
        <p class="login-lede">
          Real-time boards, AI that writes the summary and action items, 26+ templates, and a built-in
          team-games lobby to warm up the room. Built for remote and distributed teams. Start in 30 seconds.
        </p>

        <ul class="login-features">
          <li>
            <span class="login-feature-icon">🎮</span>
            <div>
              <strong>Break the ice in 2 minutes</strong>
              <span>Five live team games warm up a quiet, remote room.</span>
            </div>
          </li>
          <li>
            <span class="login-feature-icon">✨</span>
            <div>
              <strong>AI does the write-up</strong>
              <span>Themes, summary, and action items - no late-night homework.</span>
            </div>
          </li>
          <li>
            <span class="login-feature-icon">🔒</span>
            <div>
              <strong>Privacy by default</strong>
              <span>Hosted in the EU. Customer data is never used to train AI models.</span>
            </div>
          </li>
          <li>
            <span class="login-feature-icon">🌍</span>
            <div>
              <strong>Remote &amp; async friendly</strong>
              <span>Sticky notes sync live, async retros stay open for days.</span>
            </div>
          </li>
        </ul>

        <div class="login-trust">
          <span class="login-trust-pill">🔒 EU-hosted</span>
          <span class="login-trust-pill">🆓 Free, no credit card</span>
          <span class="login-trust-pill">🤖 AI never trains on your data</span>
        </div>
      </section>

      <!-- Auth side -->
      <section class="login-form-card">
        <div class="login-form-header">
          <h2>Welcome back</h2>
          <p>Sign in to create boards, run retros, and use AI features.</p>
        </div>

        <div class="login-form-body">
          <button
            v-if="config.google?.enabled"
            type="button"
            class="login-oauth login-oauth-google"
            @click="loginWithGoogle"
            :disabled="loading"
          >
            <svg class="oauth-logo" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            v-if="config.microsoft?.enabled"
            type="button"
            class="login-oauth login-oauth-microsoft"
            @click="loginWithMicrosoft"
            :disabled="loading"
          >
            <svg viewBox="0 0 23 23" width="20" height="20" aria-hidden="true">
              <path fill="#f25022" d="M1 1h10v10H1z"/>
              <path fill="#7fba00" d="M12 1h10v10H12z"/>
              <path fill="#00a4ef" d="M1 12h10v10H1z"/>
              <path fill="#ffb900" d="M12 12h10v10H12z"/>
            </svg>
            <span>Continue with Microsoft</span>
          </button>

          <div class="login-divider"><span>or with email</span></div>

          <div class="login-tabs" role="tablist">
            <button
              type="button"
              class="login-tab"
              :class="{ 'login-tab--active': authMode === 'signin' }"
              role="tab"
              :aria-selected="authMode === 'signin'"
              @click="switchMode('signin')"
            >Sign in</button>
            <button
              type="button"
              class="login-tab"
              :class="{ 'login-tab--active': authMode === 'signup' }"
              role="tab"
              :aria-selected="authMode === 'signup'"
              @click="switchMode('signup')"
            >Create account</button>
          </div>

          <!-- Sign in -->
          <form
            v-if="authMode === 'signin'"
            class="login-email-form"
            @submit.prevent="handleEmailSignIn"
          >
            <label class="login-label" for="signin-email">Email</label>
            <input
              id="signin-email"
              type="email"
              v-model="email"
              placeholder="you@company.com"
              class="login-input"
              autocomplete="email"
              required
              :disabled="loading"
            />
            <div class="login-label-row">
              <label class="login-label" for="signin-password">Password</label>
              <router-link to="/forgot-password" class="login-forgot">Forgot password?</router-link>
            </div>
            <input
              id="signin-password"
              type="password"
              v-model="password"
              placeholder="Your password"
              class="login-input"
              autocomplete="current-password"
              required
              :disabled="loading"
            />
            <p v-if="emailError" class="login-error">{{ emailError }}</p>
            <button
              type="submit"
              class="btn btn--primary btn--block login-cta"
              :disabled="loading || !email || !password"
            >
              <span v-if="loading">Signing in…</span>
              <span v-else>Sign in →</span>
            </button>
          </form>

          <!-- Sign up -->
          <form
            v-else
            class="login-email-form"
            @submit.prevent="handleEmailSignUp"
          >
            <label class="login-label" for="signup-name">Name</label>
            <input
              id="signup-name"
              type="text"
              v-model="name"
              placeholder="e.g. Priya M."
              class="login-input"
              autocomplete="name"
              required
              :disabled="loading"
            />
            <label class="login-label" for="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              v-model="email"
              placeholder="you@company.com"
              class="login-input"
              autocomplete="email"
              required
              :disabled="loading"
            />
            <label class="login-label" for="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              v-model="password"
              placeholder="At least 8 characters"
              class="login-input"
              autocomplete="new-password"
              minlength="8"
              required
              :disabled="loading"
            />
            <p v-if="emailError" class="login-error">{{ emailError }}</p>
            <button
              type="submit"
              class="btn btn--primary btn--block login-cta"
              :disabled="loading || !name || !email || !password"
            >
              <span v-if="loading">Creating account…</span>
              <span v-else>Create account →</span>
            </button>
          </form>

          <div class="login-divider"><span>or join as guest</span></div>

          <form class="login-guest-form" @submit.prevent="handleSubmit">
            <label class="login-label" for="display-name">Display name</label>
            <input
              id="display-name"
              type="text"
              v-model="displayName"
              placeholder="e.g. Priya M."
              class="login-input"
              required
              :disabled="loading"
            />
            <p class="login-helper">
              Guests can join existing boards but can't create new ones or use AI features.
            </p>
            <button type="submit" class="btn btn--secondary btn--block login-cta" :disabled="loading || !displayName">
              <span v-if="loading">Signing in…</span>
              <span v-else>Continue as guest →</span>
            </button>
          </form>

          <p class="login-fineprint">
            By continuing you agree to our
            <router-link to="/terms">Terms</router-link>
            and
            <router-link to="/privacy">Privacy Policy</router-link>.
          </p>
        </div>

        <router-link to="/boards/templates" class="login-explore">
          Just browsing? Explore templates →
        </router-link>
      </section>
      </div>
    </AppPage>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import config from '@/assets/config.json';
import AppPage from '@/components/ui/AppPage.vue';
import BrandMark from '@/components/ui/BrandMark.vue';
import { applyHead, SITE_URL } from '@/utils/seo';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const displayName = ref('');
const loading = ref(false);

const authMode = ref<'signin' | 'signup'>('signin');
const name = ref('');
const email = ref('');
const password = ref('');
const emailError = ref('');

const switchMode = (mode: 'signin' | 'signup') => {
  authMode.value = mode;
  emailError.value = '';
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/boards');
  }
  applyHead({
    title: 'Sign in to reAItro · Free retrospectives + AI summaries',
    description:
      'Sign in to reAItro to create retrospective boards, run real-time retros, and use AI-powered summaries and action items. Free.',
    keywords: 'retroboard login, retrospective sign in, agile login, AI retrospective sign in',
    canonical: `${SITE_URL}/login`
  });
});

const getRedirectPath = () => {
  if (route.query.redirect) return route.query.redirect as string;
  return authStore.user?.user_type === 'anonymous' ? '/join-board' : '/boards';
};

const handleMicrosoftCallback = async (code: string) => {
  try {
    loading.value = true;
    await authStore.loginWithMicrosoft(code);
    router.replace({ query: { ...route.query, code: undefined } });
    const redirectPath = localStorage.getItem('authRedirect') || getRedirectPath();
    localStorage.removeItem('authRedirect');
    router.push(redirectPath);
  } catch (error) {
    console.error('Microsoft login failed:', error);
    router.replace({ query: { ...route.query, code: undefined } });
  } finally {
    loading.value = false;
  }
};

const handleGoogleCallback = async (code: string) => {
  try {
    loading.value = true;
    await authStore.loginWithGoogle(code);
    router.replace({ query: { ...route.query, code: undefined } });
    const redirectPath = localStorage.getItem('authRedirect') || getRedirectPath();
    localStorage.removeItem('authRedirect');
    router.push(redirectPath);
  } catch (error) {
    console.error('Google login failed:', error);
    router.replace({ query: { ...route.query, code: undefined } });
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.query.code,
  newCode => {
    if (newCode && typeof newCode === 'string') {
      if (route.query.provider === 'google') {
        handleGoogleCallback(newCode);
      } else {
        handleMicrosoftCallback(newCode);
      }
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  if (!displayName.value) return;
  try {
    loading.value = true;
    await authStore.loginAnonymously(displayName.value);
    router.push(getRedirectPath());
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    loading.value = false;
  }
};

const handleEmailSignIn = async () => {
  emailError.value = '';
  if (!email.value || !password.value) return;
  try {
    loading.value = true;
    await authStore.loginWithEmail(email.value, password.value);
    router.push(getRedirectPath());
  } catch (error: any) {
    emailError.value =
      error?.response?.data?.detail || 'Invalid email or password';
    console.error('Email sign in failed:', error);
  } finally {
    loading.value = false;
  }
};

const handleEmailSignUp = async () => {
  emailError.value = '';
  if (!name.value.trim()) {
    emailError.value = 'Please enter your name';
    return;
  }
  if (!isValidEmail(email.value)) {
    emailError.value = 'Please enter a valid email address';
    return;
  }
  if (password.value.length < 8) {
    emailError.value = 'Password must be at least 8 characters';
    return;
  }
  try {
    loading.value = true;
    await authStore.signupWithEmail(name.value.trim(), email.value, password.value);
    router.push(getRedirectPath());
  } catch (error: any) {
    emailError.value =
      error?.response?.data?.detail || 'Could not create account. Please try again.';
    console.error('Email sign up failed:', error);
  } finally {
    loading.value = false;
  }
};

const loginWithMicrosoft = () => {
  if (route.query.redirect) {
    localStorage.setItem('authRedirect', route.query.redirect as string);
  }
  const { tenantId, clientId, redirectUri, responseType, responseMode, scope } = config.microsoft;
  const microsoftOAuthUrl =
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}` +
    `&response_type=${responseType}` +
    `&redirect_uri=${encodeURIComponent(window.location.origin + redirectUri)}` +
    `&response_mode=${responseMode}` +
    `&scope=${encodeURIComponent(scope)}`;
  window.location.href = microsoftOAuthUrl;
};

const loginWithGoogle = () => {
  if (route.query.redirect) {
    localStorage.setItem('authRedirect', route.query.redirect as string);
  }
  const { clientId, redirectUri, scope } = config.google;
  const googleOAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(window.location.origin + redirectUri)}` +
    `&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
  window.location.href = googleOAuthUrl;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background:
    radial-gradient(900px 600px at 12% -10%, rgba(99,102,241,0.16), transparent 60%),
    radial-gradient(800px 600px at 95% 10%, rgba(168,85,247,0.14), transparent 55%),
    #f5f6fb;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Auth screen keeps its two-column marketing layout, so widen the
   AppPage shell beyond the narrow default while still using its gutter. */
.login-shell {
  max-width: 1180px;
  align-self: center;
}

.login-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
  align-items: center;
}

.login-pitch { color: #0f172a; max-width: 580px; padding-top: 10px; }
.login-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-size: 1.15rem;
  margin-bottom: 28px;
  text-decoration: none;
  color: inherit;
}
.login-brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px; height: 30px;
  border-radius: 10px;
  background: linear-gradient(135deg,#6366f1,#a855f7,#ec4899);
  color: #fff;
  font-size: 1rem;
}
.login-brand-text {
  color: #0f172a;
}
.login-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(99,102,241,0.1);
  color: #4f46e5;
  border: 1px solid rgba(99,102,241,0.2);
  font-size: 0.82rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 999px;
  margin-bottom: 18px;
  width: fit-content;
  padding-left: 4px;
}
.login-eyebrow-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 4px rgba(52,211,153,0.25);
}
.login-pitch h1 {
  font-size: 2.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 14px;
}
.login-gradient {
  background: linear-gradient(135deg,#6366f1,#a855f7,#ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.login-lede {
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0 0 28px;
  max-width: 520px;
}
.login-features { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 14px; }
.login-features li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.login-feature-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(99,102,241,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.login-features strong { display: block; color: #0f172a; font-size: 0.98rem; font-weight: 600; }
.login-features span { color: #64748b; font-size: 0.88rem; line-height: 1.45; }

.login-trust { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.login-trust-pill {
  background: #fff;
  border: 1px solid rgba(15,23,42,0.08);
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 0.78rem;
  color: #334155;
  font-weight: 500;
}

.login-form-card {
  background: rgba(255,255,255,0.96);
  border-radius: 24px;
  padding: 36px;
  border: 1px solid rgba(15,23,42,0.06);
  box-shadow: 0 30px 60px -25px rgba(15,23,42,0.25);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.login-form-header h2 { margin: 0 0 6px; font-size: 1.55rem; color: #0f172a; font-weight: 700; letter-spacing: -0.01em; }
.login-form-header p { margin: 0; color: #64748b; font-size: 0.95rem; }

.login-form-body { display: flex; flex-direction: column; gap: 12px; }

.login-oauth {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  border: 1.5px solid rgba(15,23,42,0.08);
  background: #fff;
  font-weight: 600;
  font-size: 0.98rem;
  cursor: pointer;
  color: #0f172a;
  transition: border 0.15s, box-shadow 0.15s, transform 0.15s;
  font-family: inherit;
}
.login-oauth:hover:not(:disabled) {
  border-color: rgba(99,102,241,0.4);
  box-shadow: 0 8px 20px -12px rgba(99,102,241,0.4);
  transform: translateY(-1px);
}
.login-oauth:disabled { opacity: 0.6; cursor: not-allowed; }
.login-oauth img,
.login-oauth .oauth-logo { width: 20px; height: 20px; }

.login-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
  font-size: 0.82rem;
  margin: 4px 0;
}
.login-divider::before, .login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(15,23,42,0.08);
}

.login-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: rgba(99,102,241,0.07);
  border: 1px solid rgba(15,23,42,0.06);
}
.login-tab {
  flex: 1;
  padding: 9px 12px;
  border-radius: 9px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  font-family: inherit;
}
.login-tab--active {
  background: #fff;
  color: #4f46e5;
  box-shadow: 0 4px 12px -6px rgba(99,102,241,0.4);
}

.login-email-form { display: flex; flex-direction: column; gap: 6px; }
.login-email-form .login-label { margin-top: 6px; }
.login-email-form .login-label:first-child { margin-top: 0; }

.login-label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
}
.login-label-row .login-label { margin-top: 0; }
.login-forgot {
  font-size: 0.8rem;
  font-weight: 500;
  color: #4f46e5;
  text-decoration: none;
}
.login-forgot:hover { color: #a855f7; }

.login-error {
  margin: 6px 0 0;
  color: #e11d48;
  font-size: 0.84rem;
  line-height: 1.4;
}

.login-guest-form { display: flex; flex-direction: column; gap: 6px; }
.login-label { font-size: 0.84rem; font-weight: 600; color: #1e293b; }
.login-input {
  padding: 13px 14px;
  border-radius: 12px;
  border: 1.5px solid rgba(15,23,42,0.1);
  background: #fafbff;
  font-size: 0.96rem;
  outline: none;
  transition: border 0.15s, box-shadow 0.15s;
  font-family: inherit;
}
.login-input:focus {
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
}
.login-helper { margin: 4px 0 0; color: #64748b; font-size: 0.82rem; line-height: 1.5; }

.login-cta {
  margin-top: 10px;
}

.login-fineprint { margin: 6px 0 0; font-size: 0.78rem; color: #64748b; text-align: center; }
.login-fineprint a { color: #4f46e5; text-decoration: none; border-bottom: 1px solid rgba(99,102,241,0.3); }
.login-fineprint a:hover { color: #a855f7; }

.login-explore {
  margin-top: 10px;
  text-align: center;
  font-size: 0.92rem;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}
.login-explore:hover { color: #a855f7; }

@media (max-width: 900px) {
  .login-grid { grid-template-columns: 1fr; gap: 28px; }
  .login-pitch h1 { font-size: 2rem; }
  .login-form-card { padding: 26px; }
  /* The global app header already shows the brand; on mobile the pitch
     stacks directly under it, so the in-page brand would read as a
     duplicate header. Hide it here (desktop keeps it in the left column). */
  .login-brand { display: none; }
}
</style>
