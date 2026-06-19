<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand Column -->
        <div class="footer-column brand-column">
          <h2 class="brand-title"><BrandMark /></h2>
          <p class="brand-description">
            Transform your team's feedback into actionable insights with AI-powered retrospectives.
          </p>
        </div>

        <!-- Product Column -->
        <div class="footer-column">
          <h3>Product</h3>
          <nav class="footer-links">
            <router-link to="/boards/templates">Templates</router-link>
            <router-link to="/ai-generator">AI Generator</router-link>
            <router-link to="/join-board">Join Board</router-link>
          </nav>
        </div>

        <!-- Resources Column (SEO landing pages) -->
        <div class="footer-column">
          <h3>Resources</h3>
          <nav class="footer-links">
            <router-link to="/ai-retrospective">AI retrospective</router-link>
            <router-link to="/sprint-retrospective">Sprint retrospective</router-link>
            <router-link to="/scrum-retrospective">Scrum retrospective</router-link>
            <router-link to="/retrospective-ideas">Retrospective ideas</router-link>
            <router-link to="/free-retrospective-tool">Free retrospective tool</router-link>
          </nav>
        </div>

        <!-- Company Column -->
        <div class="footer-column">
          <h3>Company</h3>
          <nav class="footer-links">
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/blog">Blog</router-link>
            <router-link to="/help">Help Center</router-link>
          </nav>
        </div>

        <!-- Legal Column -->
        <div class="footer-column">
          <h3>Legal</h3>
          <nav class="footer-links">
            <router-link to="/privacy">Privacy Policy</router-link>
            <router-link to="/terms">Terms of Service</router-link>
            <a href="mailto:support@reaitro.com">Contact</a>
          </nav>
        </div>

        <!-- Newsletter Column -->
        <div class="footer-column">
          <h3 v-if="authStore.isAuthenticated">Get Started</h3>
          <h3 v-else>Sign up</h3>
          <nav class="footer-links">
            <router-link v-if="authStore.isAuthenticated" to="/boards">Go to Boards</router-link>
            <router-link v-else to="/login">Sign in</router-link>
          </nav>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} <BrandMark />. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import BrandMark from '@/components/ui/BrandMark.vue';
const authStore = useAuthStore();
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  background: white;
  padding: 5rem 0 2rem;
  border-top: 1px solid #eaeaea;
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 2.5rem;
  margin-bottom: 4rem;
}

.brand-column {
  max-width: 320px;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.brand-description {
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
}

.footer-column h3 {
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #2B7FFF;
}

.cta-container {
  margin-top: 0.5rem;
}

.cta-button {
  display: inline-block;
  background: #2B7FFF;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.cta-button:hover {
  background: #1a6eef;
  transform: translateY(-2px);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid #eaeaea;
  text-align: center;
}

.footer-bottom p {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem 4rem;
  }
  .brand-column {
    grid-column: 1 / -1;
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .app-footer {
    padding: 3rem 0 2rem;
  }
  .footer-container {
    padding: 0 1.5rem;
  }
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .footer-column {
    text-align: center;
  }
  .footer-links {
    align-items: center;
  }
  .brand-description {
    text-align: center;
  }
  .cta-container {
    display: flex;
    justify-content: center;
  }
}
</style> 