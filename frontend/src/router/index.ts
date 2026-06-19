import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/design',
      name: 'design-system',
      component: () => import('@/views/StyleguideView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Design System · reAItro',
        description: 'Internal design-system showcase: buttons, surfaces, dialogs and bottom sheets.'
      }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Retrospective Tool · Free AI Retrospective Board & Templates | reAItro',
        description: 'The free AI retrospective tool for agile teams. Run real-time sprint retrospectives with 26 templates, AI-generated summaries, SMART action items and an AI template generator. No credit card.',
        keywords: 'retrospective, retrospective tool, AI retrospective, agile retrospective, sprint retrospective, scrum retrospective, retrospective board, online retrospective tool, free retrospective tool, retrospective template, AI retro, retro board, retrospective software, sprint retro, team retrospective'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { 
        requiresAuth: false,
        title: 'Login to Retroboard - Start Your Retrospective Journey',
        description: 'Sign in to Retroboard to create and manage your retrospective boards. Choose between Google authentication or guest access.',
        keywords: 'retrospective login, sign in, team collaboration, guest access'
      }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPasswordView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Reset your password · reAItro',
        description: 'Forgot your reAItro password? Enter your email and we\'ll send you a secure link to reset it.',
        keywords: 'retroboard password reset, forgot password, reset retrospective account'
      }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPasswordView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Choose a new password · reAItro',
        description: 'Set a new password for your reAItro account.',
        keywords: 'retroboard reset password, new password'
      }
    },
    {
      path: '/join-board',
      name: 'join-board',
      component: () => import('@/views/BoardJoinView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Join a Retrospective Board - Collaborate with Your Team',
        description: 'Join an existing retrospective board and contribute to your team\'s discussion. Real-time collaboration made easy.',
        keywords: 'join retrospective, team collaboration, board participation'
      }
    },
    {
      path: '/boards',
      name: 'boards',
      component: () => import('@/views/BoardsView.vue'),
      meta: { 
        requiresAuth: true, 
        requiresFullAuth: true,
        title: 'My Retrospective Boards - Manage Your Team Retros',
        description: 'Access and manage all your retrospective boards. Create new boards, view templates, and track team progress.',
        keywords: 'retrospective boards, team management, retro templates'
      }
    },
    {
      path: '/boards/templates',
      name: 'templates',
      component: () => import('@/views/TemplatesView.vue'),
      meta: { 
        requiresAuth: false,
        title: 'Retrospective Templates - AI-Powered Retro Board Templates',
        description: 'Browse and use our collection of AI-generated retrospective templates. Create custom templates with a simple prompt and get instant AI-powered insights.',
        keywords: 'retro templates, AI templates, retrospective formats, team templates, prompt-based retros, AI retro summary'
      }
    },
    {
      path: '/boards/create',
      name: 'create-board',
      component: () => import('@/views/CreateBoardView.vue'),
      meta: { 
        requiresAuth: true, 
        requiresFullAuth: true,
        title: 'Create New Retrospective Board - AI-Powered Templates & Summaries',
        description: 'Create a new retrospective board with AI-powered templates. Generate custom templates from prompts and get instant AI summaries of your retros.',
        keywords: 'create retrospective, new retro board, team retro setup, AI retro summary, prompt-based retros'
      }
    },
    {
      path: '/boards/:id/edit',
      name: 'edit-board',
      component: () => import('@/views/EditBoardView.vue'),
      meta: { 
        requiresAuth: true, 
        requiresFullAuth: true,
        title: 'Edit Retrospective Board - Customize Your Team Retro',
        description: 'Edit and customize your retrospective board settings. Manage templates, participants, and board configuration.',
        keywords: 'edit retrospective, customize retro, board settings'
      }
    },
    {
      path: '/boards/:id/games/:gameId?',
      name: 'board-games',
      component: () => import('@/views/BoardGamesView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Team Games - Play with Your Board | reAItro',
        description: 'Play live team mini-games with everyone on your retro board - Doodle Quest, Trivia, Emoji Tales and more.',
        keywords: 'team games, retro games, online team game, pictionary, team trivia'
      }
    },
    {
      path: '/boards/:id',
      name: 'board',
      component: () => import('@/views/BoardView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Retrospective Board - AI-Powered Team Collaboration Space',
        description: 'Collaborate with your team in real-time on your retrospective board. Share ideas, track progress, and generate AI summaries with a single click.',
        keywords: 'retrospective collaboration, team discussion, real-time retro, AI retro summary, prompt-based retros'
      }
    },
    {
      path: '/play',
      name: 'play-lobby',
      component: () => import('@/views/PlayLobbyView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Team Games - Standalone Mini Games for Remote Teams | reAItro',
        description: 'Doodle Quest, Trivia Race, Emoji Tales - standalone team mini-games. Create a room, share the link, play together. Free AI-powered fun for remote, offshore and onshore teams.',
        keywords: 'team games, online team games, remote team game, pictionary online, team trivia, team building games, doodle game, emoji game'
      }
    },
    {
      path: '/play/:id/:gameId?',
      name: 'play',
      component: () => import('@/views/PlayView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Game Room - Play with Your Team | reAItro',
        description: 'Join a real-time game room. Doodle Quest, Trivia, and Emoji Tales. Share the link to invite teammates.',
        keywords: 'game room, online pictionary, team trivia, online team game'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
      meta: {
        requiresAuth: false,
        title: 'About reAItro - Agile Retrospectives with AI',
        description: 'Learn about reAItro, our mission, vision, features, and commitment to empowering agile teams with AI-powered retrospectives.',
        keywords: 'about, reAItro, agile retrospectives, team collaboration, AI insights, templates, security'
      }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/Help.vue'),
      meta: {
        requiresAuth: false,
        title: 'Help & Support - reAItro',
        description: 'Find help, support, FAQs, and contact information for reAItro. Learn how to get started, privacy details, enterprise features, and more.',
        keywords: 'help, support, FAQ, reAItro, privacy, enterprise, contact'
      }
    },
    {
      path: '/templates/:slug',
      name: 'template-detail',
      component: () => import('@/views/TemplateDetailView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Retrospective Template - reAItro',
        description: 'Run this retrospective template with your team. Free, with real-time collaboration and one-click AI summaries.',
        keywords: 'retrospective template, retro format, agile retrospective, AI retrospective'
      }
    },
    {
      path: '/ai-generator',
      name: 'ai-generator',
      component: () => import('@/views/AiGeneratorView.vue'),
      meta: {
        requiresAuth: false,
        title: 'AI Retrospective Template Generator - reAItro',
        description: 'Generate a custom retrospective template from a single prompt with AI. Free, fast, no credit card.',
        keywords: 'AI retro generator, AI retrospective template, generative AI agile, retro generator'
      }
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Retrospective Blog - Guides for Agile Teams | reAItro',
        description: 'In-depth, practical writing on how to run better agile retrospectives - facilitation, AI summaries, action items, remote teams.',
        keywords: 'retrospective blog, agile blog, scrum retrospective guide, AI retrospective'
      }
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('@/views/BlogPostView.vue'),
      meta: {
        requiresAuth: false,
        title: 'reAItro Blog',
        description: 'Long-form retrospective and agile facilitation writing from the reAItro team.',
        keywords: 'agile blog post, retrospective article, scrum master tips'
      }
    },
    {
      path: '/ai-retrospective',
      name: 'landing-ai-retrospective',
      component: () => import('@/views/LandingPageView.vue'),
      meta: {
        requiresAuth: false,
        title: 'AI Retrospective - Free AI-Powered Sprint Retrospectives | reAItro',
        description: 'Run an AI retrospective in minutes. Free AI-powered sprint retrospective board with one-click summaries, SMART action items and an AI template generator.',
        keywords: 'AI retrospective, AI retro, AI sprint retrospective, AI agile retrospective, AI retrospective tool, generative AI retrospective'
      }
    },
    {
      path: '/free-retrospective-tool',
      name: 'landing-free-retrospective-tool',
      component: () => import('@/views/LandingPageView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Free Retrospective Tool - Real-Time Boards + AI Summaries | reAItro',
        description: 'A genuinely free retrospective tool for agile teams. Real-time boards, 26 templates, AI-generated summaries, SMART action items. No credit card.',
        keywords: 'free retrospective tool, free retro tool, free retrospective board, free online retrospective tool, free retrospective software'
      }
    },
    {
      path: '/sprint-retrospective',
      name: 'landing-sprint-retrospective',
      component: () => import('@/views/LandingPageView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Sprint Retrospective - Run Real-Time Sprint Retros with AI | reAItro',
        description: 'Everything you need to run a great sprint retrospective: 26 templates, real-time collaboration, AI summaries and SMART action items - free for agile teams.',
        keywords: 'sprint retrospective, sprint retro, sprint retrospective tool, sprint retrospective template, agile sprint retro'
      }
    },
    {
      path: '/scrum-retrospective',
      name: 'landing-scrum-retrospective',
      component: () => import('@/views/LandingPageView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Scrum Retrospective - Templates, Agenda & AI for Scrum Masters | reAItro',
        description: 'A complete scrum retrospective workflow - proven templates, a 75-minute agenda, facilitation tips and free AI summaries.',
        keywords: 'scrum retrospective, scrum retro, scrum master retrospective, scrum retrospective template, scrum retrospective tool'
      }
    },
    {
      path: '/retrospective-ideas',
      name: 'landing-retrospective-ideas',
      component: () => import('@/views/LandingPageView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Retrospective Ideas - 35+ Sprint Retro Ideas, Formats & Activities | reAItro',
        description: '35+ retrospective ideas, themed formats and activities to break the routine and re-energize your sprint retros.',
        keywords: 'retrospective ideas, sprint retrospective ideas, retro ideas, fun retrospective ideas, creative retrospective'
      }
    },
    {
      path: '/retrospective-games',
      name: 'landing-retrospective-games',
      component: () => import('@/views/LandingPageView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Retrospective Games - 5 Free AI Team Games for Sprint Retros | reAItro',
        description: 'Five free AI-powered team games that make sprint retrospectives engaging - Doodle Quest, Trivia, Emoji Tales and more. Great for remote and offshore teams.',
        keywords: 'retrospective games, retro games, fun retrospective games, team games for retrospectives, online retro games, sprint retrospective games'
      }
    },
    {
      path: '/remote-retrospective',
      name: 'landing-remote-retrospective',
      component: () => import('@/views/LandingPageView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Remote Retrospective - Run Engaging Distributed Sprint Retros | reAItro',
        description: 'Run engaging remote and distributed sprint retrospectives with real-time boards, anonymous input, AI summaries and team games. Free, no credit card.',
        keywords: 'remote retrospective, distributed retrospective, remote sprint retrospective, online retrospective for remote teams, async retrospective, offshore team retrospective'
      }
    },
    {
      path: '/easyretro-alternative',
      name: 'landing-easyretro-alternative',
      component: () => import('@/views/LandingPageView.vue'),
      meta: {
        requiresAuth: false,
        title: 'EasyRetro Alternative - Free AI Retrospective Tool | reAItro',
        description: 'Looking for an EasyRetro alternative? reAItro is a free, AI-first retrospective tool with summaries, action items, an AI template generator and team games.',
        keywords: 'EasyRetro alternative, EasyRetro free alternative, FunRetro alternative, alternative to EasyRetro, retro tool comparison'
      }
    },
    {
      path: '/parabol-alternative',
      name: 'landing-parabol-alternative',
      component: () => import('@/views/LandingPageView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Parabol Alternative - Free AI-Powered Retrospectives | reAItro',
        description: 'A free Parabol alternative for agile retrospectives - real-time boards, AI summaries, SMART action items, AI template generator and team games.',
        keywords: 'Parabol alternative, alternative to Parabol, free Parabol alternative, Parabol vs, retrospective tool comparison'
      }
    },
    {
      path: '/retrium-alternative',
      name: 'landing-retrium-alternative',
      component: () => import('@/views/LandingPageView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Retrium Alternative - Free Retrospective Tool with AI | reAItro',
        description: 'A free Retrium alternative for sprint retrospectives - templates, real-time collaboration, AI summaries and action items, plus team games.',
        keywords: 'Retrium alternative, alternative to Retrium, free Retrium alternative, Retrium vs, retro software comparison'
      }
    },
    {
      path: '/retro-icebreaker-questions',
      name: 'icebreaker-questions',
      component: () => import('@/views/IcebreakerToolView.vue'),
      meta: {
        requiresAuth: false,
        title: '100+ Retro Icebreaker Questions - Free Team Icebreaker Generator | reAItro',
        description: 'A free library of 100+ retro and team icebreaker questions, with a random question generator. Perfect for sprint retros, standups and remote teams.',
        keywords: 'retro icebreaker questions, icebreaker questions, team icebreaker questions, icebreaker questions for meetings, retrospective icebreaker, icebreaker generator'
      }
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Privacy Policy · reAItro',
        description: 'How reAItro collects, uses and protects your data - GDPR, AI processing, retention and your rights.',
        keywords: 'retroboard privacy policy, retrospective GDPR, AI retrospective privacy'
      }
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Terms of Service · reAItro',
        description: 'The terms governing your use of reAItro - account rules, AI features, liability and contact information.',
        keywords: 'retroboard terms of service, retrospective terms, AI tool terms'
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when navigating to a new route
    return { top: 0, behavior: 'smooth' }
  }
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialize auth if not already initialized
  if (!authStore.isAuthenticated && localStorage.getItem('token')) {
    await authStore.initializeAuth();
  }
  
  const isAuthenticated = authStore.isAuthenticated;
  const isAnonymousUser = isAuthenticated && authStore.user?.user_type === 'anonymous';
  const isFullAuthUser = isAuthenticated && !isAnonymousUser;

  // Update document title and meta tags
  document.title = to.meta.title as string || 'Retroboard';
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', to.meta.description as string);

  // Update meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', to.meta.keywords as string);

  // If user is not logged in, redirect to login page for any protected route
  if (!isAuthenticated && to.meta.requiresAuth) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // If user is anonymous and tries to access full auth routes
  if (isAnonymousUser && to.meta.requiresFullAuth) {
    useToast().info('Guests can join boards & games. Sign up to create your own boards or use AI features.', 6000);
    next('/join-board');
    return;
  }

  // Allow navigation in all other cases
  next();
});

export default router; 