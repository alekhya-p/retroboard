<template>
  <div class="home-container">
    <!-- HERO -->
    <section class="hero-section">
      <AppPage variant="marketing" class="hero-page">
        <div class="hero-grid">
          <div class="hero-copy">
            <div class="ai-badge">Built for remote &amp; distributed agile teams</div>
            <h1 class="hero-title">
              Remote retros your team<br />
              <span class="text-gradient">actually shows up for.</span>
            </h1>
            <p class="hero-subtitle">
              Distributed retros go quiet, and writing up the actions eats your evening.
              reAItro keeps the room engaged and does the busywork for you - live boards,
              AI summaries, and team games to break the ice. Free, no credit card.
            </p>

            <div class="hero-action">
              <button
                v-if="!authStore.isAuthenticated"
                class="btn btn--secondary btn--lg"
                @click="$router.push('/login')"
              >
                Get started free
              </button>
              <button
                v-else
                class="btn btn--secondary btn--lg"
                @click="$router.push('/boards')"
              >
                Go to boards
              </button>
              <button class="btn btn--outline btn--lg" @click="$router.push('/play')">
                🎮 Play team games
              </button>
            </div>

            <ul class="hero-bullets">
              <li>🎮 Warm up a quiet room with a 2-minute team game</li>
              <li>✨ AI clusters feedback &amp; writes the summary before the call ends</li>
              <li>🎯 Action items captured for you - no late-night write-ups</li>
              <li>🌍 Works across timezones - async boards stay open for days</li>
            </ul>
          </div>

          <div class="hero-visual">
            <div class="viz-desktop">
              <BrowserShell url="reaitro.com/boards/sprint-42" :height="380" :zoom="0.62">
                <BoardPreview layout="desktop" />
              </BrowserShell>
              <div class="hero-phone">
                <PhoneShell url="reaitro.com" :zoom="0.5">
                  <BoardPreview layout="mobile" />
                </PhoneShell>
              </div>
            </div>
            <div class="viz-phone">
              <PhoneShell url="reaitro.com/boards/sprint-42" :zoom="0.62">
                <BoardPreview layout="mobile" />
              </PhoneShell>
            </div>
          </div>
        </div>
      </AppPage>
    </section>

    <!-- RUN GREAT RETROS -->
    <section class="feature-section">
      <AppPage variant="marketing">
        <div class="feature-band">
          <div class="eyebrow eyebrow--blue">Sprint retros</div>
          <h2>Run great retros, end to end</h2>
          <p>Drop in a template, gather feedback live, let AI cluster it and surface the actions. Done before the meeting ends.</p>
          <div class="split-actions">
            <button
              class="btn btn--secondary"
              @click="$router.push('/boards/templates')"
            >
              Browse 26 templates
            </button>
            <button class="btn btn--ghost" @click="$router.push('/join-board')">
              Join a board →
            </button>
          </div>
        </div>
      </AppPage>
    </section>

    <!-- PLAY TEAM GAMES -->
    <section class="feature-section feature-section--alt" id="team-games">
      <AppPage variant="marketing">
        <div class="split split--reverse">
          <div class="split-copy">
            <div class="eyebrow eyebrow--violet">🎮 New · Team games</div>
            <h2>Play together in one click</h2>
            <p>Spin up a game room, share the link, play. Five live multiplayer games with AI prompts - perfect for onboarding and remote mixers.</p>
            <div class="split-actions">
              <button class="btn btn--secondary" @click="$router.push('/play')">
                🚀 Open games lobby
              </button>
              <button class="btn btn--ghost" @click="$router.push('/blog/team-games-for-remote-teams')">
                Read the guide →
              </button>
            </div>
          </div>
          <div class="split-visual">
            <div class="viz-desktop">
              <BrowserShell url="reaitro.com/play" :height="360" :zoom="0.58">
                <GamesPreview />
              </BrowserShell>
            </div>
            <div class="viz-phone">
              <PhoneShell url="reaitro.com/play" :zoom="0.5">
                <GamesPreview />
              </PhoneShell>
            </div>
          </div>
        </div>
      </AppPage>
    </section>

    <!-- AI TEMPLATE GENERATOR -->
    <section class="feature-section">
      <AppPage variant="marketing">
        <div class="split">
          <div class="split-copy">
            <div class="eyebrow eyebrow--blue">✨ AI generator</div>
            <h2>Describe it. Get a board.</h2>
            <p>Type one sentence - "a launch-week retro with a wrestling theme" - and AI builds the columns for you.</p>
            <div class="split-actions">
              <button
                class="btn btn--secondary"
                @click="$router.push(`${authStore.isAuthenticated && authStore.user?.user_type != 'anonymous' ? '/boards/templates?showAI=true' : '/boards/templates'}`)"
              >
                ✨ Try the AI generator
              </button>
            </div>
          </div>
          <div class="split-visual">
            <div class="viz-desktop">
              <BrowserShell url="reaitro.com/ai-generator" :height="360" :zoom="0.58">
                <AiTemplatePreview />
              </BrowserShell>
            </div>
            <div class="viz-phone">
              <PhoneShell url="reaitro.com/ai-generator" :zoom="0.5">
                <AiTemplatePreview />
              </PhoneShell>
            </div>
          </div>
        </div>
      </AppPage>
    </section>

    <!-- WHY TEAMS PICK US -->
    <section class="highlights-section">
      <AppPage variant="marketing">
        <div class="section-head">
          <h2>Everything a great retro needs</h2>
          <p>Less setup, more insight.</p>
        </div>
        <div class="highlights-grid">
          <div class="surface highlight" @click="$router.push('/boards/templates')">
            <div class="highlight-emoji">✨</div>
            <h3>AI summaries</h3>
            <p>Structured recaps in seconds.</p>
          </div>
          <div class="surface highlight" @click="$router.push('/join-board')">
            <div class="highlight-emoji">⚡</div>
            <h3>Real-time sync</h3>
            <p>Zero-latency collaboration.</p>
          </div>
          <div class="surface highlight" @click="$router.push('/boards/templates')">
            <div class="highlight-emoji">🎯</div>
            <h3>Action items</h3>
            <p>Follow-ups captured for you.</p>
          </div>
          <div class="surface highlight" @click="$router.push('/play')">
            <div class="highlight-emoji">🎮</div>
            <h3>Team games</h3>
            <p>Five AI-powered icebreakers.</p>
          </div>
        </div>
      </AppPage>
    </section>

    <!-- TEMPLATES STRIP -->
    <section class="templates-section">
      <AppPage variant="marketing">
        <div class="section-head">
          <h2>Start from a template</h2>
          <p>Or generate your own with a prompt.</p>
        </div>
        <div class="templates-grid">
          <div class="surface template-card template-card--custom" @click="$router.push('/boards/create')">
            <div class="template-icon" style="background:#9333ea22">✨</div>
            <div class="template-name">Custom template</div>
            <div class="template-desc">Build your own from a single prompt.</div>
          </div>
          <div
            v-for="template in featuredTemplates"
            :key="template.name"
            class="surface template-card"
            :style="{ borderTop: '4px solid ' + (template.columns[0]?.color || '#2563eb') }"
            @click="$router.push('/boards/templates')"
          >
            <div class="template-icon" :style="{ background: (template.columns[0]?.color || '#2563eb') + '22' }">
              {{ template.name.split(' ')[0] || '📋' }}
            </div>
            <div class="template-name">{{ template.name.split(' ').slice(1).join(' ') }}</div>
            <div class="template-desc">{{ template.shortDescription }}</div>
          </div>
        </div>
      </AppPage>
    </section>

    <!-- FINAL CTA -->
    <section class="cta-section">
      <AppPage variant="narrow">
        <div class="cta-inner">
          <h2 class="cta-title">Ready for better remote retros?</h2>
          <p class="cta-description">Spin up your first board in 30 seconds - free, no credit card, no signup required to join.</p>
          <div class="cta-buttons">
            <button
              v-if="!authStore.isAuthenticated"
              class="btn btn--secondary btn--lg"
              @click="$router.push('/login')"
            >
              Get started now
            </button>
            <button
              v-else
              class="btn btn--secondary btn--lg"
              @click="$router.push('/boards')"
            >
              Go to my boards
            </button>
            <button
              class="btn btn--outline btn--lg"
              @click="$router.push(`${authStore.isAuthenticated && authStore.user?.user_type != 'anonymous' ? '/boards/templates?showAI=true' : '/boards/templates'}`)"
            >
              ✨ AI generate template
            </button>
          </div>
        </div>
      </AppPage>
    </section>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue';
import templatesData from '@/templates.json';
import AppFooter from '@/components/AppFooter.vue';
import AppPage from '@/components/ui/AppPage.vue';
import BrowserShell from '@/components/ui/BrowserShell.vue';
import PhoneShell from '@/components/ui/PhoneShell.vue';
import BoardPreview from '@/components/ui/previews/BoardPreview.vue';
import GamesPreview from '@/components/ui/previews/GamesPreview.vue';
import AiTemplatePreview from '@/components/ui/previews/AiTemplatePreview.vue';

const authStore = useAuthStore();
const templates = ref(templatesData);

// A short, scannable selection for the marketing strip (no infinite scroll).
const featuredTemplates = computed(() => templates.value.slice(0, 7));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

.home-container {
  width: 100%;
  overflow-x: hidden;
  font-family: 'Poppins', sans-serif;
  background: #f4f9ff;
  color: #1a1a1a;
}

/* AppPage owns the gutter + max-width; sections only set vertical rhythm + bg */
.hero-page {
  padding-top: clamp(32px, 6vw, 72px);
}

/* ---------- HERO ---------- */
.hero-section {
  background:
    radial-gradient(900px 500px at 12% -10%, rgba(43, 127, 255, 0.18), transparent 60%),
    radial-gradient(900px 600px at 100% 0%, rgba(124, 58, 237, 0.14), transparent 55%),
    #eaf4ff;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
  padding-bottom: clamp(2rem, 5vw, 4rem);
}

.hero-copy {
  min-width: 0;
}

.ai-badge {
  display: inline-block;
  background: rgba(43, 127, 255, 0.12);
  color: #2563eb;
  padding: 6px 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
  border: 1px solid rgba(43, 127, 255, 0.2);
}

.hero-title {
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
  color: #0f172a;
}

.text-gradient {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.hero-subtitle {
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  line-height: 1.5;
  color: #475569;
  max-width: 30rem;
  margin: 0 0 1.75rem;
}

.hero-action {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 1.75rem;
}

.hero-bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #334155;
  font-size: 0.98rem;
  font-weight: 500;
}

/* Visual: keep shells from causing horizontal scroll */
.hero-visual {
  position: relative;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
}

.hero-phone {
  position: absolute;
  right: -28px;
  bottom: -48px;
  transform: scale(0.72);
  transform-origin: bottom right;
  filter: drop-shadow(0 24px 40px rgba(15, 23, 42, 0.28));
  pointer-events: none;
}

/* Show the browser miniature on desktop, the iPhone miniature on mobile. */
.viz-desktop { display: block; }
.viz-phone { display: none; justify-content: center; }
.viz-desktop { position: relative; }

/* ---------- SHARED FEATURE SPLITS ---------- */
.feature-section {
  padding: clamp(3rem, 7vw, 5.5rem) 0;
  background: #ffffff;
}

.feature-section--alt {
  background:
    radial-gradient(800px 500px at 0% 0%, rgba(99, 102, 241, 0.06), transparent 60%),
    radial-gradient(800px 500px at 100% 100%, rgba(124, 95, 211, 0.07), transparent 60%),
    #fbfaff;
}

.split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}

/* Centered copy band (used where a repeated miniature would be redundant) */
.feature-band {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}
.feature-band .split-actions {
  justify-content: center;
}
.feature-band p {
  margin-left: auto;
  margin-right: auto;
}

.split--reverse .split-copy {
  order: 2;
}
.split--reverse .split-visual {
  order: 1;
}

.split-copy {
  min-width: 0;
}

.split-copy h2 {
  font-size: clamp(1.8rem, 3.5vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0 0 0.75rem;
  color: #0f172a;
}

.split-copy p {
  font-size: 1.1rem;
  line-height: 1.55;
  color: #475569;
  margin: 0 0 1.5rem;
  max-width: 30rem;
}

.split-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.split-visual {
  min-width: 0;
  display: flex;
  justify-content: center;
  /* Let the shell's drop shadow/rounded edges show; the page root already
     has overflow-x: hidden so this won't create horizontal scroll. */
  overflow: visible;
}

.eyebrow {
  display: inline-block;
  font-weight: 700;
  font-size: 0.82rem;
  padding: 5px 13px;
  border-radius: 999px;
  margin-bottom: 1rem;
}
.eyebrow--blue {
  background: rgba(43, 127, 255, 0.1);
  color: #2563eb;
}
.eyebrow--violet {
  background: rgba(124, 95, 211, 0.12);
  color: #6d28d9;
}

/* ---------- HIGHLIGHTS ---------- */
.highlights-section {
  padding: clamp(3rem, 6vw, 4.5rem) 0;
  background: #f4f9ff;
}

.section-head {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 2.5rem;
}
.section-head h2 {
  font-size: clamp(1.8rem, 3.5vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin: 0 0 0.5rem;
}
.section-head p {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.highlight {
  padding: 1.5rem;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.highlight:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.1);
}
.highlight-emoji {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}
.highlight h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: #0f172a;
}
.highlight p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* ---------- TEMPLATES ---------- */
.templates-section {
  padding: clamp(3rem, 6vw, 4.5rem) 0;
  background: #ffffff;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.template-card {
  padding: 1.25rem;
  cursor: pointer;
  border-top: 4px solid #2563eb;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  text-align: left;
}
.template-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.1);
}
.template-card--custom {
  border-top: 4px solid #9333ea;
}
.template-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}
.template-name {
  font-weight: 700;
  font-size: 1.02rem;
  color: #0f172a;
  margin-bottom: 0.25rem;
}
.template-desc {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.4;
}

/* ---------- FINAL CTA ---------- */
.cta-section {
  padding: clamp(3rem, 6vw, 5rem) 0;
  background:
    radial-gradient(700px 400px at 50% 0%, rgba(43, 127, 255, 0.14), transparent 60%),
    #eaf4ff;
}
.cta-inner {
  text-align: center;
}
.cta-title {
  font-size: clamp(1.9rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin: 0 0 0.75rem;
}
.cta-description {
  font-size: 1.1rem;
  color: #475569;
  margin: 0 auto 2rem;
  max-width: 32rem;
  line-height: 1.5;
}
.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 900px) {
  .hero-grid,
  .split {
    grid-template-columns: 1fr;
  }
  .split--reverse .split-copy,
  .split--reverse .split-visual {
    order: initial;
  }
  .hero-copy,
  .split-copy {
    text-align: center;
  }
  .hero-subtitle,
  .split-copy p,
  .hero-bullets {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-bullets {
    align-items: flex-start;
    width: max-content;
    max-width: 100%;
  }
  .hero-action,
  .split-actions {
    justify-content: center;
  }
  /* On mobile show the iPhone miniature instead of the desktop browser one */
  .viz-desktop {
    display: none;
  }
  .viz-phone {
    display: flex;
  }
  .hero-visual {
    overflow: hidden;
  }
}

@media (max-width: 520px) {
  .hero-action,
  .split-actions,
  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  .hero-bullets {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .highlight,
  .template-card {
    transition: none;
  }
}
</style>
