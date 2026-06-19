<template>
  <div class="app-container">
    <!-- Loading overlay -->
    <div v-if="authStore.loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- Header -->
    <header class="app-header">
      <div class="header-container">
        <!-- Left: Logo + desktop grouped nav -->
        <div class="header-left">
          <button
            type="button"
            class="mobile-menu-btn"
            aria-label="Open menu"
            :aria-expanded="isMobileNavOpen"
            @click="openMobileNav"
          >
            <span class="mobile-menu-icon" aria-hidden="true"></span>
          </button>

          <h1 class="logo" @click="goTo('/')">
            <span class="logo-mark" aria-hidden="true">✦</span>
            <BrandMark class="logo-text" />
          </h1>

          <nav class="main-nav desktop-nav" aria-label="Main">
            <div class="divider"></div>
            <template v-for="entry in desktopNavEntries" :key="navEntryKey(entry)">
              <button
                v-if="entry.type === 'link'"
                type="button"
                class="nav-link"
                :class="{ 'nav-link--active': isNavActive(entry.item.path) }"
                @click="goTo(entry.item.path)"
              >
                {{ entry.item.label }}
              </button>
              <div
                v-else
                class="nav-group"
                :class="{ 'nav-group--active': isGroupActive(entry) }"
              >
                <button type="button" class="nav-group-trigger" aria-haspopup="true">
                  {{ entry.label }}
                  <svg class="nav-chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div class="nav-dropdown">
                  <button
                    v-for="item in entry.items"
                    :key="item.path"
                    type="button"
                    class="nav-dropdown-item"
                    :class="{ 'nav-dropdown-item--active': isNavActive(item.path) }"
                    @click="goTo(item.path)"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </template>
          </nav>
        </div>

        <!-- Right: User Menu -->
        <div class="header-right">
          <div v-if="!authStore.isAuthenticated" class="auth-button" @click="router.push('/login')">
            <span>Sign In</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          
          <div v-else class="user-menu">
            <div class="user-button" @click="toggleUserMenu">
              <div class="user-avatar">
                {{ displayName.split(' ').map(n => n[0]).join('').toUpperCase() }}
              </div>
              <div class="user-menu-trigger">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px;">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <span class="user-name">{{ displayName }}</span>
              </div>
            </div>
            
            <div v-if="isUserMenuOpen" class="user-dropdown">
              <div class="dropdown-item" @click="handleLogout">
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile side nav -->
    <Teleport to="body">
      <Transition name="mobile-nav">
        <div
          v-if="isMobileNavOpen"
          class="mobile-nav-overlay"
          @click.self="closeMobileNav"
        >
          <nav class="mobile-nav-drawer" aria-label="Mobile menu">
            <div class="mobile-nav-head">
              <h2 class="mobile-nav-title">Menu</h2>
              <button type="button" class="mobile-nav-close" aria-label="Close menu" @click="closeMobileNav">×</button>
            </div>

            <div class="mobile-nav-links">
              <button
                v-for="item in mobileNavLinks"
                :key="item.path"
                type="button"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link--active': isNavActive(item.path) }"
                @click="goTo(item.path)"
              >
                {{ item.label }}
              </button>
            </div>

            <div v-if="!authStore.isAuthenticated" class="mobile-nav-section mobile-nav-auth">
              <button type="button" class="mobile-nav-signin" @click="goTo('/login')">Sign In</button>
            </div>
          </nav>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Global toast notifications -->
    <ToastHost />

    <!-- Cookies Banner -->
    <div v-if="showCookiesBanner" class="cookies-banner">
      <div class="cookies-banner-content">
        <span class="cookies-text">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
        </span>
        <div class="cookies-actions">
          <button class="btn btn-primary" @click="acceptCookies">Accept</button>
          <button class="btn btn-outline" @click="declineCookies">Decline</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ToastHost from '@/components/ToastHost.vue';
import BrandMark from '@/components/ui/BrandMark.vue';

interface NavItem {
  label: string;
  path: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

type NavEntry =
  | { type: 'link'; item: NavItem }
  | { type: 'group'; label: string; items: NavItem[] };

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isUserMenuOpen = ref(false);
const isMobileNavOpen = ref(false);
const showCookiesBanner = ref(false);

const isAccount = computed(
  () => authStore.isAuthenticated && authStore.user?.user_type !== 'anonymous'
);

const exploreItems: NavItem[] = [
  { label: 'Blog', path: '/blog' },
  { label: 'Join a board', path: '/join-board' },
];

const desktopHeaderLinks: NavItem[] = [
  { label: 'AI Generator', path: '/ai-generator' },
  { label: 'Games', path: '/play' },
];

const desktopNavEntries = computed<NavEntry[]>(() => {
  const links: NavItem[] = [
    ...(isAccount.value ? [{ label: 'Boards', path: '/boards' }] : []),
    { label: 'Templates', path: '/boards/templates' },
    ...desktopHeaderLinks,
  ];
  return [
    ...links.map(item => ({ type: 'link' as const, item })),
    { type: 'group' as const, label: 'Explore', items: exploreItems },
  ];
});

const mobileNavLinks = computed<NavItem[]>(() => [
  ...(isAccount.value ? [{ label: 'Boards', path: '/boards' }] : []),
  { label: 'Templates', path: '/boards/templates' },
  ...desktopHeaderLinks,
  ...exploreItems,
]);

function navEntryKey(entry: NavEntry): string {
  return entry.type === 'link' ? entry.item.path : entry.label;
}

function isNavActive(path: string): boolean {
  if (path === '/boards') {
    return route.path === '/boards' ||
      (route.path.startsWith('/boards/') && !route.path.startsWith('/boards/templates'));
  }
  if (path === '/boards/templates') {
    return route.path.startsWith('/boards/templates');
  }
  return route.path === path || route.path.startsWith(`${path}/`);
}

function isGroupActive(group: NavGroup): boolean {
  return group.items.some(item => isNavActive(item.path));
}

function goTo(path: string) {
  closeMobileNav();
  router.push(path);
}

function openMobileNav() {
  isMobileNavOpen.value = true;
  isUserMenuOpen.value = false;
}

function closeMobileNav() {
  isMobileNavOpen.value = false;
}

function onGlobalKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isMobileNavOpen.value) closeMobileNav();
}

// Watch for route changes and scroll to top
watch(() => route.path, () => {
  closeMobileNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

watch(isMobileNavOpen, open => {
  document.body.style.overflow = open ? 'hidden' : '';
});

const displayName = computed(() => {
  const name = authStore.user?.display_name || '';
  return name.replace(/\b\w/g, c => c.toUpperCase());
});

// Toggle user menu
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

// Close user menu when clicking outside
const closeUserMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-menu')) {
    isUserMenuOpen.value = false;
  }
};

// Initialize authentication state from localStorage and validate token
onMounted(async () => {
  try {
    // Validate the token on app startup
    const isValid = await authStore.initializeAuth();

    // Redirect based on authentication status
    if (isValid) {
      // If user is on login or home page, redirect to boards
      if (route.name === 'login' || route.name === 'home') {
        router.push('/boards');
      }
    } else {
      // If token is invalid and user is on a protected route, redirect to login
      if (route.meta.requiresAuth) {
        router.push({
          path: '/login',
          query: { redirect: route.fullPath }
        });
      }
    }
    
    // Add event listener for closing user menu when clicking outside
    document.addEventListener('click', closeUserMenu);
    document.addEventListener('keydown', onGlobalKeydown);

    if (!localStorage.getItem('cookiesConsent')) {
      showCookiesBanner.value = true;
    }
  } catch (error) {
    console.error('Auth initialization failed:', error);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeUserMenu);
  document.removeEventListener('keydown', onGlobalKeydown);
  document.body.style.overflow = '';
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

function acceptCookies() {
  localStorage.setItem('cookiesConsent', 'accepted');
  showCookiesBanner.value = false;
}
function declineCookies() {
  localStorage.setItem('cookiesConsent', 'declined');
  showCookiesBanner.value = false;
}
</script>

<style>
/* Base styles */
:root {
  --primary-color: #6366f1;
  --primary-light: #818cf8;
  --primary-dark: #4f46e5;
  --accent-color: #a855f7;
  --text-color: #0f172a;
  --text-light: #64748b;
  --bg-color: #ffffff;
  --bg-light: #f8fafc;
  --surface: rgba(255, 255, 255, 0.72);
  --surface-strong: rgba(255, 255, 255, 0.92);
  --border-color: rgba(15, 23, 42, 0.08);
  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 10px 30px -12px rgba(15, 23, 42, 0.18);
  --shadow-lg: 0 20px 50px -20px rgba(79, 70, 229, 0.35);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-pill: 999px;
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --brand-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 60%, #ec4899 100%);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-color);
  background: #f5f6fb;
  background-attachment: fixed;
  line-height: 1.55;
  letter-spacing: -0.005em;
}

/* App container */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  isolation: isolate;
}

.app-container::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(900px 600px at 12% -10%, rgba(99, 102, 241, 0.18), transparent 60%),
    radial-gradient(800px 600px at 95% 10%, rgba(168, 85, 247, 0.16), transparent 55%),
    radial-gradient(700px 500px at 50% 110%, rgba(236, 72, 153, 0.10), transparent 60%);
  pointer-events: none;
  z-index: -1;
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0deg, var(--primary-color) 280deg, transparent 360deg);
  mask: radial-gradient(closest-side, transparent calc(100% - 4px), #000 calc(100% - 4px));
  -webkit-mask: radial-gradient(closest-side, transparent calc(100% - 4px), #000 calc(100% - 4px));
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Header */
.app-header {
  background-color: var(--surface);
  backdrop-filter: saturate(180%) blur(18px);
  -webkit-backdrop-filter: saturate(180%) blur(18px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-xs);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 1.25rem;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 0.35rem;
}

.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  color: var(--text-color);
  transition: background-color 0.15s ease;
}

.mobile-menu-btn:hover,
.mobile-menu-btn:active {
  background: rgba(99, 102, 241, 0.08);
}

.mobile-menu-icon,
.mobile-menu-icon::before,
.mobile-menu-icon::after {
  display: block;
  width: 15px;
  height: 1.5px;
  background: currentColor;
  border-radius: 1px;
  position: relative;
}

.mobile-menu-icon::before,
.mobile-menu-icon::after {
  content: '';
  position: absolute;
  left: 0;
}

.mobile-menu-icon::before { top: -5px; }
.mobile-menu-icon::after { top: 5px; }

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: inline-flex;
    margin-right: 0.15rem;
  }
  .header-left {
    gap: 0.15rem;
  }
  .header-container {
    height: 60px;
    padding: 0 0.85rem;
  }
  .logo-text {
    font-size: 1.05rem;
  }
  .logo-mark {
    width: 28px;
    height: 28px;
  }
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-color);
  cursor: pointer;
  transition: var(--transition);
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: var(--brand-gradient);
  color: #fff;
  font-size: 1rem;
  line-height: 1;
  box-shadow: 0 6px 18px -6px rgba(99, 102, 241, 0.55);
}

.logo-text {
  /* BrandMark renders "re" + highlighted "AI" + "tro"; the wrapper just sets
     the base colour for the non-highlighted letters. */
  color: var(--text-color);
  font-size: 1.2rem;
}

.logo:hover .logo-mark {
  transform: translateY(-1px) rotate(-6deg);
  transition: var(--transition);
}

.divider {
  width: 1px;
  height: 22px;
  background-color: var(--border-color);
  margin: 0 1rem;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  margin-left: 0.25rem;
}

@media (max-width: 768px) {
  .main-nav.desktop-nav {
    display: none;
  }
}

.nav-group {
  position: relative;
}

.nav-group-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-light);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.45rem 0.75rem;
  border-radius: var(--radius-pill);
  border: none;
  background: transparent;
  font-family: inherit;
  white-space: nowrap;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.nav-chevron {
  opacity: 0.55;
  transition: transform 0.15s ease;
}

.nav-group:hover .nav-chevron,
.nav-group:focus-within .nav-chevron {
  transform: rotate(180deg);
}

.nav-group-trigger:hover,
.nav-group:focus-within .nav-group-trigger,
.nav-group--active .nav-group-trigger {
  color: var(--text-color);
  background-color: rgba(99, 102, 241, 0.08);
}

.nav-group--active .nav-group-trigger {
  color: var(--primary-dark);
  background-color: rgba(99, 102, 241, 0.12);
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 180px;
  background: var(--surface-strong);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: 4px;
  z-index: 120;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  pointer-events: none;
  transition: opacity 0.15s ease-out, transform 0.15s ease-out, visibility 0.15s;
}

.nav-group:hover .nav-dropdown,
.nav-group:focus-within .nav-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.nav-dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.55rem 0.85rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-color);
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-family: inherit;
  transition: background 0.15s;
}

.nav-dropdown-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-dark);
}

.nav-dropdown-item--active {
  color: var(--primary-dark);
  background: rgba(99, 102, 241, 0.12);
}

.nav-link {
  color: var(--text-light);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.45rem 0.75rem;
  border-radius: var(--radius-pill);
  border: none;
  background: transparent;
  font-family: inherit;
  white-space: nowrap;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.nav-link:hover,
.nav-link--active {
  color: var(--text-color);
  background-color: rgba(99, 102, 241, 0.08);
}

.nav-link--active {
  color: var(--primary-dark);
  background-color: rgba(99, 102, 241, 0.12);
}

/* Mobile side drawer */
.mobile-nav-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.mobile-nav-drawer {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(300px, 88vw);
  background: var(--surface-strong);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-right: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 1.5rem;
  overflow-y: auto;
}

.mobile-nav-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.mobile-nav-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-color);
}

.mobile-nav-close {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-md);
  background: rgba(15, 23, 42, 0.06);
  color: var(--text-color);
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

.mobile-nav-close:hover {
  background: rgba(99, 102, 241, 0.1);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 0.25rem;
}

.mobile-nav-section {
  padding: 0.5rem 0;
}

.mobile-nav-section + .mobile-nav-section {
  border-top: 1px solid var(--border-color);
}

.mobile-nav-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-light);
  margin-bottom: 0.35rem;
  padding: 0 0.25rem;
}

.mobile-nav-link {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 0.65rem;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.98rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
}

.mobile-nav-link:hover {
  background: rgba(99, 102, 241, 0.08);
}

.mobile-nav-link--active {
  color: var(--primary-dark);
  background: rgba(99, 102, 241, 0.12);
}

.mobile-nav-auth {
  margin-top: auto;
  padding-top: 1rem;
}

.mobile-nav-signin {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--brand-gradient);
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 8px 22px -10px rgba(99, 102, 241, 0.65);
}

.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: opacity 0.2s ease;
}

.mobile-nav-enter-active .mobile-nav-drawer,
.mobile-nav-leave-active .mobile-nav-drawer {
  transition: transform 0.22s ease-out;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
}

.mobile-nav-enter-from .mobile-nav-drawer,
.mobile-nav-leave-to .mobile-nav-drawer {
  transform: translateX(-100%);
}

/* User menu */
.header-right {
  display: flex;
  align-items: center;
}

.auth-button {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1.1rem;
  border-radius: var(--radius-pill);
  background: var(--brand-gradient);
  color: #fff;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  border: none;
  box-shadow: 0 8px 22px -10px rgba(99, 102, 241, 0.65);
  transition: var(--transition);
}

.auth-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px -10px rgba(168, 85, 247, 0.7);
}

.auth-button svg {
  width: 18px;
  height: 18px;
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface-strong);
  color: var(--text-color);
  border-radius: var(--radius-pill);
  padding: 0.3rem 0.85rem 0.3rem 0.3rem;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-xs);
  transition: var(--transition);
}

.user-button:hover {
  background: #fff;
  border-color: rgba(99, 102, 241, 0.25);
  box-shadow: var(--shadow-sm);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--brand-gradient);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  margin-right: 0;
  padding: 0;
  flex-shrink: 0;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-menu-trigger svg {
  margin-right: 1.5px;
  margin-top: 4px;
  vertical-align: middle;
}
.user-name {
  font-weight: 600;
}

@media (max-width: 768px) {
  .user-name {
    display: none;
  }
  .user-button {
    padding: 0.25rem;
  }
  .user-menu-trigger svg {
    display: none;
  }
  .user-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    left: auto;
    width: 140px;
    z-index: 9999;
  }
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--surface-strong);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  min-width: 140px;
  z-index: 10;
  overflow: hidden;
  padding: 4px;
  animation: dropdown-in 0.15s ease-out;
}

@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  padding: 0.6rem 0.85rem;
  font-weight: 500;
  font-size: 0.92rem;
  color: var(--text-color);
  cursor: pointer;
  width: 100%;
  text-align: left;
  border: none;
  border-radius: 8px;
  background: transparent;
  transition: background 0.15s;
}

.dropdown-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-dark);
}

/* Main content */
.main-content {
  flex: 1;
  padding: 0rem 1rem;
  width: 100%;
}

/* Cookies Banner */
.cookies-banner {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 1.25rem;
  z-index: 2000;
  background: var(--surface-strong);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: calc(100% - 2rem);
  width: 720px;
}
.cookies-banner-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}
.cookies-text {
  color: var(--text-color);
  font-size: 0.92rem;
  flex: 1;
}
.cookies-actions {
  display: flex;
  gap: 0.5rem;
}
.btn.btn-primary {
  background: var(--brand-gradient);
  color: #fff;
  border: none;
  border-radius: var(--radius-pill);
  padding: 0.55rem 1.2rem;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  box-shadow: 0 8px 22px -10px rgba(99, 102, 241, 0.65);
  transition: var(--transition);
}
.btn.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 26px -10px rgba(168, 85, 247, 0.7);
}
.btn.btn-outline {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-pill);
  padding: 0.55rem 1.2rem;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: var(--transition);
}
.btn.btn-outline:hover {
  background: rgba(99, 102, 241, 0.08);
  color: var(--primary-dark);
  border-color: rgba(99, 102, 241, 0.3);
}
@media (max-width: 600px) {
  .cookies-banner-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 0.5rem;
  }
  .cookies-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>