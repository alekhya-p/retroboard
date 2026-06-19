<template>
  <AppPage variant="marketing" class="ib-page">
    <!-- Hero -->
    <section class="ib-hero">
      <div class="ib-hero-inner">
        <span class="ib-eyebrow">
          <span class="ib-eyebrow-dot"></span>
          Free interactive tool · {{ totalQuestions }} questions
        </span>
        <h1>Retro Icebreaker Questions</h1>
        <p class="ib-lede">
          A free, hand-picked library of {{ totalQuestions }} icebreaker questions for retrospectives,
          stand-ups and team meetings - grouped into {{ categories.length }} categories. Hit the dice for a
          random prompt, filter by mood, and copy your favourite straight into your next meeting.
        </p>

        <!-- Random picker -->
        <div class="ib-pick">
          <button type="button" class="btn btn--primary ib-pick-btn" @click="pickRandom">
            🎲 Random question
          </button>
          <div class="ib-pick-card surface" aria-live="polite">
            <span class="ib-pick-cat">{{ current.category }}</span>
            <p class="ib-pick-text">{{ current.question }}</p>
            <button type="button" class="btn btn--ghost btn--sm ib-copy" @click="copyCurrent">
              {{ copied ? '✓ Copied' : 'Copy' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Category filter chips -->
    <section class="ib-filter">
      <div class="ib-filter-inner">
        <span class="ib-filter-label">Jump to a category</span>
        <div class="ib-chips">
          <button
            type="button"
            class="ib-chip"
            :class="{ 'ib-chip--active': activeCategory === null }"
            @click="setActive(null)"
          >All</button>
          <button
            v-for="group in library"
            :key="group.category"
            type="button"
            class="ib-chip"
            :class="{ 'ib-chip--active': activeCategory === group.category }"
            @click="setActive(group.category)"
          >{{ group.emoji }} {{ group.category }}</button>
        </div>
      </div>
    </section>

    <!-- Intro copy for SEO -->
    <section class="ib-intro">
      <div class="ib-intro-inner">
        <h2>How to use icebreaker questions in a retrospective</h2>
        <p>
          A good icebreaker takes 3-5 minutes at the top of a meeting and gets every voice in the room
          before the real conversation starts. For retrospectives in particular, a quick check-in lowers
          the stakes, surfaces how people are actually feeling about the sprint, and makes it far more
          likely that quieter teammates will speak up later. Pick one question, go round the team, and keep
          answers short. Below you'll find {{ totalQuestions }} questions across {{ categories.length }}
          categories - from sprint-focused prompts to fun, silly warm-ups and one-word check-ins for remote
          teams.
        </p>
      </div>
    </section>

    <!-- Question library -->
    <section class="ib-library">
      <div class="ib-library-inner">
        <article
          v-for="group in visibleLibrary"
          :id="group.slug"
          :key="group.category"
          class="ib-cat surface"
        >
          <header class="ib-cat-head">
            <h2><span class="ib-cat-emoji" aria-hidden="true">{{ group.emoji }}</span> {{ group.category }}</h2>
            <p>{{ group.blurb }}</p>
          </header>
          <ol class="ib-q-list">
            <li v-for="q in group.questions" :key="q" class="ib-q">
              <span class="ib-q-text">{{ q }}</span>
              <button
                type="button"
                class="ib-q-copy"
                :aria-label="`Copy question: ${q}`"
                @click="copyQuestion(group.category, q)"
              >Copy</button>
            </li>
          </ol>
        </article>
      </div>
    </section>

    <!-- CTA -->
    <section class="ib-cta">
      <div class="ib-cta-inner surface">
        <h2>Run your whole retro in one place - for free</h2>
        <p>
          reAItro is a free AI-powered retrospective tool. Start a board from 20+ templates, let the AI
          summarise discussion and group sticky notes, and warm the team up with a built-in
          <strong>AI icebreaker</strong> that writes a fresh question for your team every time. Want something
          livelier? <strong>Meeting Roulette</strong> spins through quick-fire prompts and mini team games.
        </p>
        <div class="ib-cta-actions">
          <router-link to="/boards/templates" class="btn btn--primary">Run a free retro</router-link>
          <router-link to="/play" class="btn btn--secondary">🎡 Try Meeting Roulette</router-link>
          <router-link to="/ai-generator" class="btn btn--ghost">Generate a custom template →</router-link>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="ib-faq">
      <div class="ib-faq-inner">
        <h2>Frequently asked questions</h2>
        <div v-for="item in faq" :key="item.q" class="ib-faq-item surface">
          <h3>{{ item.q }}</h3>
          <p>{{ item.a }}</p>
        </div>
      </div>
    </section>

    <AppFooter />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppFooter from '@/components/AppFooter.vue';
import AppPage from '@/components/ui/AppPage.vue';
import { applyHead, breadcrumbJsonLd, SITE_URL, slugify } from '@/utils/seo';

interface Category {
  category: string;
  emoji: string;
  blurb: string;
  questions: string[];
}

const categories: Category[] = [
  {
    category: 'Sprint & work',
    emoji: '🏃',
    blurb: 'Get the team thinking about the sprint before you dig into what went well and what didn\'t.',
    questions: [
      'In one word, how would you describe this sprint?',
      'What was the highlight of your sprint?',
      'What is one thing that surprised you this sprint?',
      'If this sprint were a weather forecast, what would it be?',
      'What is one small win you are proud of?',
      'What slowed you down the most this week?',
      'What is one thing you would do differently if we replayed the sprint?',
      'On a scale of 1 to 10, how confident are you we will hit our goals?',
      'What did you learn this sprint that you did not know before?',
      'What is one thing the team should keep doing?',
      'Which task did you enjoy the most, and why?',
      'What is one blocker you wish we had removed sooner?',
      'If you could give this sprint a movie title, what would it be?',
      'What is one decision you are glad we made?'
    ]
  },
  {
    category: 'Get to know you',
    emoji: '🤝',
    blurb: 'Build trust and connection - perfect for new or growing teams that are still gelling.',
    questions: [
      'What is a skill you have outside of work that most people don\'t know about?',
      'What is the best piece of advice you have ever been given?',
      'If you could have dinner with anyone, living or dead, who would it be?',
      'What is something you are looking forward to this month?',
      'What was your first ever job?',
      'What is a hobby you have picked up (or want to pick up)?',
      'What is your go-to comfort food?',
      'If you could instantly master one new skill, what would it be?',
      'What is a place you have always wanted to travel to?',
      'What is one app or tool you could not live without?',
      'What did you want to be when you were a kid?',
      'What is your favourite way to recharge after a busy week?',
      'What is a book, show, or podcast you would recommend right now?',
      'What is one thing on your bucket list?'
    ]
  },
  {
    category: 'Fun & silly',
    emoji: '🎉',
    blurb: 'Low-stakes, light-hearted prompts to break tension and get everyone laughing.',
    questions: [
      'If you were a kitchen appliance, which one would you be?',
      'Pineapple on pizza: yes or no, and defend your answer.',
      'What is the most useless talent you have?',
      'If you had to eat one meal for the rest of your life, what would it be?',
      'What fictional character would you most like to swap lives with for a day?',
      'If animals could talk, which would be the rudest?',
      'What is the weirdest food combination you secretly love?',
      'If you could rename your job title to anything, what would it be?',
      'You can have any superpower, but it only works on Mondays - what is it?',
      'What song do you know every word to, whether you like it or not?',
      'If our team had a mascot, what should it be?',
      'What is the strangest thing you believed as a child?',
      'Cereal: is it soup? Make your case.',
      'If you could add one ridiculous rule to the office, what would it be?'
    ]
  },
  {
    category: 'Remote team',
    emoji: '🏠',
    blurb: 'Connection prompts designed for distributed teams who don\'t share a coffee machine.',
    questions: [
      'Show us one thing within arm\'s reach of your desk right now.',
      'What does your ideal home-office setup look like?',
      'What time zone are you in, and what is the weather like there?',
      'What is your favourite background noise while you work?',
      'What is one ritual that helps you start your workday?',
      'What is the best snack you keep at your desk?',
      'If you could work from anywhere in the world for a week, where would it be?',
      'What is your go-to outfit for video calls (be honest)?',
      'What is one thing you miss about working in an office - and one thing you don\'t?',
      'What is your favourite way to take a break during the day?',
      'Who or what interrupts your focus the most at home?',
      'What is one tool that makes remote work easier for you?',
      'What is your unofficial "I\'m done for the day" signal?'
    ]
  },
  {
    category: 'New joiners / onboarding',
    emoji: '🌱',
    blurb: 'Welcome new teammates and help the group learn about each other quickly.',
    questions: [
      'What is one thing you hope to learn in your first month here?',
      'What is a question you still feel a bit nervous to ask?',
      'What helped you most in your first week?',
      'What is one thing about how this team works that surprised you?',
      'Who has been especially helpful so far, and how?',
      'What is one piece of jargon you have heard that you would like explained?',
      'What did your previous team do well that we could borrow?',
      'What kind of work makes you lose track of time?',
      'How do you prefer to receive feedback?',
      'What is one thing we should know to help you do your best work?',
      'What is a small thing that would make you feel more settled here?',
      'What are you most excited to work on?',
      'What does a great day at work look like for you?'
    ]
  },
  {
    category: 'Quick one-word',
    emoji: '⚡',
    blurb: 'Fast check-ins when you only have a minute - one word per person, round the room.',
    questions: [
      'Describe your current energy level in one word.',
      'One word for how you feel about our roadmap.',
      'One word that sums up your week.',
      'Pick one word for the team\'s mood right now.',
      'One word for what you need more of this sprint.',
      'One word for what you are grateful for today.',
      'One word for how focused you feel right now.',
      'One word to describe our last release.',
      'One word for what you want to leave behind from last sprint.',
      'One word for your biggest priority this week.',
      'One word for how you are arriving to this meeting.',
      'One word for what success looks like this quarter.',
      'One word for the vibe of our last retro.',
      'One word for what would make tomorrow great.'
    ]
  }
];

const library = computed(() =>
  categories.map(c => ({ ...c, slug: slugify(c.category) }))
);

const totalQuestions = computed(() =>
  categories.reduce((sum, c) => sum + c.questions.length, 0)
);

const activeCategory = ref<string | null>(null);

const visibleLibrary = computed(() => {
  if (activeCategory.value === null) return library.value;
  return library.value.filter(g => g.category === activeCategory.value);
});

const setActive = (category: string | null) => {
  activeCategory.value = category;
  if (category !== null) {
    // Defer so the filtered DOM is in place before we scroll.
    requestAnimationFrame(() => {
      document.getElementById(slugify(category))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
};

const current = ref<{ category: string; question: string }>({
  category: categories[0].category,
  question: categories[0].questions[0]
});
const copied = ref(false);

// Remember what we've already shown this session so the random button cycles
// through the whole pool before repeating, instead of landing on the same
// question twice in a row.
const shownQuestions = ref<Set<string>>(new Set());

const pickRandom = () => {
  // Respect the active category filter when one is selected.
  const pool = activeCategory.value
    ? categories.filter(c => c.category === activeCategory.value)
    : categories;

  // Build the flat list of candidate questions for the active pool.
  const candidates: { category: string; question: string }[] = [];
  for (const group of pool) {
    for (const question of group.questions) {
      candidates.push({ category: group.category, question });
    }
  }

  // Prefer questions we haven't shown yet this session; once the pool is
  // exhausted, reset and start a fresh cycle.
  let remaining = candidates.filter(c => !shownQuestions.value.has(c.question));
  if (remaining.length === 0) {
    shownQuestions.value.clear();
    remaining = candidates.filter(c => c.question !== current.value.question) || candidates;
    if (remaining.length === 0) remaining = candidates;
  }

  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  shownQuestions.value.add(pick.question);
  current.value = { category: pick.category, question: pick.question };
  copied.value = false;
};

const copyText = async (text: string) => {
  try {
    await navigator.clipboard?.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const copyCurrent = async () => {
  if (await copyText(current.value.question)) {
    copied.value = true;
    setTimeout(() => (copied.value = false), 1800);
  }
};

const copyQuestion = (category: string, question: string) => {
  current.value = { category, question };
  void copyText(question);
};

const faq = [
  {
    q: 'What are icebreaker questions?',
    a: 'Icebreaker questions are short, easy-to-answer prompts used at the start of a meeting to help people relax, connect and start talking. In a retrospective they act as a quick check-in that gets everyone\'s voice in the room before the main discussion.'
  },
  {
    q: 'What makes a good retro icebreaker question?',
    a: 'A good icebreaker is quick to answer, inclusive of everyone regardless of role, and either light-hearted or gently relevant to the sprint. Avoid anything that puts people on the spot or requires a "right" answer - the goal is warm-up, not assessment.'
  },
  {
    q: 'How long should an icebreaker take?',
    a: 'Keep it to 3-5 minutes for most teams. Pick one question, ask everyone to keep answers to a sentence or two, and go round the group. One-word check-ins are great when you are short on time.'
  },
  {
    q: 'Are these icebreaker questions free to use?',
    a: 'Yes. Every question on this page is free to use in your meetings, stand-ups and retrospectives. You can copy any question with one click and paste it into your tool of choice.'
  },
  {
    q: 'Can reAItro generate icebreaker questions automatically?',
    a: 'Yes. reAItro includes an AI icebreaker that writes a fresh question for your team, plus Meeting Roulette for quick-fire prompts and games. Both are free, and you can also run a full AI-powered retrospective from 20+ ready-made templates.'
  }
];

onMounted(() => {
  applyHead({
    title: '100+ Retro Icebreaker Questions - Free Team Icebreaker Generator | reAItro',
    description:
      'A free library of 80+ retro icebreaker questions for meetings, stand-ups and team retrospectives. Pick a random question, filter by category and copy it in one click. No sign-up.',
    keywords:
      'retro icebreaker questions, icebreaker questions for meetings, team icebreaker questions, retrospective icebreaker, icebreaker generator, remote team icebreakers, one word check-in questions',
    canonical: `${SITE_URL}/retro-icebreaker-questions`,
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Retro Icebreaker Questions', path: '/retro-icebreaker-questions' }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Retro Icebreaker Question Generator',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description:
          'Free interactive icebreaker question generator with 80+ curated questions for retrospectives and team meetings.'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      }
    ]
  });
});
</script>

<style scoped>
.ib-page { width: 100%; }

/* Hero */
.ib-hero {
  background:
    radial-gradient(900px 320px at 100% 0%, rgba(56,189,248,0.16), transparent 60%),
    radial-gradient(700px 280px at 0% 100%, rgba(168,85,247,0.14), transparent 60%),
    linear-gradient(135deg, #0f766e 0%, #1e3a8a 55%, #0f172a 100%);
  border-radius: 24px;
  margin: 0 auto 28px;
  max-width: 1180px;
  color: #fff;
  padding: 52px 36px;
  overflow: hidden;
}
.ib-hero-inner { max-width: 820px; }
.ib-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.24);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  margin-bottom: 18px;
}
.ib-eyebrow-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 4px rgba(52,211,153,0.25);
}
.ib-hero h1 {
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
}
.ib-lede {
  color: rgba(241,245,249,0.88);
  font-size: 1.08rem;
  line-height: 1.55;
  max-width: 700px;
  margin: 0 0 24px;
}

/* Random picker */
.ib-pick {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 620px;
}
.ib-pick-btn { align-self: flex-start; font-size: 1.02rem; }
.ib-pick-card {
  position: relative;
  background: rgba(255,255,255,0.97);
  border-radius: 18px;
  padding: 22px 22px 18px;
  color: #0f172a;
}
.ib-pick-cat {
  display: inline-block;
  background: rgba(15,118,110,0.12);
  color: #0f766e;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
}
.ib-pick-text {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  color: #0f172a;
  margin: 0 0 12px;
}
.ib-copy { align-self: flex-start; }

/* Filter chips */
.ib-filter { max-width: 1180px; margin: 0 auto 24px; }
.ib-filter-label {
  display: block;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: #64748b;
  margin: 0 0 10px;
}
.ib-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ib-chip {
  background: rgba(15,118,110,0.07);
  color: #0f766e;
  border: 1px solid rgba(15,118,110,0.2);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, transform 0.15s;
}
.ib-chip:hover { background: rgba(15,118,110,0.14); transform: translateY(-1px); }
.ib-chip--active {
  background: #0f766e;
  color: #fff;
  border-color: #0f766e;
}

/* Intro */
.ib-intro { max-width: 880px; margin: 0 auto 32px; }
.ib-intro-inner h2 { font-size: 1.5rem; margin: 0 0 10px; color: #0f172a; }
.ib-intro-inner p { color: #475569; line-height: 1.65; margin: 0; font-size: 1rem; }

/* Library */
.ib-library { max-width: 1180px; margin: 0 auto 44px; }
.ib-library-inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 18px;
}
.ib-cat {
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 4px 18px -10px rgba(15,23,42,0.12);
}
.ib-cat-head h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  margin: 0 0 4px;
  color: #0f172a;
}
.ib-cat-emoji { font-size: 1.3rem; }
.ib-cat-head p { color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0 0 14px; }
.ib-q-list {
  list-style: decimal;
  padding-left: 22px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ib-q {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  color: #1e293b;
  line-height: 1.5;
  font-size: 0.96rem;
}
.ib-q-text { flex: 1; }
.ib-q-copy {
  flex-shrink: 0;
  background: transparent;
  border: 1px solid rgba(15,118,110,0.25);
  color: #0f766e;
  border-radius: 8px;
  padding: 2px 9px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  opacity: 0.65;
  transition: opacity 0.15s, background 0.15s;
}
.ib-q-copy:hover { opacity: 1; background: rgba(15,118,110,0.08); }

/* CTA */
.ib-cta { max-width: 1180px; margin: 0 auto 44px; }
.ib-cta-inner {
  background: linear-gradient(135deg, #0f766e 0%, #1e3a8a 100%);
  border-radius: 22px;
  padding: 36px 32px;
  color: #fff;
  text-align: center;
}
.ib-cta-inner h2 { font-size: 1.6rem; margin: 0 0 10px; }
.ib-cta-inner p {
  color: rgba(241,245,249,0.9);
  line-height: 1.6;
  max-width: 720px;
  margin: 0 auto 22px;
  font-size: 1rem;
}
.ib-cta-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* FAQ */
.ib-faq { max-width: 880px; margin: 0 auto 48px; }
.ib-faq h2 { font-size: 1.6rem; margin: 0 0 16px; color: #0f172a; }
.ib-faq-item {
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 10px;
}
.ib-faq-item h3 { margin: 0 0 6px; font-size: 1.02rem; color: #0f172a; }
.ib-faq-item p { margin: 0; color: #475569; line-height: 1.55; font-size: 0.95rem; }

@media (max-width: 900px) {
  .ib-hero { padding: 36px 22px; }
  .ib-hero h1 { font-size: 2rem; }
  .ib-library-inner { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .ib-hero { border-radius: 18px; }
  .ib-pick-btn { width: 100%; }
  .ib-cta-actions .btn { width: 100%; justify-content: center; }
}
</style>
