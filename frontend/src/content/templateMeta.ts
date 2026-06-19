import templates from '@/templates.json';
import { slugify } from '@/utils/seo';

export interface TemplateColumn {
  name: string;
  color: string;
  description: string;
  is_action_column: boolean;
  icon?: string;
}

export interface TemplateRecord {
  name: string;
  shortDescription: string;
  description: string;
  columns: TemplateColumn[];
}

export interface TemplateMeta extends TemplateRecord {
  slug: string;
  emoji: string;
  displayName: string;
  longSummary: string;
  bestFor: string[];
  facilitatorTips: string[];
  steps: Array<{ title: string; detail: string }>;
  related: string[];
}

const rawTemplates = templates as TemplateRecord[];

const emojiOf = (name: string) => name.split(' ')[0] || '✨';
const titleOf = (name: string) => name.split(' ').slice(1).join(' ').trim() || name;

const enrichmentDefaults = {
  bestFor: [
    'Agile sprint retrospectives',
    'Cross-functional product teams',
    'Distributed and remote teams',
    'Quarterly business reviews'
  ],
  facilitatorTips: [
    'Set the stage: remind the team of the prime directive and that the retro is a safe space.',
    'Time-box each column to 5-7 minutes so quieter voices have room to contribute.',
    'Cluster related stickies before discussion - patterns surface faster than individual notes.',
    'Convert the top two themes into SMART action items with explicit owners and due dates.'
  ],
  steps: [
    { title: 'Open the retro', detail: 'Welcome the team, share the goal, and review the prime directive.' },
    { title: 'Gather input', detail: 'Give each person 5-7 minutes per column to add stickies asynchronously or silently.' },
    { title: 'Discuss & cluster', detail: 'Group similar notes, vote on the themes that matter most this iteration.' },
    { title: 'Decide actions', detail: 'Turn the top themes into 1-3 SMART action items with owners and timelines.' },
    { title: 'Close & summarize', detail: 'Use reAItro to generate a one-click summary and action item list to share.' }
  ]
};

const overrides: Record<string, Partial<TemplateMeta>> = {
  'daki-framework': {
    bestFor: ['Process-improvement retros', 'Teams adopting new practices', 'Mid-sprint course corrections', 'Newly formed squads']
  },
  'energy-levels': {
    bestFor: ['Burnout prevention check-ins', 'Quarterly wellbeing retros', 'Workload rebalancing sessions', 'Pair / mob rotation planning']
  },
  'mountain-climber': {
    bestFor: ['Post-launch retros', 'Hardening or stabilization sprints', 'Long-running initiatives', 'Teams celebrating wins']
  },
  'glad-sad-mad': {
    bestFor: ['Teams trying retros for the first time', 'Short 30-minute retros', 'Mood / morale check-ins', 'Conflict resolution kick-offs']
  },
  'start-stop-continue': {
    bestFor: ['Quick weekly retros', 'Onboarding new team members to retros', 'Working agreement refreshes', 'Process tune-ups']
  },
  '4ls-framework': {
    bestFor: ['Project / release post-mortems', 'Quarterly reviews', 'Cross-team retros', 'Strategy / OKR check-ins']
  },
  'hot-air-balloon': {
    bestFor: ['Vision-setting retros', 'Quarterly strategy reviews', 'Roadmap kick-offs', 'Teams that enjoy metaphors']
  },
  'sailboat': {
    bestFor: ['Visionary product teams', 'Goal-oriented quarterly retros', 'Cross-functional alignment', 'Pre-roadmap retros']
  },
  'three-little-pigs': {
    bestFor: ['Architecture and tech-debt retros', 'Reliability / SRE retros', 'Resilience and risk reviews', 'Teams discussing rework']
  },
  'speed-car': {
    bestFor: ['Velocity-focused sprint retros', 'Throughput / flow improvement', 'Removing blockers', 'Engineering productivity retros']
  },
  'movie-night': {
    bestFor: ['Fun end-of-quarter retros', 'Team-bonding retros', 'Creative or marketing teams', 'After offsites']
  },
  'space-mission': {
    bestFor: ['Big launches', 'Innovation / discovery retros', 'Teams shipping ambitious features', 'Programs spanning multiple squads']
  },
  'gym-session': {
    bestFor: ['Engineering excellence retros', 'Skill-building retrospectives', 'Habit-formation sprints', 'Long-term improvement programs']
  },
  'video-game': {
    bestFor: ['Gamers and gamified teams', 'Hackathon retros', 'Innovation sprints', 'Energizing tired teams']
  },
  'kitchen-nightmares': {
    bestFor: ['Quality-focused retros', 'Incident post-mortems', 'Bug-bash retros', 'Customer-impact reviews']
  },
  'wizard-school': {
    bestFor: ['Onboarding and learning retros', 'Mentorship-heavy teams', 'Skill-mapping retros', 'Career-development conversations']
  },
  'katappas-blade-retro': {
    bestFor: ['Indian-cinema-loving teams', 'Bold turning-point retros', 'Loyalty-and-trust retros', 'Team-bonding sessions']
  },
  'danger-zone-retro': {
    bestFor: ['Risk-heavy projects', 'Pre-launch readiness reviews', 'Incident response retros', 'High-stakes initiatives']
  },
  'marauders-map-retro': {
    bestFor: ['Discovery-heavy projects', 'Cross-team alignment', 'Knowledge-sharing retros', 'Harry Potter fans']
  },
  'titanic-retro': {
    bestFor: ['Post-mortem retros', 'Risk-management reviews', 'Cautionary-tale retros', 'Teams reviewing failed initiatives']
  }
};

export const templateMetas: TemplateMeta[] = rawTemplates.map((tpl, index) => {
  const displayName = titleOf(tpl.name);
  const slug = slugify(displayName);
  const enrichment = overrides[slug] ?? {};
  return {
    ...tpl,
    slug,
    emoji: emojiOf(tpl.name),
    displayName,
    longSummary:
      enrichment.longSummary ??
      `${tpl.description} The ${displayName} retrospective is one of the most loved formats inside reAItro - facilitated in minutes, with AI-generated summaries and action items at the end.`,
    bestFor: enrichment.bestFor ?? enrichmentDefaults.bestFor,
    facilitatorTips: enrichment.facilitatorTips ?? enrichmentDefaults.facilitatorTips,
    steps: enrichment.steps ?? enrichmentDefaults.steps,
    related: enrichment.related ?? rawTemplates
      .filter((other, otherIndex) => otherIndex !== index)
      .slice(0, 4)
      .map(other => slugify(titleOf(other.name)))
  };
});

export function findTemplateBySlug(slug: string): TemplateMeta | undefined {
  return templateMetas.find(t => t.slug === slug);
}

export function templatePath(slug: string): string {
  return `/templates/${slug}`;
}
