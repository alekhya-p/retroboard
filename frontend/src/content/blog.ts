export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  tags: string[];
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    gradient: string;
  };
  toc: Array<{ id: string; label: string }>;
  body: string;
}

const baseAuthor = 'The reAItro Team';

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-run-an-agile-retrospective',
    title: 'How to Run an Agile Retrospective: A Complete Step-by-Step Guide (2026)',
    description:
      'Learn how to plan, facilitate and follow up on an agile retrospective that actually produces change. Covers prep, format selection, facilitation, AI-powered summaries and action tracking.',
    keywords:
      'how to run a retrospective, agile retrospective guide, sprint retro facilitation, retrospective template, AI retrospective, scrum retrospective steps',
    author: baseAuthor,
    publishedAt: '2026-04-21',
    updatedAt: '2026-05-12',
    readingMinutes: 12,
    tags: ['Facilitation', 'Agile', 'Retrospectives'],
    hero: {
      eyebrow: 'Pillar guide',
      title: 'How to run an agile retrospective that actually changes how your team works',
      subtitle:
        'A practical, opinionated walkthrough - from prep and prime directive to AI-generated summaries and follow-through.',
      gradient: 'linear-gradient(135deg,#6366f1 0%,#a855f7 55%,#ec4899 100%)'
    },
    toc: [
      { id: 'why-it-matters', label: 'Why retrospectives matter' },
      { id: 'before-the-retro', label: '1. Before the retro' },
      { id: 'choose-a-format', label: '2. Choose a format' },
      { id: 'facilitate', label: '3. Facilitate the session' },
      { id: 'ai-summary', label: '4. Use AI to summarize' },
      { id: 'action-items', label: '5. Drive action items home' },
      { id: 'pitfalls', label: 'Common pitfalls' },
      { id: 'faq', label: 'FAQ' }
    ],
    body: `
<h2 id="why-it-matters">Why retrospectives matter</h2>
<p>If you only had time for <em>one</em> agile ceremony, the retrospective would be it. Stand-ups synchronize, planning forecasts, demos celebrate - but the retro is where teams actually <strong>get better</strong>. It's the feedback loop that turns experience into improvement, and the single highest-leverage hour in your sprint.</p>
<p>And yet, most retros are forgettable. They turn into venting sessions, the same complaints come up sprint after sprint, and action items quietly die in a forgotten document. This guide will show you how to run a retro that breaks that cycle - using a clear five-step process and modern AI tooling like <strong>reAItro</strong> to do the heavy lifting on summaries and action items.</p>

<h2 id="before-the-retro">1. Before the retro: prep is half the battle</h2>
<h3>Pick the right cadence</h3>
<p>Most scrum teams run a retro at the end of every sprint - usually 60 to 90 minutes. Kanban or flow-based teams often pick a fixed cadence (every 2 weeks works well). Programs and leadership teams may want a longer quarterly retro on top of the regular ones.</p>
<h3>Set a clear goal</h3>
<p>A retro without a goal becomes a venting session. Pick one of these focuses for the session:</p>
<ul>
  <li><strong>Process</strong> - How are we working together? What should we change about ceremonies, hand-offs, or tooling?</li>
  <li><strong>Quality</strong> - What slipped, what broke, and how do we prevent it next time?</li>
  <li><strong>Delivery</strong> - What blocked flow? What does throughput look like?</li>
  <li><strong>People</strong> - How is the team feeling? Energy, wellbeing, growth, conflict.</li>
</ul>
<p>Communicate that focus when you send the invite. It will shape both your format choice and the team's mindset coming in.</p>

<h3>Share the prime directive</h3>
<blockquote>"Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given what they knew at the time, their skills and abilities, the resources available, and the situation at hand." - Norm Kerth</blockquote>
<p>Drop this into the invite and read it at the start. It's the single most effective tool for keeping retros constructive.</p>

<h2 id="choose-a-format">2. Choose a format that matches the goal</h2>
<p>Format choice is where retros come alive - or die. The classic "what went well / what didn't / what to improve" works, but after the fourth time in a row, your team will be on autopilot. Pick a format that matches both the <em>goal</em> for the session and the <em>energy</em> of the team.</p>
<ul>
  <li>Want process improvement? Try <strong>DAKI</strong> (Drop, Add, Keep, Improve) or <strong>Start / Stop / Continue</strong>.</li>
  <li>Need to surface risks? <strong>Sailboat</strong> or <strong>Hot Air Balloon</strong> visualize forces pulling you back and forward.</li>
  <li>Want to address morale? <strong>Glad / Sad / Mad</strong> or <strong>Energy Levels</strong> are short, emotionally honest, and effective.</li>
  <li>Post-incident or post-mortem? <strong>Three Little Pigs</strong> or <strong>Kitchen Nightmares</strong> evaluate the foundations of what failed.</li>
  <li>Big launch behind you? <strong>Space Mission</strong> or <strong>Mountain Climber</strong> celebrate and capture learnings.</li>
</ul>
<p>reAItro ships with twenty research-backed templates - and an AI generator that can invent a new one from a single sentence prompt ("a retro for the team that just finished hardening week, with a wrestling theme"). Use them.</p>

<h2 id="facilitate">3. Facilitate the session</h2>
<h3>Open (5 min)</h3>
<p>Welcome the team, restate the goal, read the prime directive, and run a quick check-in. A simple one-word feeling round ("how are you arriving?") snaps people present.</p>

<h3>Gather (10-15 min)</h3>
<p>Have everyone add stickies <em>silently</em> for the first portion. Silent writing is the most important facilitation tool you have - it prevents loud voices from dominating and gives introverts a fair shot. Time-box each column.</p>

<h3>Cluster and dot-vote (10 min)</h3>
<p>Group similar stickies. Patterns will jump out. Then dot-vote (each person gets 3-5 dots) on the items that matter most this sprint. Discuss only the top 2-3 themes.</p>

<h3>Discuss (15-25 min)</h3>
<p>Open a quick discussion on each high-vote theme. Keep it focused on the <em>system</em>, not individuals. Use the five whys when you feel the conversation getting shallow.</p>

<h3>Decide (10 min)</h3>
<p>Convert the top themes into 1-3 action items. Two well-owned action items beat ten that nobody owns.</p>

<h2 id="ai-summary">4. Use AI to summarize the retro</h2>
<p>The hardest part of a retro is usually <em>after</em> it ends - turning forty stickies and twenty minutes of discussion into a shareable summary. This is where AI changes the game.</p>
<p>reAItro's one-click <strong>summary generator</strong> reads every sticky, groups them by theme, captures the sentiment in each column, and produces a paragraph you can drop into Slack or the team wiki. The <strong>action item generator</strong> goes further: it extracts every concrete commitment surfaced during the retro and presents it as a SMART list.</p>
<p>That used to be 30 minutes of work for a Scrum Master. Now it's a single button - and the team gets the summary <em>before</em> they've left the room.</p>

<h2 id="action-items">5. Drive action items home</h2>
<p>Most retros fail at this step. The action items are agreed in the room, then disappear. Make them stick:</p>
<ol>
  <li>Every action has a <strong>single owner</strong>. "The team" is not an owner.</li>
  <li>Every action has a <strong>due date</strong>. By next retro at the latest.</li>
  <li>Pin the action list at the <strong>top of the next sprint's board</strong>.</li>
  <li>Review last sprint's actions for two minutes at the start of every new retro.</li>
</ol>

<h2 id="pitfalls">Common pitfalls to avoid</h2>
<ul>
  <li><strong>Same format every sprint.</strong> Engagement drops. Rotate formats every 2-3 retros.</li>
  <li><strong>Loud-voice dominance.</strong> Silent writing fixes 80% of this.</li>
  <li><strong>No follow-through.</strong> Track actions, don't just collect them.</li>
  <li><strong>No psychological safety.</strong> If people can't say hard things, your retro is theatre. Run a 1-on-1 round if you suspect this.</li>
  <li><strong>Letting it run long.</strong> A 60-minute retro is plenty. Cut discussion if you have to.</li>
</ul>

<h2 id="faq">FAQ</h2>
<p><strong>How long should a retrospective be?</strong> 60 minutes for a 2-week sprint, 90 for longer cadences. Quarterly retros can be half-day.</p>
<p><strong>Who should attend?</strong> The whole team that delivered the work. Avoid mixing in stakeholders unless the goal calls for it - psychological safety drops.</p>
<p><strong>Should the manager facilitate?</strong> Usually no. Rotate facilitation, or have a Scrum Master / agile coach lead. The manager's presence can dampen honesty.</p>
<p><strong>Remote vs in-person?</strong> Both work. Async retros work too if your team is fully distributed - reAItro is designed for both modes.</p>
`
  },
  {
    slug: 'how-ai-improves-retrospectives',
    title: 'How AI Improves Retrospectives: From Stickies to SMART Action Items in Seconds',
    description:
      'Discover how AI changes the way teams run retrospectives - from one-click summaries and action items to AI-generated custom templates and sentiment analysis.',
    keywords:
      'AI retrospective, AI retro summary, generative AI agile, retrospective automation, AI retrospectives, AI scrum master',
    author: baseAuthor,
    publishedAt: '2026-03-18',
    updatedAt: '2026-05-12',
    readingMinutes: 9,
    tags: ['AI', 'Agile', 'Productivity'],
    hero: {
      eyebrow: 'AI x Agile',
      title: 'How AI improves retrospectives - and quietly replaces three meetings',
      subtitle:
        'Generative AI is the biggest shift to agile facilitation since the sticky note. Here is what it actually changes.',
      gradient: 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 55%,#a855f7 100%)'
    },
    toc: [
      { id: 'before-and-after', label: 'Retros, before and after AI' },
      { id: 'summaries', label: 'AI-generated summaries' },
      { id: 'action-items', label: 'AI-extracted action items' },
      { id: 'custom-templates', label: 'AI-generated templates' },
      { id: 'sentiment', label: 'Sentiment & themes' },
      { id: 'concerns', label: 'Concerns and limits' },
      { id: 'getting-started', label: 'Getting started' }
    ],
    body: `
<h2 id="before-and-after">Retros, before and after AI</h2>
<p>For two decades, retrospectives have looked the same. A facilitator sets up sticky notes (paper or digital). The team writes silently, clusters, votes, discusses, agrees on actions. The Scrum Master spends thirty minutes after the retro writing it up. Action items vanish into the void.</p>
<p>AI doesn't just polish that workflow - it compresses it. Below are the four most useful applications of generative AI in retrospectives today.</p>

<h2 id="summaries">1. AI-generated summaries</h2>
<p>The most popular AI feature in retro tooling is the one-click summary. Feed the model every sticky from every column, plus the column headers, and ask it to produce a structured narrative. Done well, it returns:</p>
<ul>
  <li>An executive paragraph (3-4 sentences).</li>
  <li>Key themes per column.</li>
  <li>Tone / sentiment per column.</li>
  <li>Notable individual contributions (optional).</li>
</ul>
<p>reAItro uses an advanced large language model under the hood for this - fast enough that the summary appears before the team has stretched out of their chairs.</p>

<h2 id="action-items">2. AI-extracted action items</h2>
<p>Stickies aren't usually written as action items. They're observations, frustrations, and ideas. The AI re-reads the board and extracts every concrete commitment - even the ones buried in a sentence - and turns them into a SMART list with suggested owners.</p>
<p>The trick: action items work best when the team validates them in the last five minutes of the retro. Use AI for the first draft, not the final word.</p>

<h2 id="custom-templates">3. AI-generated custom templates</h2>
<p>Twenty standard formats cover most retros. But sometimes you need something specific - a retro themed around a movie your team loves, a launch you just shipped, or a particular risk you're worried about. Type a sentence; AI invents a fitting format with columns, colors, and prompts. <a href="/ai-generator">Try it here</a>.</p>

<h2 id="sentiment">4. Sentiment and theme detection</h2>
<p>An LLM can read the room better than most retros. Even simple sentiment tagging ("morale low in the planning column, energy high in delivery") highlights trends that would otherwise need a human pattern-matcher and a year of context.</p>
<p>Over time, sentiment trends sprint-over-sprint become an early warning system for burnout, friction, or misalignment.</p>

<h2 id="concerns">Concerns and limits</h2>
<ul>
  <li><strong>Privacy.</strong> Pick a tool whose terms forbid training on your data. reAItro calls its AI provider under a strict enterprise no-training agreement.</li>
  <li><strong>Authentic discussion.</strong> AI summarizes; humans still need to talk. The AI cannot replace the discussion phase - only the writeup.</li>
  <li><strong>Hallucinations.</strong> Always have a human read the summary before sharing. The retro itself is the ground truth.</li>
</ul>

<h2 id="getting-started">Getting started</h2>
<p>Run your next retro on <a href="/boards/templates">reAItro</a>. Pick a format. Generate a summary and action items at the end. Ship the writeup before the team has logged off. You won't go back.</p>
`
  },
  {
    slug: 'how-to-choose-a-retrospective-template',
    title: 'How to Choose the Right Retrospective Template for Your Team',
    description:
      'Stop running the same retro every sprint. A practical decision guide for choosing the right retrospective format based on team mood, sprint outcome, and what you want to change.',
    keywords:
      'retrospective template guide, retro format, sailboat retro, daki retro, glad sad mad, 4ls retro, choosing retrospective format',
    author: baseAuthor,
    publishedAt: '2026-02-09',
    updatedAt: '2026-05-12',
    readingMinutes: 8,
    tags: ['Templates', 'Facilitation'],
    hero: {
      eyebrow: 'Decision guide',
      title: 'How to pick the right retrospective template - without overthinking it',
      subtitle:
        'A quick-decision framework, plus the five formats that handle 80% of real-world retros.',
      gradient: 'linear-gradient(135deg,#22c55e 0%,#0ea5e9 60%,#6366f1 100%)'
    },
    toc: [
      { id: 'why-rotate', label: 'Why rotate templates' },
      { id: 'decision-tree', label: 'A simple decision tree' },
      { id: 'top-5', label: 'The five formats you actually need' },
      { id: 'edge-cases', label: 'Special cases' },
      { id: 'cheat-sheet', label: 'Cheat sheet' }
    ],
    body: `
<h2 id="why-rotate">Why rotating templates matters more than you think</h2>
<p>The fastest way to make a retro feel pointless is to run the same one every sprint. The team stops thinking and starts auto-filling columns. Rotating formats - even just every 2-3 sprints - re-engages the brain, surfaces issues that the old format hid, and signals that the retro itself is something you're still investing in.</p>

<h2 id="decision-tree">A simple decision tree</h2>
<p>Pick the format based on two variables: <em>what just happened</em> and <em>how the team is feeling</em>.</p>
<ul>
  <li>Routine sprint, team feels OK → <a href="/templates/start-stop-continue">Start / Stop / Continue</a> or <a href="/templates/daki-framework">DAKI</a>.</li>
  <li>Major launch / milestone behind you → <a href="/templates/space-mission">Space Mission</a> or <a href="/templates/mountain-climber">Mountain Climber</a>.</li>
  <li>Strategy or quarterly review → <a href="/templates/sailboat">Sailboat</a> or <a href="/templates/hot-air-balloon">Hot Air Balloon</a>.</li>
  <li>Morale check-in or visible friction → <a href="/templates/glad-sad-mad">Glad / Sad / Mad</a> or <a href="/templates/energy-levels">Energy Levels</a>.</li>
  <li>Post-mortem / incident → <a href="/templates/three-little-pigs">Three Little Pigs</a> or <a href="/templates/kitchen-nightmares">Kitchen Nightmares</a>.</li>
  <li>Need novelty / energy → <a href="/templates/video-game">Video Game</a>, <a href="/templates/marauders-map-retro">Marauder's Map</a>, or generate one with AI.</li>
</ul>

<h2 id="top-5">The five formats that handle 80% of retros</h2>
<h3>Start / Stop / Continue</h3>
<p>Three columns, no learning curve, perfect for a quick weekly retro or a team's first ever.</p>
<h3>DAKI</h3>
<p>Drop / Add / Keep / Improve. Slightly richer than Start / Stop / Continue - especially the "Improve" column, which forces nuance instead of binary keep/kill.</p>
<h3>4Ls</h3>
<p>Liked / Learned / Lacked / Longed-for. Great for project or release post-mortems.</p>
<h3>Sailboat</h3>
<p>Wind / anchors / rocks / island. The metaphor surfaces strategic forces (helps / hinders / risks / goals) much better than a flat format.</p>
<h3>Glad / Sad / Mad</h3>
<p>Three emotions. The simplest morale read your team will ever get. Don't underestimate it - emotionally honest retros change cultures.</p>

<h2 id="edge-cases">Special cases</h2>
<p><strong>Remote-only team?</strong> Async retros need formats with very clear column prompts. DAKI and 4Ls work best.</p>
<p><strong>Brand-new team?</strong> Run Glad / Sad / Mad. You'll get a baseline read on the people before you optimize the process.</p>
<p><strong>Team in conflict?</strong> Avoid action-heavy formats. Lean toward Energy Levels or a one-on-one round.</p>

<h2 id="cheat-sheet">Cheat sheet</h2>
<ul>
  <li>Default format if you're stuck: <strong>DAKI</strong>.</li>
  <li>Big celebration: <strong>Space Mission</strong>.</li>
  <li>Big concern: <strong>Sailboat</strong>.</li>
  <li>Mood check: <strong>Glad / Sad / Mad</strong>.</li>
  <li>Always something custom: <a href="/ai-generator"><strong>AI Generator</strong></a>.</li>
</ul>
`
  },
  {
    slug: 'retrospective-action-items-that-stick',
    title: 'Writing Retrospective Action Items That Actually Get Done',
    description:
      'Most retros generate action items that vanish by the next sprint. Here is how to write retro action items that are owned, tracked, and finished.',
    keywords:
      'retrospective action items, SMART action items, agile follow through, sprint retro action plan, retro accountability',
    author: baseAuthor,
    publishedAt: '2026-01-15',
    updatedAt: '2026-05-12',
    readingMinutes: 6,
    tags: ['Facilitation', 'Action items', 'Agile'],
    hero: {
      eyebrow: 'Follow-through',
      title: 'Writing action items that actually get done',
      subtitle:
        'A short, opinionated guide to ending the cycle of retro action items that nobody owns and nobody finishes.',
      gradient: 'linear-gradient(135deg,#f97316 0%,#ec4899 55%,#a855f7 100%)'
    },
    toc: [
      { id: 'why-they-die', label: 'Why most action items die' },
      { id: 'smart', label: 'Make them SMART' },
      { id: 'one-owner', label: 'One owner. Always.' },
      { id: 'review', label: 'Review them next time' },
      { id: 'ai', label: 'Let AI write the first draft' }
    ],
    body: `
<h2 id="why-they-die">Why most retro action items quietly die</h2>
<p>Action items get killed by three things: ambiguity ("we should improve our deployment"), shared ownership ("the team will look at it"), and never being looked at again. Fix those three, and 80% of your retros will start producing real change.</p>

<h2 id="smart">Make them SMART</h2>
<p>Specific, Measurable, Achievable, Relevant, Time-bound. Yes, the cliché works. Compare:</p>
<ul>
  <li><strong>Bad:</strong> "Improve the build pipeline."</li>
  <li><strong>Good:</strong> "Cut average CI time from 14 min to under 8 min by next sprint demo - owner: Priya."</li>
</ul>

<h2 id="one-owner">One owner. Always.</h2>
<p>If "the team" owns it, nobody does. Pick one person, even if they delegate. The owner is responsible for the outcome, not the work.</p>

<h2 id="review">Review last sprint's actions at the start of every retro</h2>
<p>This single ritual changes everything. Spend the first 2 minutes of every retro reviewing the previous sprint's actions. Public, low-pressure, but visible. The team will start finishing them on their own - because they know they'll be asked about them.</p>

<h2 id="ai">Let AI write the first draft</h2>
<p>reAItro's action item generator extracts every concrete commitment from your board and writes a draft SMART list. The team validates and adjusts in the last five minutes. You leave the retro with a complete, owned action plan - no homework for the facilitator.</p>
`
  },
  {
    slug: 'remote-and-async-retrospectives',
    title: 'Running Remote and Async Retrospectives That Don\'t Suck',
    description:
      'A practical playbook for facilitating remote, hybrid and async retrospectives - silent writing, voting, time zones, and AI summaries.',
    keywords:
      'remote retrospective, async retrospective, distributed team retro, hybrid retro, remote agile, online retrospective tool',
    author: baseAuthor,
    publishedAt: '2025-12-04',
    updatedAt: '2026-05-12',
    readingMinutes: 7,
    tags: ['Remote', 'Async', 'Facilitation'],
    hero: {
      eyebrow: 'Remote & async',
      title: 'Running remote and async retrospectives that don\'t suck',
      subtitle:
        'How distributed teams keep retros engaging - silent writing, async voting, time-zone-friendly formats, and AI summaries.',
      gradient: 'linear-gradient(135deg,#14b8a6 0%,#6366f1 55%,#a855f7 100%)'
    },
    toc: [
      { id: 'remote-pitfalls', label: 'Why remote retros struggle' },
      { id: 'live-remote', label: 'Live remote retros' },
      { id: 'async-retros', label: 'Async retros, step by step' },
      { id: 'tooling', label: 'Tooling checklist' },
      { id: 'ai-async', label: 'Where AI helps most' }
    ],
    body: `
<h2 id="remote-pitfalls">Why remote retros struggle</h2>
<p>Three classic failure modes: cameras off and zero engagement, the loudest voice runs the meeting, and time zones force someone to attend at 6 a.m. Each one is solvable.</p>

<h2 id="live-remote">Live remote retros (whole team online together)</h2>
<ul>
  <li>Open with a personal check-in - even one word forces presence.</li>
  <li>Silent writing first. Always. Cameras can stay off during this part.</li>
  <li>Cluster collaboratively, dot-vote, then discuss only the top 2-3 themes.</li>
  <li>End with action items and a one-click AI summary in chat.</li>
</ul>

<h2 id="async-retros">Async retros, step by step</h2>
<p>For distributed teams across time zones, async retros are often better than forcing a synchronous slot. Run them as a 2-3 day rolling event:</p>
<ol>
  <li><strong>Day 1:</strong> Facilitator opens the board, posts prompts, and shares the goal in the team channel.</li>
  <li><strong>Day 1-2:</strong> Team members add stickies whenever they have time. No live discussion yet.</li>
  <li><strong>Day 2:</strong> Voting opens. Each person gets 3-5 votes.</li>
  <li><strong>Day 2-3:</strong> Threaded discussion on the top themes - async in chat or in retro tool comments.</li>
  <li><strong>Day 3:</strong> Facilitator generates an AI summary and a draft action item list. The team confirms owners.</li>
</ol>

<h2 id="tooling">Tooling checklist</h2>
<ul>
  <li>Real-time collaborative board (sticky notes appear as teammates type).</li>
  <li>Voting / dot-voting built-in.</li>
  <li>AI summary and action items at the click of a button.</li>
  <li>Guest access for stakeholders who don't need a full account.</li>
  <li>Mobile-friendly - async writing happens on phones, often.</li>
</ul>

<h2 id="ai-async">Where AI helps async retros the most</h2>
<p>Async retros generate a <em>lot</em> of text. Forty stickies plus twenty threaded discussions is a wall of words. AI summaries collapse it back into a paragraph; AI action items pull commitments out of long threads. Both are essentially mandatory if you want async retros to scale.</p>
<p>That's the whole pitch for tools like <a href="/">reAItro</a> - designed from day one for remote and async retros, with AI built in.</p>
`
  },
  {
    slug: 'sprint-retrospective-ideas',
    title: '35 Sprint Retrospective Ideas to Re-Energize Your Team in 2026',
    description:
      '35 creative sprint retrospective ideas, formats and activities to break the routine, surface real issues and run retros your team actually looks forward to.',
    keywords:
      'sprint retrospective ideas, retrospective ideas, fun retrospective activities, agile retro ideas, scrum retrospective ideas, creative retrospective formats, sprint retro activities',
    author: baseAuthor,
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-14',
    readingMinutes: 11,
    tags: ['Ideas', 'Facilitation', 'Templates'],
    hero: {
      eyebrow: 'Inspiration',
      title: '35 sprint retrospective ideas to break the boredom',
      subtitle:
        'Fresh formats, openers, energizers and closing rituals to make your next sprint retrospective genuinely useful - and a little bit fun.',
      gradient: 'linear-gradient(135deg,#f59e0b 0%,#ef4444 55%,#a855f7 100%)'
    },
    toc: [
      { id: 'why-rotate', label: 'Why rotate ideas every sprint' },
      { id: 'openers', label: '8 retro openers' },
      { id: 'formats', label: '15 sprint retrospective formats' },
      { id: 'energizers', label: '6 mid-retro energizers' },
      { id: 'closers', label: '6 closing rituals' },
      { id: 'ai-ideas', label: 'Use AI to invent your own' }
    ],
    body: `
<h2 id="why-rotate">Why rotating sprint retrospective ideas matters</h2>
<p>If you run the same sprint retrospective format every two weeks, your team will go on autopilot. Stickies become muscle memory. The conversation gets shorter. Action items get vaguer. The fastest fix is also the simplest: change the <em>format</em> - and occasionally the <em>vibe</em> - of your sprint retrospective.</p>
<p>Below are 35 sprint retrospective ideas: openers, full formats, mid-retro energizers and closing rituals. Mix and match. The goal isn't novelty for novelty's sake - it's keeping your team's brain engaged so they actually surface what's broken.</p>

<h2 id="openers">8 retro openers to set the tone</h2>
<ol>
  <li><strong>One-word check-in.</strong> Each person says one word describing how they arrived at the retro. Simple, fast, surprisingly honest.</li>
  <li><strong>Weather forecast.</strong> "What's the weather like in your head right now?" Sunny, cloudy, hurricane.</li>
  <li><strong>Energy bar.</strong> 1-10 rating of how energized each person feels for the retro.</li>
  <li><strong>Emoji round.</strong> Drop the emoji that best describes the sprint.</li>
  <li><strong>Two truths and a lie about the sprint.</strong> A light way to surface real observations.</li>
  <li><strong>"What I almost said in stand-up."</strong> The thing you held back.</li>
  <li><strong>Prime directive read-out.</strong> Each person reads one line in turn - locks the room into psychological safety.</li>
  <li><strong>Mood map.</strong> Plot yourself on a grid: energy vs. clarity.</li>
</ol>

<h2 id="formats">15 sprint retrospective formats worth rotating through</h2>
<ol>
  <li><a href="/templates/start-stop-continue"><strong>Start / Stop / Continue</strong></a> - the easiest sprint retro format. Three columns. No learning curve.</li>
  <li><a href="/templates/daki-framework"><strong>DAKI</strong></a> - Drop / Add / Keep / Improve. The default richer-than-SSC format.</li>
  <li><a href="/templates/4ls"><strong>4Ls</strong></a> - Liked / Learned / Lacked / Longed-for. Ideal for retros after a project milestone.</li>
  <li><a href="/templates/sailboat"><strong>Sailboat</strong></a> - wind, anchors, rocks, island. Surfaces strategic forces visually.</li>
  <li><a href="/templates/glad-sad-mad"><strong>Glad / Sad / Mad</strong></a> - pure emotion. Use when you suspect morale issues.</li>
  <li><a href="/templates/hot-air-balloon"><strong>Hot Air Balloon</strong></a> - lifters, weights, hot air, weather. Sailboat's airborne cousin.</li>
  <li><a href="/templates/space-mission"><strong>Space Mission</strong></a> - fuel, crew, mission control, alien attacks. Great after a big launch.</li>
  <li><a href="/templates/mountain-climber"><strong>Mountain Climber</strong></a> - base camp, climb, summit, descent. Celebrates a hard sprint.</li>
  <li><a href="/templates/three-little-pigs"><strong>Three Little Pigs</strong></a> - straw / sticks / bricks. Post-incident or quality retro.</li>
  <li><a href="/templates/kitchen-nightmares"><strong>Kitchen Nightmares</strong></a> - ingredients, recipe, customers, dumpster. Post-mortem style.</li>
  <li><a href="/templates/energy-levels"><strong>Energy Levels</strong></a> - chart sprint energy day-by-day. Excellent for burnout signals.</li>
  <li><a href="/templates/video-game"><strong>Video Game</strong></a> - XP gained, boss fights, glitches, power-ups. Fun, but real.</li>
  <li><a href="/templates/marauders-map-retro"><strong>Marauder's Map</strong></a> - themed retro for the Harry Potter fans on the team.</li>
  <li><a href="/templates/lean-coffee"><strong>Lean Coffee</strong></a> - democratic, timeboxed discussion of any topic. Zero structure overhead.</li>
  <li><strong>Five Whys.</strong> Pick one problem from the sprint and ask "why" five times. Surfaces the root, not the symptom.</li>
</ol>

<p>Need something even more specific to your sprint or team? <a href="/ai-generator">Generate a custom retro template with AI</a> in one sentence - "a retro for the team that just finished hardening week with a wrestling theme" - and you'll have a fitting format in seconds.</p>

<h2 id="energizers">6 mid-retro energizers when attention drops</h2>
<ol>
  <li><strong>Stand up and stretch.</strong> Sounds silly. Works.</li>
  <li><strong>Two-minute silent re-cluster.</strong> Lets people re-engage with the board.</li>
  <li><strong>Pair share.</strong> Two-person breakouts on the top theme, then report back.</li>
  <li><strong>Quick poll.</strong> "Which of these is the biggest blocker?" Re-focuses the room.</li>
  <li><strong>Switch facilitator.</strong> Mid-retro hand-off. Wakes everyone up.</li>
  <li><strong>Read the AI summary out loud.</strong> Generate a draft reAItro summary halfway through and read it. It re-anchors the conversation.</li>
</ol>

<h2 id="closers">6 closing rituals so the retro actually lands</h2>
<ol>
  <li><strong>One-word out.</strong> Mirror of the opening check-in. Closes the loop emotionally.</li>
  <li><strong>Action item read-back.</strong> Each owner reads their commitment aloud. Public ownership.</li>
  <li><strong>Thanks round.</strong> Each person thanks one teammate for something specific in the sprint.</li>
  <li><strong>Confidence vote.</strong> 1-5 on "do we believe these actions will stick?"</li>
  <li><strong>One-click AI summary.</strong> Generate, drop into Slack, done before anyone leaves the call.</li>
  <li><strong>Calendar the review.</strong> Add "review last retro's actions" to the start of the next retro. Now.</li>
</ol>

<h2 id="ai-ideas">Use AI to invent your own sprint retrospective ideas</h2>
<p>The single fastest way to keep generating fresh sprint retrospective ideas: let AI invent them. reAItro's <a href="/ai-generator">template generator</a> takes a one-sentence prompt and builds a fully formed retro - columns, color palette, prompts, action column included. Type "a retro for a team that just finished a brutal incident response week" and you'll have a fitting format in eight seconds.</p>
<p>Pair that with one-click AI summaries and action item extraction, and your retros stop being homework for the Scrum Master and start being a feedback loop the team genuinely values.</p>
`
  },
  {
    slug: 'best-retrospective-tools',
    title: 'Best Retrospective Tools in 2026: An Honest Comparison',
    description:
      'A practical, honest comparison of the best retrospective tools in 2026 - features, pricing, AI capabilities, real-time collaboration, and which tool fits which team.',
    keywords:
      'best retrospective tools, retrospective tool, retrospective software, online retrospective tool, free retrospective tool, AI retrospective tool, retro tools comparison',
    author: baseAuthor,
    publishedAt: '2026-04-05',
    updatedAt: '2026-05-14',
    readingMinutes: 10,
    tags: ['Tools', 'Comparison'],
    hero: {
      eyebrow: 'Comparison',
      title: 'The best retrospective tools in 2026 - what actually matters',
      subtitle:
        'A team-led breakdown of what to look for in a modern retrospective tool, and how the leading options stack up on AI, real-time, and price.',
      gradient: 'linear-gradient(135deg,#0ea5e9 0%,#22c55e 60%,#facc15 100%)'
    },
    toc: [
      { id: 'what-matters', label: 'What actually matters in 2026' },
      { id: 'features', label: 'Core feature checklist' },
      { id: 'categories', label: 'Categories of retrospective tools' },
      { id: 'how-to-choose', label: 'How to pick the right one' },
      { id: 'why-retroboard', label: 'Why reAItro' }
    ],
    body: `
<h2 id="what-matters">What actually matters in a retrospective tool in 2026</h2>
<p>Five years ago, a retrospective tool was a glorified sticky-note board. In 2026 the bar is higher. The best retrospective tools combine three things: real-time multi-user collaboration, a wide library of templates, and generative AI for summaries, action items and even template generation. Anything less feels dated.</p>
<p>If you're shopping for a retrospective tool - whether for a single scrum team or a 500-person engineering org - these are the features that separate the modern tools from the legacy ones.</p>

<h2 id="features">Core feature checklist for a modern retrospective tool</h2>
<ul>
  <li><strong>Real-time collaboration.</strong> Multi-user cursors, instant sticky updates, no refresh. Anything else is friction.</li>
  <li><strong>Template library.</strong> At least 15 formats covering Start/Stop/Continue, DAKI, 4Ls, Sailboat, Glad/Sad/Mad, post-mortems, milestone celebrations, and morale check-ins.</li>
  <li><strong>AI summary generation.</strong> One click → executive paragraph + per-column themes. Saves the Scrum Master 30 min after every retro.</li>
  <li><strong>AI action item extraction.</strong> Reads the board, pulls out concrete commitments, drafts SMART action items with suggested owners.</li>
  <li><strong>AI template generation.</strong> Type "a retro for a team that just shipped" → get a fully formed custom template.</li>
  <li><strong>Voting & clustering.</strong> Dot-voting, sticky grouping, theme detection.</li>
  <li><strong>Anonymous / SSO auth.</strong> Both. Guests should join with one link; full users via SSO.</li>
  <li><strong>Async-friendly mode.</strong> Threaded comments, timed phases, multi-day boards.</li>
  <li><strong>Exports.</strong> Printable summary, Slack export, PDF, action item integration.</li>
  <li><strong>Privacy.</strong> Clear no-training-on-customer-data policy. GDPR-compliant. EU data residency a plus.</li>
  <li><strong>Pricing transparency.</strong> A free tier that genuinely works for small teams. No surprise per-seat costs.</li>
</ul>

<h2 id="categories">Categories of retrospective tools you'll find</h2>
<h3>Modern AI-first retrospective tools</h3>
<p>Built around generative AI from the start. AI summaries, AI action items and AI template generation are first-class features, not bolted on. <strong>reAItro</strong> falls in this category. So do a handful of newer entrants.</p>
<h3>Established whiteboard tools with retro features</h3>
<p>General-purpose digital whiteboards (Miro, Mural, FigJam) have retro templates and are very strong on collaboration. Their AI features are improving but not retro-specific - you get general "summarize this board" rather than retro-tuned action item extraction.</p>
<h3>Legacy retrospective specialists</h3>
<p>Tools that have been around since pre-2020 (the classic ones - you know the names). Solid retros, but most are still catching up on real-time fluidity and AI quality. Expect feature parity in 2026-2027.</p>
<h3>DIY (spreadsheets, docs, paper)</h3>
<p>Still common. Fine for the first few retros. Falls apart at scale and rules out any kind of AI assistance.</p>

<h2 id="how-to-choose">How to choose the right retrospective tool for your team</h2>
<ol>
  <li><strong>Pick your top two features.</strong> Realistically, you'll trade off. Most teams pick "AI summaries" and "real-time collaboration".</li>
  <li><strong>Run a real retro on the tool.</strong> Not a demo. A full sprint retrospective with the actual team.</li>
  <li><strong>Check the privacy policy.</strong> If the tool trains AI on your retro content, walk away.</li>
  <li><strong>Try the free tier.</strong> If it's enough for a small team, the paid tier is probably good for a larger one.</li>
  <li><strong>Check export quality.</strong> The retro itself is half the value. The shareable summary is the other half.</li>
</ol>

<h2 id="why-retroboard">Why we built reAItro</h2>
<p>We built <strong>reAItro</strong> because every existing retro tool we'd used either felt like 2018 (no AI), required a per-seat subscription before you'd run a single retro, or both. Our take: AI summaries, AI action items, and AI template generation should be free for small agile teams - and the bar for a "retrospective tool" should be the modern one, not the legacy one.</p>
<ul>
  <li>Free for small teams, no credit card.</li>
  <li>20+ ready-made retro templates plus an <a href="/ai-generator">AI template generator</a>.</li>
  <li>One-click AI summaries and SMART action item extraction powered by enterprise AI under a strict no-training agreement.</li>
  <li>Real-time multi-user collaboration with anonymous guest links and SSO.</li>
  <li>Works for live, remote and async retros.</li>
</ul>
<p>Start a retrospective board in 30 seconds: <a href="/boards/templates">browse the templates</a> or <a href="/ai-generator">generate a custom one</a> with AI.</p>
`
  },
  {
    slug: 'retrospective-questions-to-ask',
    title: '60 Retrospective Questions to Ask Your Team (Sorted by Goal)',
    description:
      '60 great retrospective questions to ask your agile team, sorted by goal - process, quality, delivery, morale, remote work, and learning. Use them in any sprint retro.',
    keywords:
      'retrospective questions, retrospective questions to ask, sprint retrospective questions, scrum retro questions, agile retrospective questions, retro icebreaker questions',
    author: baseAuthor,
    publishedAt: '2026-03-02',
    updatedAt: '2026-05-14',
    readingMinutes: 9,
    tags: ['Questions', 'Facilitation'],
    hero: {
      eyebrow: 'Question bank',
      title: '60 retrospective questions to ask, sorted by what you want to learn',
      subtitle:
        'A practical question bank for sprint retrospectives - pick a goal, pick three questions, run the retro.',
      gradient: 'linear-gradient(135deg,#6366f1 0%,#0ea5e9 55%,#22c55e 100%)'
    },
    toc: [
      { id: 'how-to-use', label: 'How to use this list' },
      { id: 'process', label: 'Process & ways of working' },
      { id: 'quality', label: 'Quality & defects' },
      { id: 'delivery', label: 'Delivery & flow' },
      { id: 'morale', label: 'Morale & team health' },
      { id: 'remote', label: 'Remote & async work' },
      { id: 'learning', label: 'Learning & growth' },
      { id: 'icebreakers', label: 'Icebreaker questions' }
    ],
    body: `
<h2 id="how-to-use">How to use this list of retrospective questions</h2>
<p>Don't ask all of these. Pick the goal for the sprint retrospective (process, quality, morale, etc.), then pick 2-3 questions from that section. Use them as <em>column headers</em> in your retro tool, or as discussion prompts after silent writing.</p>

<h2 id="process">Process & ways of working</h2>
<ol>
  <li>Which part of our process slowed us down this sprint?</li>
  <li>What ceremony felt the most valuable this sprint? Which felt the least?</li>
  <li>If we could change one thing about our planning, what would it be?</li>
  <li>Where did we waste time?</li>
  <li>What hand-off broke down this sprint?</li>
  <li>Did our definition of done hold up?</li>
  <li>How well did we estimate this sprint?</li>
  <li>What did we do this sprint that we should keep doing forever?</li>
  <li>What rule, ritual or policy is silently slowing us down?</li>
  <li>Where did we improvise instead of follow our process?</li>
</ol>

<h2 id="quality">Quality & defects</h2>
<ol>
  <li>What broke in production this sprint, and what would have caught it?</li>
  <li>Were our tests fast enough? Reliable enough?</li>
  <li>Where did we cut corners on quality?</li>
  <li>Which review (PR or design) added the most value? Which was performative?</li>
  <li>What's the riskiest piece of code we shipped this sprint?</li>
  <li>If we re-shipped this sprint tomorrow, what would we do differently?</li>
  <li>What kind of feedback did users give us this sprint?</li>
  <li>Where did we accumulate the most tech debt?</li>
</ol>

<h2 id="delivery">Delivery & flow</h2>
<ol>
  <li>What blocked us the most this sprint?</li>
  <li>Where did work pile up? Whose queue was it in?</li>
  <li>What unplanned work did we absorb? What did we drop because of it?</li>
  <li>Did we ship value or just close tickets?</li>
  <li>Which dependencies hurt us the most?</li>
  <li>Where did we have to wait?</li>
  <li>What item took the longest to move from "in progress" to "done" - and why?</li>
</ol>

<h2 id="morale">Morale & team health</h2>
<ol>
  <li>How are you arriving at this retro - one word?</li>
  <li>What in this sprint drained you the most?</li>
  <li>What in this sprint energized you?</li>
  <li>Did you feel safe to disagree this sprint?</li>
  <li>When was the last time you laughed at work?</li>
  <li>Who or what slowed you down this sprint?</li>
  <li>Did you feel like a contributor or a passenger this sprint?</li>
  <li>What part of your job did you want more of this sprint?</li>
  <li>What part did you want less of?</li>
</ol>

<h2 id="remote">Remote & async work</h2>
<ol>
  <li>Did time zones hurt us this sprint? Where?</li>
  <li>Were our async updates good enough?</li>
  <li>Did we over-meet or under-meet?</li>
  <li>What's the longest you waited on a remote colleague this sprint?</li>
  <li>What conversation needed to be a call but wasn't?</li>
  <li>Are our async tools (chat, docs, retro tool) helping or fragmenting us?</li>
</ol>

<h2 id="learning">Learning & growth</h2>
<ol>
  <li>What did you learn this sprint?</li>
  <li>What skill did you wish you had this sprint?</li>
  <li>Who taught you something this sprint? Did you thank them?</li>
  <li>What did we learn as a team that no individual could have?</li>
  <li>What's a habit we built this sprint we should keep?</li>
  <li>What's something we tried for the first time?</li>
</ol>

<h2 id="icebreakers">Icebreaker questions for retros</h2>
<ol>
  <li>Pick a song that describes this sprint.</li>
  <li>If this sprint were a weather forecast, what was it?</li>
  <li>What emoji best describes how the sprint went?</li>
  <li>If the sprint had a movie title, what would it be?</li>
  <li>One word to describe your energy right now?</li>
  <li>What's something small that made you happy this sprint?</li>
  <li>If you could replay one moment of this sprint, which would it be?</li>
  <li>What's something you almost said in stand-up but didn't?</li>
</ol>

<p>Once you've picked your questions, drop them into a board on <a href="/">reAItro</a> - or let the <a href="/ai-generator">AI template generator</a> build a custom retro around the goal in one sentence. After the retro, one click generates the summary and pulls SMART action items out of the discussion.</p>
`
  },
  {
    slug: 'scrum-retrospective-guide',
    title: 'The Scrum Retrospective: A Complete Guide for Scrum Masters',
    description:
      'A complete scrum retrospective guide for Scrum Masters - what the sprint retrospective is, how it fits in the scrum framework, formats, facilitation tips, and AI tools.',
    keywords:
      'scrum retrospective, sprint retrospective, scrum master retrospective, scrum framework retrospective, agile scrum retro, retrospective in scrum',
    author: baseAuthor,
    publishedAt: '2026-02-22',
    updatedAt: '2026-05-14',
    readingMinutes: 12,
    tags: ['Scrum', 'Facilitation', 'Agile'],
    hero: {
      eyebrow: 'Scrum Master guide',
      title: 'The scrum retrospective, end to end - for Scrum Masters who want to facilitate better',
      subtitle:
        'What the scrum retrospective is, where it fits in the scrum framework, how to facilitate it, and how AI is changing the role of the Scrum Master.',
      gradient: 'linear-gradient(135deg,#a855f7 0%,#6366f1 55%,#0ea5e9 100%)'
    },
    toc: [
      { id: 'definition', label: 'What is a scrum retrospective' },
      { id: 'where-it-fits', label: 'Where it fits in scrum' },
      { id: 'timebox', label: 'Timebox and cadence' },
      { id: 'agenda', label: 'A proven agenda' },
      { id: 'role', label: 'The Scrum Master\'s role' },
      { id: 'ai', label: 'AI in the scrum retrospective' },
      { id: 'metrics', label: 'How to measure success' }
    ],
    body: `
<h2 id="definition">What is a scrum retrospective?</h2>
<p>The scrum retrospective - also called the sprint retrospective - is the final event in a sprint. It's the only scrum event whose explicit purpose is to <em>improve how the team works</em>. The Scrum Guide defines it as an opportunity to inspect the sprint with regard to individuals, interactions, processes, tools and the definition of done, then identify and order the most important improvements.</p>
<p>Translation: it's the hour every two weeks where your scrum team gets meaningfully better, or doesn't. Done well, it's the highest-leverage meeting in the scrum framework. Done badly, it's the first ceremony stakeholders try to cut.</p>

<h2 id="where-it-fits">Where the retrospective fits in the scrum framework</h2>
<p>The five scrum events, in order, are:</p>
<ol>
  <li><strong>Sprint planning</strong> - set the goal and forecast the work.</li>
  <li><strong>Daily scrum</strong> - synchronize the team.</li>
  <li><strong>Sprint review</strong> - demo product increment to stakeholders.</li>
  <li><strong>Sprint retrospective</strong> - inspect and adapt how the team works.</li>
  <li><strong>(Next sprint planning)</strong> - close the loop.</li>
</ol>
<p>The retrospective comes <em>after</em> the sprint review and <em>before</em> the next sprint planning. That ordering matters: actions from the retrospective feed directly into how the next sprint runs.</p>

<h2 id="timebox">Timebox and cadence</h2>
<p>The Scrum Guide caps the retrospective at three hours for a one-month sprint, proportionally less for shorter sprints. In practice, for a two-week sprint, allocate <strong>60-90 minutes</strong>. Anything shorter is rushed; anything longer rarely produces better outcomes.</p>
<p>Cadence is whatever your sprint cadence is. Don't skip it - the cost of one skipped retrospective is six weeks of unchanged behaviors.</p>

<h2 id="agenda">A proven scrum retrospective agenda (75 minutes)</h2>
<ol>
  <li><strong>(5 min) Open.</strong> Welcome, restate the sprint goal, read the prime directive, one-word check-in.</li>
  <li><strong>(5 min) Review last sprint's actions.</strong> Did we do them? Any blockers? Public, low-pressure.</li>
  <li><strong>(10 min) Set the scene.</strong> Recap sprint metrics, velocity, key incidents - facts, not opinions.</li>
  <li><strong>(10-15 min) Gather data.</strong> Silent writing on stickies into your chosen format (DAKI, Sailboat, etc.).</li>
  <li><strong>(10 min) Cluster and vote.</strong> Group similar stickies. Dot-vote on themes.</li>
  <li><strong>(15-25 min) Discuss.</strong> Open discussion on top 2-3 themes. Use five whys.</li>
  <li><strong>(10 min) Decide actions.</strong> 1-3 SMART action items, each with a single owner and due date.</li>
  <li><strong>(5 min) Close.</strong> One-word out, thanks round, generate the AI summary, share in chat.</li>
</ol>

<h2 id="role">The Scrum Master's role in the retrospective</h2>
<p>The Scrum Master is the <em>facilitator</em>, not the <em>boss</em> of the retro. That means:</p>
<ul>
  <li>Pick a format that fits the sprint and the team's mood (rotate every 2-3 sprints).</li>
  <li>Create psychological safety. Read the prime directive. Defuse blame language.</li>
  <li>Run silent writing first to neutralize loud voices.</li>
  <li>Keep discussion focused on systems, not individuals.</li>
  <li>Time-box ruthlessly. A 75-minute retro that finishes on time beats a 110-minute retro that runs late.</li>
  <li>Track action items and review them at the start of the next retro.</li>
</ul>
<p>What the Scrum Master is <em>not</em> responsible for: making the team feel good, fixing every problem surfaced, or generating the action items personally. The team owns those.</p>

<h2 id="ai">AI is changing what a Scrum Master spends time on</h2>
<p>The most time-consuming part of running a retrospective for a Scrum Master used to be the <em>after</em>: turning forty stickies into a shareable writeup, drafting action items, tracking owners. AI tools now collapse that work to minutes.</p>
<p><strong>reAItro</strong> generates a full sprint retrospective summary and SMART action item list in one click, right inside the retro. The Scrum Master moves from "homework after the retro" to "validate the AI draft with the team in the last 5 minutes". That frees the role to focus on the work AI can't do - facilitation, coaching, and following through on actions across sprints.</p>

<h2 id="metrics">How to measure if your scrum retrospectives are working</h2>
<ul>
  <li><strong>Action completion rate.</strong> Of the action items you commit to in each retro, what percent are done by the next retro? Healthy teams sit at 70%+.</li>
  <li><strong>Repeat themes.</strong> If the same theme appears in 3+ retros in a row, your actions are not actually addressing the cause.</li>
  <li><strong>Participation.</strong> Sticky count per person. Trending down is a warning sign.</li>
  <li><strong>Team sentiment trend.</strong> Track sprint-over-sprint mood. Retrospective tools with AI sentiment analysis (like <a href="/">reAItro</a>) do this automatically.</li>
</ul>
<p>If those four numbers look healthy, your scrum retrospectives are doing their job. If not, the first thing to change is the <em>format</em> - pick a new one from <a href="/boards/templates">the template library</a> or <a href="/ai-generator">have AI generate one</a> tailored to your last sprint.</p>
`
  },
  {
    slug: 'fun-retrospective-ideas',
    title: '20 Fun Retrospective Ideas (That Still Surface Real Issues)',
    description:
      '20 fun retrospective ideas, themed formats and creative activities that keep the team engaged while still producing real, actionable insights from your sprint.',
    keywords:
      'fun retrospective ideas, creative retrospective, themed retrospective, retrospective games, fun retro activities, engaging retrospective, retrospective icebreakers',
    author: baseAuthor,
    publishedAt: '2026-01-28',
    updatedAt: '2026-05-14',
    readingMinutes: 8,
    tags: ['Ideas', 'Fun', 'Facilitation'],
    hero: {
      eyebrow: 'Re-energize',
      title: 'Fun retrospective ideas that still produce real action items',
      subtitle:
        'Themed formats, games and creative activities for retros that don\'t feel like another meeting - without sacrificing the substance.',
      gradient: 'linear-gradient(135deg,#ec4899 0%,#f59e0b 55%,#22c55e 100%)'
    },
    toc: [
      { id: 'why-fun', label: 'Why "fun" retros work' },
      { id: 'themed', label: '8 themed retrospective formats' },
      { id: 'games', label: '7 retrospective games' },
      { id: 'twists', label: '5 small twists on classic formats' },
      { id: 'ai-fun', label: 'Use AI to invent themed retros' }
    ],
    body: `
<h2 id="why-fun">Why "fun" retrospectives still produce real insights</h2>
<p>"Fun retrospective" sounds like the opposite of "useful retrospective". It isn't. A bit of theme or creativity does two things: it engages the brain (people pay attention), and it lowers psychological barriers (people say things they wouldn't say in a four-column template). Done right, the silliest retros surface the most honest feedback of the quarter.</p>
<p>The trick is to keep the <em>structure</em> - silent writing, voting, action items - while changing the <em>frame</em>. Here are 20 ways to do that.</p>

<h2 id="themed">8 themed retrospective formats</h2>
<ol>
  <li><strong>Movie genre retro.</strong> Pick a genre for the sprint - horror, comedy, road trip, heist. Columns: plot, hero moment, plot twist, ending.</li>
  <li><strong>Restaurant retro.</strong> Columns: ingredients (resources), recipe (process), customers (stakeholders), dumpster (what to throw out). See also <a href="/templates/kitchen-nightmares">Kitchen Nightmares</a>.</li>
  <li><strong>Sports team retro.</strong> Columns: starting line-up, MVPs, plays that worked, bench warmers (unused ideas), fouls.</li>
  <li><strong>Video game retro.</strong> XP gained, boss fights, glitches, power-ups, side quests. See <a href="/templates/video-game">Video Game template</a>.</li>
  <li><strong>Space mission retro.</strong> Mission control, fuel, crew, alien attacks, landing. See <a href="/templates/space-mission">Space Mission</a>.</li>
  <li><strong>Mountain climber retro.</strong> Base camp, summit, weather, missing gear. See <a href="/templates/mountain-climber">Mountain Climber</a>.</li>
  <li><strong>Marauder's Map retro.</strong> A Harry Potter take - useful only if the team's into it. See <a href="/templates/marauders-map-retro">Marauder's Map</a>.</li>
  <li><strong>Concert retro.</strong> Headliner, opening act, soundcheck issues, encores. Surprisingly evocative.</li>
</ol>

<h2 id="games">7 retrospective games</h2>
<ol>
  <li><strong>Two truths and a lie about the sprint.</strong> Forces specificity. Surfaces hidden observations.</li>
  <li><strong>Sprint headlines.</strong> Each person writes a fake newspaper headline summarizing the sprint. The group votes for the best.</li>
  <li><strong>Highlight & lowlight reel.</strong> Each person picks one highlight and one lowlight as a "scene" - bonus points for naming it cinematically.</li>
  <li><strong>The retro emoji game.</strong> Everyone drops 3 emojis describing the sprint. Discuss patterns.</li>
  <li><strong>Bingo retro.</strong> Pre-build a bingo card of common sprint events. Check off what happened. Surfaces patterns playfully.</li>
  <li><strong>The five-second rule.</strong> Five seconds to answer: "What was the hardest moment of the sprint?" - no time to filter.</li>
  <li><strong>Speed dating retro.</strong> 2-minute pair conversations rotating around the team. Then share back the most useful thing you heard.</li>
</ol>

<h2 id="twists">5 small twists on classic retro formats</h2>
<ol>
  <li><strong>Color-coded DAKI.</strong> Force each person to use a different sticky color per category. Visual patterns pop.</li>
  <li><strong>Reverse start/stop/continue.</strong> What should the team next door start, stop and continue? Externalized perspective.</li>
  <li><strong>Letter to the team.</strong> Write a 3-sentence letter from "future you" to the team. Used as the gather phase.</li>
  <li><strong>Glad/Sad/Mad, anonymous.</strong> Anonymous mode on. The classic format becomes radically honest.</li>
  <li><strong>5 whys instead of stickies.</strong> Skip the columns. Pick last sprint's biggest problem. Ask "why" five times. Done.</li>
</ol>

<h2 id="ai-fun">Use AI to invent your next themed retro</h2>
<p>You can keep inventing themed retros by hand, or you can let AI do it. reAItro's <a href="/ai-generator">template generator</a> takes a sentence - "a retro themed around our team's love of cycling" or "a post-incident retro with a film noir vibe" - and produces a fully formed template with columns, colors, and prompts. You'll have a fun-but-substantive retro format ready in under ten seconds.</p>
<p>Pair that with one-click AI summaries and SMART action items, and you have the best of both worlds: a retro the team looks forward to, and a writeup the Scrum Master doesn't dread.</p>
`
  },
  {
    slug: 'online-retrospective-tool',
    title: 'Choosing an Online Retrospective Tool: What to Look For in 2026',
    description:
      'A practical guide to choosing an online retrospective tool - must-have features, AI capabilities, security, pricing, and how to switch tools without losing your team.',
    keywords:
      'online retrospective tool, free online retrospective tool, web retrospective tool, retrospective software online, browser-based retro tool, online retro board',
    author: baseAuthor,
    publishedAt: '2026-04-30',
    updatedAt: '2026-05-14',
    readingMinutes: 9,
    tags: ['Tools', 'Remote'],
    hero: {
      eyebrow: 'Buyer\'s guide',
      title: 'How to pick an online retrospective tool that the team will actually use',
      subtitle:
        'A practical buyer\'s guide for choosing a modern, AI-enabled online retrospective tool - features, security, pricing and migration.',
      gradient: 'linear-gradient(135deg,#14b8a6 0%,#0ea5e9 55%,#6366f1 100%)'
    },
    toc: [
      { id: 'why-online', label: 'Why teams move to an online retro tool' },
      { id: 'must-haves', label: 'Must-have features' },
      { id: 'nice-to-haves', label: 'Nice-to-haves' },
      { id: 'security', label: 'Security & privacy' },
      { id: 'pricing', label: 'Pricing models' },
      { id: 'switching', label: 'How to switch tools' }
    ],
    body: `
<h2 id="why-online">Why teams move to an online retrospective tool</h2>
<p>Even fully co-located teams now run their sprint retros on an online retrospective tool. Why? Three reasons: real-time collaboration is better than paper for clustering and voting, the retro outputs become searchable history, and modern tools generate AI summaries and action items automatically. The legacy "sticky notes on a wall" approach can't compete on follow-through.</p>

<h2 id="must-haves">Must-have features in an online retrospective tool</h2>
<ul>
  <li><strong>Real-time multi-user editing.</strong> Multiple cursors, live sticky updates. Anything else introduces friction.</li>
  <li><strong>20+ retro templates.</strong> Cover Start/Stop/Continue, DAKI, 4Ls, Sailboat, Glad/Sad/Mad and post-mortem formats out of the box.</li>
  <li><strong>AI summary in one click.</strong> Reads the whole board, returns an executive paragraph plus per-column themes.</li>
  <li><strong>AI action item extraction.</strong> Pulls commitments out of stickies into SMART action items.</li>
  <li><strong>AI template generator.</strong> Make a custom retro format from a one-sentence prompt.</li>
  <li><strong>Dot-voting and clustering.</strong> Built-in, not bolted on.</li>
  <li><strong>Anonymous & SSO sign-in.</strong> Guests via link; full members via SSO.</li>
  <li><strong>Mobile-friendly.</strong> Async stickies often happen on phones.</li>
</ul>

<h2 id="nice-to-haves">Nice-to-haves that pay off over time</h2>
<ul>
  <li>Async / multi-day mode with phase timers.</li>
  <li>Sentiment tracking across sprints.</li>
  <li>Action item integrations with Jira, Linear or your tracker.</li>
  <li>Slack export of the AI summary.</li>
  <li>Printable PDF for non-digital stakeholders.</li>
  <li>Per-team workspaces and role-based access.</li>
</ul>

<h2 id="security">Security & privacy considerations</h2>
<p>Retrospectives often contain sensitive information - incident details, interpersonal friction, customer feedback. Don't compromise on:</p>
<ul>
  <li><strong>No training on customer data.</strong> The tool's terms should explicitly forbid using your retro content to train AI models. reAItro runs on an enterprise AI provider under a strict no-training agreement.</li>
  <li><strong>GDPR and SOC 2.</strong> Standard for any tool you bring into an enterprise.</li>
  <li><strong>Data residency.</strong> EU or US data residency, depending on your org.</li>
  <li><strong>Retention controls.</strong> Configurable retention for retros and AI outputs.</li>
  <li><strong>Anonymous mode.</strong> True anonymity for sensitive retros - no user attribution in the audit log.</li>
</ul>

<h2 id="pricing">Pricing models to watch for</h2>
<p>Three patterns dominate the market:</p>
<ol>
  <li><strong>Free + paid AI.</strong> Boards free, AI features paid. Common pattern, fair trade.</li>
  <li><strong>Per-seat subscription.</strong> Standard for whiteboard tools (Miro, Mural). Adds up fast for occasional retro participants.</li>
  <li><strong>Free for small teams.</strong> Generous free tier for teams under a threshold, paid above. This is the model we use for <strong>reAItro</strong> - small agile teams get real-time boards, 20+ templates and AI summaries for free, no credit card.</li>
</ol>
<p>Whatever the model, the test is: can you run a full sprint retrospective with AI summary and action items <em>without entering a card</em>? If the answer is no, the tool is overpriced relative to the market.</p>

<h2 id="switching">How to switch online retrospective tools without losing your team</h2>
<ol>
  <li><strong>Run one parallel retro.</strong> Same sprint, both tools, half the team in each. Compare outputs.</li>
  <li><strong>Migrate templates first.</strong> Pin your team's 2-3 favorite formats in the new tool before switching fully.</li>
  <li><strong>Carry the action item history forward.</strong> Export the last 3-5 retros and import them as notes. Continuity matters.</li>
  <li><strong>Announce it in retro #1.</strong> Use the first retro on the new tool to <em>retrospect on the switch</em>. Surfaces friction immediately.</li>
</ol>
<p>If you're considering a move, try <a href="/">reAItro</a> with your next sprint - pick a <a href="/boards/templates">template</a> or generate a custom one with <a href="/ai-generator">AI</a>, run the retro, and decide based on the actual experience, not a feature checklist.</p>
`
  },
  {
    slug: 'team-games-for-remote-teams',
    title: 'AI-Powered Team Games for Remote &amp; Hybrid Teams (5 Games That Actually Work)',
    description:
      'Five live AI team games - Meeting Roulette, Doodle Quest, Trivia Race, Two Truths & a Lie, and Emoji Tales. How each is played, what they fix, when to run them, and how AI keeps them moving.',
    keywords:
      'team games for remote teams, virtual team building games, online team games, AI team games, hybrid team games, icebreaker games, online pictionary, team trivia, two truths and a lie, meeting roulette, team building activities, remote team building',
    author: baseAuthor,
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-18',
    readingMinutes: 11,
    tags: ['Team Building', 'Remote Work', 'Onboarding', 'Games'],
    hero: {
      eyebrow: 'Team games guide',
      title: '5 AI team games that actually work for remote and hybrid teams',
      subtitle:
        'Live, in-browser, no scheduling. From the new-hire mixer to the Friday wind-down - what to run, when, and how AI keeps the energy high.',
      gradient: 'linear-gradient(135deg,#6366f1 0%,#ec4899 60%,#f97316 100%)'
    },
    toc: [
      { id: 'why-games', label: 'Why team games (when done right)' },
      { id: 'meeting-roulette', label: 'Meeting Roulette' },
      { id: 'doodle-quest', label: 'Doodle Quest' },
      { id: 'trivia-race', label: 'Trivia Race' },
      { id: 'two-truths', label: 'Two Truths &amp; a Lie' },
      { id: 'emoji-tales', label: 'Emoji Tales' },
      { id: 'how-ai-helps', label: 'How AI actually helps' },
      { id: 'how-to-host', label: 'How to host a session that lands' },
      { id: 'faq', label: 'FAQ' }
    ],
    body: `
<h2 id="why-games">Why team games - when done right</h2>
<p>Remote and hybrid teams have a quiet problem: <strong>people only ever talk to the same five colleagues</strong>. The slack channels self-segregate, the standup is short, and the new hire in Bangalore has never spoken to the staff engineer in Berlin. A well-chosen team game is the cheapest way to break that pattern - but most virtual icebreakers fail because they're either painfully scripted, too long, or require a host with the energy of a cruise-ship entertainer.</p>
<p>The trick is to use AI for the parts that drain the host (picking prompts, judging entries, generating questions) and let humans do the part they're good at: actually talking to each other. The five games below all run live in the browser, take 5-15 minutes, and don't need a single Slack bot or calendar invite. <a href="/play">Open the games lobby</a>, click <em>Create Game Room</em>, share the link, play.</p>

<h2 id="meeting-roulette">🎰 Meeting Roulette - onboarding &amp; cross-team mixers</h2>
<p><strong>What it is:</strong> Everyone in the room is randomly paired into 1:1s (or trios). Each pair gets an AI-generated icebreaker tailored to the moment - say, welcoming a new joiner. After a few minutes, the room shuffles into new pairs. Three rounds and everyone has met someone they hadn't spoken to before.</p>
<p><strong>What it fixes:</strong> the new-hire problem. The "I've been here three months and I still don't know what half the team does" problem. The offshore/onshore split.</p>
<p><strong>How AI helps:</strong> the host doesn't write 20 conversation prompts before the call. The AI generates one per pair, on the spot, optionally seeded with context like <em>"welcoming Maya from the new design team"</em>. The questions stay open-ended, inclusive, and safe-for-work by design.</p>
<p><strong>When to run it:</strong> the first 10 minutes of a new joiner's first all-hands. Quarterly cross-team mixers. The Monday after a re-org.</p>
<p><a href="/blog/meeting-roulette-for-new-hire-onboarding">Read the deep guide on using Meeting Roulette for onboarding →</a></p>

<h2 id="doodle-quest">🎨 Doodle Quest - Pictionary, but better</h2>
<p><strong>What it is:</strong> One player draws on a shared canvas. Everyone else types guesses live. Points scale with how fast the guess comes in. Three rounds, drawer rotates, leaderboard at the end.</p>
<p><strong>What it fixes:</strong> remote-call awkwardness. Drawing breaks the rigid grid-of-faces feeling because everyone is watching a real thing happen in real time.</p>
<p><strong>How AI helps:</strong>
  <ul>
    <li><strong>Word selection:</strong> the AI picks a fresh word matched to a theme (Agile &amp; Tech, Movies, Food, Office Life) and a difficulty (easy / medium / hard). No more "we already did this one last week".</li>
    <li><strong>Hints without spoilers:</strong> the drawer can request up to three AI-generated hints during a round. The model is explicitly told <em>not</em> to leak the word - and there's a defence-in-depth check that swaps in a safe fallback if it slips.</li>
  </ul>
</p>
<p><strong>When to run it:</strong> Friday wind-down. Demo-day reward. After a tough sprint.</p>

<h2 id="trivia-race">🧠 Trivia Race - friendly competition without trivia subscriptions</h2>
<p><strong>What it is:</strong> AI generates a multiple-choice question. Everyone buzzes in. First correct answer wins the round bonus; anyone else who's correct still scores. Five rounds, shared scoreboard, done in 5 minutes.</p>
<p><strong>What it fixes:</strong> the "we want trivia but every trivia tool is a $200/month SaaS" problem. The category boredom problem ("oh god, another general-knowledge round").</p>
<p><strong>How AI helps:</strong> the question is generated to spec each round - category, difficulty, fresh wording - under a strict JSON schema (question, four options, correct index, one-line explanation). The model gets a validator on the way out so malformed questions never reach the players.</p>
<p><strong>When to run it:</strong> 10-minute slot at the end of a long meeting. Onsite/offsite warmup. Tech-team agile-trivia challenge.</p>

<h2 id="two-truths">🤥 Two Truths &amp; a Lie - the connection game</h2>
<p><strong>What it is:</strong> Each player writes two true statements and one lie about themselves. The team votes on which is the lie. Voters who catch the fib score. Players whose lie fooled the most teammates also score.</p>
<p><strong>What it fixes:</strong> the "we worked together for two years and I still don't know anything about her outside of work" problem. Great when a team has hit pure-task-mode and needs to remember each other are humans.</p>
<p><strong>How AI helps:</strong> the hardest part for most players is <em>writing a believable lie</em>. Tap <em>"🤖 AI: suggest a lie"</em> with an optional topic hint (travel, food, work, hobbies) and the AI returns three plausible-but-fictional one-liners. The player still picks what to actually submit - the AI just unblocks the cold-start moment.</p>
<p><strong>When to run it:</strong> mid-game in a team offsite. New-hire welcome session (alongside Meeting Roulette). Quarterly culture day.</p>

<h2 id="emoji-tales">😄 Emoji Tales - creative warm-up in 3 minutes</h2>
<p><strong>What it is:</strong> A prompt appears ("Sum up this sprint in emojis", "Describe your last vacation", "Your week as a movie poster"). Everyone writes their story using <em>only</em> emojis. AI judges the most creative entry with a one-line reason.</p>
<p><strong>What it fixes:</strong> creative-block at the start of a workshop. Cross-language teams (emojis are universal). Teams who hate roleplay icebreakers but will happily play with emojis.</p>
<p><strong>How AI helps:</strong> the judging step is the friction - nobody wants to be the host who picks favorites. AI judges on-theme creativity and provides a short, warm reason for the pick. The host stays neutral.</p>
<p><strong>When to run it:</strong> Monday standup warmup. Retrospective opener (instead of asking "how do you feel today?"). 3-minute energy spike between two long meetings.</p>

<h2 id="how-ai-helps">How AI actually helps (and where it doesn't)</h2>
<p>AI's role in these games is intentionally narrow:</p>
<ul>
  <li><strong>Prompt &amp; question generation.</strong> The bottleneck for every team-building game is content: words to draw, trivia questions, icebreakers per pair. AI generates them on demand, on-theme, with constraints (safe-for-work, schema-validated, length-bounded).</li>
  <li><strong>Hints &amp; inspiration.</strong> Doodle Quest's no-spoiler hints. Two Truths' lie inspiration. Cold-start helpers that don't replace the player's own voice.</li>
  <li><strong>Neutral judging.</strong> When a human host picking favorites would feel awkward (Emoji Tales), the AI does it with a one-line warm reason.</li>
</ul>
<p>What AI <em>doesn't</em> do here is replace the people. The conversations, the laughs, the moments where someone shares something about themselves - those are the entire point. The AI is a stagehand, not the show.</p>
<p>All AI calls go through an enterprise provider under a strict no-training agreement: nothing from these games is used to train any model.</p>

<h2 id="how-to-host">How to host a team-game session that actually lands</h2>
<ol>
  <li><strong>Pick one game, not five.</strong> "Today we're playing X for 10 minutes" beats a buffet every time.</li>
  <li><strong>Time-box hard.</strong> 5 minutes for Emoji Tales. 8 minutes for Trivia. 15 minutes for Meeting Roulette. End on a high - never on a long lull.</li>
  <li><strong>Open the room before the meeting.</strong> Share the <a href="/play">/play link</a> a few minutes early so people land in the lobby, not staring at a black screen.</li>
  <li><strong>Match the game to the goal.</strong> Onboarding → Meeting Roulette + Two Truths. Demo-day decompression → Doodle Quest. Cross-time-zone connection → Trivia Race.</li>
  <li><strong>Don't host every week.</strong> Team games are seasoning. Run one every 2-3 weeks and they stay fun. Run them weekly and they become a chore.</li>
</ol>

<h2 id="faq">FAQ</h2>
<h3>Do my teammates need to install anything?</h3>
<p>No. Everything runs in the browser. Create a room from the <a href="/play">games lobby</a>, share the link, anyone with the link can join.</p>
<h3>Do I need to be a paying customer?</h3>
<p>No. The games - like the retrospective boards - are free. We rate-limit heavy AI use to protect the service.</p>
<h3>Can I run these alongside a retrospective?</h3>
<p>Yes. Every retro board has a 🎮 <em>Play Games</em> button that opens the same games in a modal - good for ending a retro with a 5-minute decompression.</p>
<h3>Is the content from our games used to train AI?</h3>
<p>No. Our AI provider operates under a strict no-training enterprise agreement.</p>
<h3>How many players can join a game room?</h3>
<p>Doodle Quest, Trivia Race, Emoji Tales and Two Truths &amp; a Lie scale comfortably to ~20 active players. Meeting Roulette works best at 4-16 (above that, switch to a Trivia round instead).</p>
`
  },
  {
    slug: 'meeting-roulette-for-new-hire-onboarding',
    title: 'Meeting Roulette: The 15-Minute Welcome Ritual for New Team Members',
    description:
      'How to run Meeting Roulette to welcome new hires to a remote or hybrid team. AI-generated icebreakers, random 1:1 pairings, three rotations, zero scheduling. The full playbook.',
    keywords:
      'meeting roulette, welcome new team members, new hire onboarding remote team, virtual icebreaker, random pairing tool, donut alternative, new joiner welcome, remote onboarding, hybrid team mixer, AI icebreaker, new hire icebreaker activities',
    author: baseAuthor,
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-18',
    readingMinutes: 7,
    tags: ['Onboarding', 'Remote Work', 'Team Building', 'Games'],
    hero: {
      eyebrow: 'Onboarding playbook',
      title: 'Meeting Roulette: a 15-minute welcome ritual that actually works',
      subtitle:
        'The new-hire icebreaker for remote &amp; hybrid teams. Random 1:1 pairings, AI-generated questions, three rounds, done before lunch.',
      gradient: 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 55%,#ec4899 100%)'
    },
    toc: [
      { id: 'why', label: 'Why the standard new-hire welcome fails' },
      { id: 'what', label: 'What Meeting Roulette actually is' },
      { id: 'how', label: 'How to run a session (step by step)' },
      { id: 'ai-role', label: "How AI keeps the conversation moving" },
      { id: 'variations', label: 'Variations &amp; when to use them' },
      { id: 'pitfalls', label: 'Common pitfalls' },
      { id: 'faq', label: 'FAQ' }
    ],
    body: `
<h2 id="why">Why the standard new-hire welcome fails</h2>
<p>The default welcome for a new joiner on a remote team goes something like this: they say hi in standup, post a short bio in <code>#introductions</code>, and… that's it. Two months later they still only know their direct manager and the engineer who paired with them on day one. Everyone else is a face in a grid.</p>
<p>The problem isn't introductions - it's <strong>one-on-one minutes</strong>. New hires need a few short, structured conversations with people they wouldn't otherwise meet. Schedule those manually and you create work for the manager. Skip them and the new hire drifts.</p>
<p><strong>Meeting Roulette</strong> automates the structured part of those conversations: random pairings, fresh AI-generated icebreakers per pair, time-boxed rounds. It's the cheapest <em>"we actually have a culture"</em> ritual you'll add this quarter.</p>

<h2 id="what">What Meeting Roulette actually is</h2>
<p>It's a live, in-browser game. Everyone in the room gets randomly paired (or grouped into trios if the count is odd). Each pair sees:</p>
<ul>
  <li>Their names, highlighted if they're in <em>your</em> group.</li>
  <li>One AI-generated open-ended icebreaker tailored to the round.</li>
  <li>A countdown timer for the round.</li>
</ul>
<p>When the timer ends, the host clicks <em>Next round</em>. The room reshuffles into new pairs. Three rounds - about 15 minutes total - and the new joiner has had real conversations with 3-6 different teammates.</p>
<p>It's a deliberately simpler thing than tools like Donut. There's no recurring schedule, no email integration, no admin panel. It runs <em>when you run it</em>, lives in the browser, and is gone when you close the tab. That trade-off is the point: zero setup, zero ongoing maintenance, no integrations to break.</p>

<h2 id="how">How to run a session - step by step</h2>
<ol>
  <li><strong>The day before:</strong> drop a line in your team channel. <em>"Welcoming Maya at 10:30 tomorrow - 15 minutes, optional, link to follow."</em></li>
  <li><strong>5 minutes before:</strong> open <a href="/play">/play</a>, click <em>Create Game Room</em>, name it something obvious (<em>"Welcome Maya"</em>), copy the link, drop it in the channel.</li>
  <li><strong>Join the room.</strong> Open Meeting Roulette in the picker. In the lobby, set rounds (3 is the default sweet spot), minutes per round (5 is right), and group size (pairs by default, trios if more than ~10 people).</li>
  <li><strong>Add context for the AI</strong> (optional but worth it). <em>"Welcoming Maya from the new design team. Mixed Berlin + Bangalore + Toronto."</em> The icebreakers will lean warm and inclusive.</li>
  <li><strong>Start.</strong> Everyone sees the pairings and their group's icebreaker. They split into breakouts (or just turn cameras to each other if there are only 4).</li>
  <li><strong>End each round.</strong> The timer auto-advances or the host clicks <em>Next round</em>. New pairings, new questions.</li>
  <li><strong>Wrap.</strong> After three rounds, the room ends with a small summary. Done before the next meeting.</li>
</ol>

<h2 id="ai-role">How AI keeps the conversation moving</h2>
<p>The hardest part of running a 1:1 mixer used to be <em>writing 15 distinct icebreaker questions</em> before the call. We let AI do that:</p>
<ul>
  <li><strong>One question per pair, per round.</strong> Each pair gets a unique prompt, not a generic one repeated.</li>
  <li><strong>Constrained for safety.</strong> Under 18 words. Open-ended (no yes/no). Inclusive. No politics, religion, finance or medical. Inviting for someone who just joined.</li>
  <li><strong>Tailored to context.</strong> If you typed <em>"welcoming Maya"</em>, the questions skew warm and intro-friendly. If you typed <em>"design + engineering mixer"</em>, they skew toward cross-functional curiosity.</li>
  <li><strong>Falls back gracefully.</strong> If the AI hiccups, the game uses a hand-curated list of warm fallbacks so the round still runs.</li>
</ul>
<p>The AI never participates in the conversation itself - it just sets the question and gets out of the way. Your sub-processor's no-training agreement means none of the room content or context is used to train any model.</p>

<h2 id="variations">Variations &amp; when to use them</h2>
<ul>
  <li><strong>New-hire welcome:</strong> 3 rounds, 5 minutes each, pairs. Add context naming the new joiner. <em>This is the canonical use.</em></li>
  <li><strong>Cross-team mixer (quarterly):</strong> 3 rounds, 7 minutes, trios. Context: <em>"Q1 design + engineering + product mixer"</em>. Trios let people who don't speak first listen first.</li>
  <li><strong>Offshore + onshore connection day:</strong> 4 rounds, 4 minutes, pairs. Faster pace forces breadth over depth. Run twice - once per time zone overlap.</li>
  <li><strong>Post-reorg reset:</strong> 2 rounds, 8 minutes, pairs. Longer rounds let people actually catch up after structural change. Context: <em>"post-reorg reset, new reporting lines"</em>.</li>
</ul>

<h2 id="pitfalls">Common pitfalls (and how to avoid them)</h2>
<ul>
  <li><strong>Too many rounds.</strong> Three is the limit. After three rounds, energy drops. Stop on a high.</li>
  <li><strong>Skipping the context field.</strong> The default icebreakers are fine. With context they're <em>noticeably</em> warmer. Spend the 20 seconds.</li>
  <li><strong>Letting it become a recurring chore.</strong> Run Meeting Roulette when you have a reason - a new hire, a re-org, a cross-team kickoff. Weekly random mixers are a different product (use Donut if that's what you want).</li>
  <li><strong>Not telling people it's optional.</strong> Mandatory icebreakers are how people learn to hate icebreakers.</li>
</ul>

<h2 id="faq">FAQ</h2>
<h3>How is this different from Donut, Mystery, or a Slack random-coffee bot?</h3>
<p>Those tools run on a recurring schedule, pairing people across days or weeks via DM. Meeting Roulette runs <em>live, in one session</em>. Donut is great for ongoing background pairing; Meeting Roulette is great for the moment you want everyone meeting everyone in 15 minutes.</p>
<h3>Do I need calendar or Slack integration?</h3>
<p>No. Open the room, share the link, play. No admin panel, no integrations, no maintenance.</p>
<h3>How many people can play at once?</h3>
<p>Best at 4-16. Below 4 it's just a single conversation. Above 16, switch to <a href="/blog/team-games-for-remote-teams">a different game</a> (Trivia or Emoji Tales scale further).</p>
<h3>What if someone's audio fails mid-round?</h3>
<p>The pairing is shown to everyone. Their teammate can drop a quick chat message ("I'll catch you in the next round") and the host advances when ready.</p>
<h3>Is anything stored?</h3>
<p>No. Once the room closes, the pairings and icebreakers are gone. There's no history, no analytics, no PII.</p>
<h3>Where do I start?</h3>
<p>Open <a href="/play">the games lobby</a>, create a room, share the link with your team. Five minutes from now, you're welcoming someone.</p>
`
  },
  {
    slug: 'online-pictionary-for-remote-teams',
    title: 'Online Pictionary for Remote Teams - Free, No Sign-Up, AI-Hinted (2026)',
    description:
      'Play Pictionary online with your remote or hybrid team. Free, no install, no sign-up. AI picks the word, AI gives no-spoiler hints, and guesses sync in real time.',
    keywords:
      'online pictionary, free pictionary online, pictionary for remote teams, virtual pictionary, pictionary online multiplayer, online drawing game, online drawing guessing game, pictionary alternative, browser pictionary, pictionary AI, team building drawing game',
    author: baseAuthor,
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-18',
    readingMinutes: 8,
    tags: ['Team Building', 'Games', 'Remote Work'],
    hero: {
      eyebrow: 'Pictionary online',
      title: 'Online Pictionary for remote teams - free, fast, no sign-up',
      subtitle: 'Doodle Quest is the Pictionary you actually want at work: shared canvas, AI-picked words, no-spoiler hints, real-time guessing.',
      gradient: 'linear-gradient(135deg,#f97316 0%,#ec4899 55%,#8b5cf6 100%)'
    },
    toc: [
      { id: 'why', label: 'Why Pictionary works (still)' },
      { id: 'how', label: 'How Doodle Quest works' },
      { id: 'ai-role', label: 'How AI helps without ruining the game' },
      { id: 'rules', label: 'Suggested rules &amp; scoring' },
      { id: 'themes', label: 'Theme suggestions for your team' },
      { id: 'vs', label: 'Doodle Quest vs. Skribbl, Drawasaurus, Gartic' },
      { id: 'faq', label: 'FAQ' }
    ],
    body: `
<h2 id="why">Why Pictionary still works for remote teams</h2>
<p>Most virtual icebreakers fail because they feel <em>performed</em>. Pictionary is the rare game that survives Zoom intact: drawing breaks the grid-of-faces awkwardness because everyone is watching a real thing happen in real time. You laugh at the dog that looks like a potato. You yell "IS THAT A LADDER" into your mic. Nobody asks "what's your spirit animal" and waits 11 seconds for someone to volunteer.</p>
<p><strong>Doodle Quest</strong> is reAItro's free, browser-based take on Pictionary, built specifically for remote and hybrid work teams. No downloads, no accounts, no scheduling. <a href="/play">Open the games lobby</a>, create a room, share the link, draw.</p>

<h2 id="how">How Doodle Quest works</h2>
<ol>
  <li><strong>One player draws.</strong> They get an AI-chosen word matched to a theme and difficulty. Everyone else sees an empty canvas and a chat input.</li>
  <li><strong>Everyone guesses live.</strong> Type in the chat. The first correct guess locks in their score; subsequent correct guesses also score, just less.</li>
  <li><strong>Drawer can request hints.</strong> Up to three AI-generated hints per round - phrased to <em>nudge without spoiling</em>. ("Think about everyday life - you've seen this often.")</li>
  <li><strong>Rotate.</strong> Next drawer, next word. The leaderboard updates on the right.</li>
  <li><strong>End on a high.</strong> Three rounds is usually plenty for a workday wind-down.</li>
</ol>

<h2 id="ai-role">How AI helps without ruining the game</h2>
<p>The two things that always wreck self-hosted Pictionary are <strong>word selection</strong> (someone has to be the wordsmith) and <strong>fairness</strong> (the same five words keep appearing). Doodle Quest delegates both to AI:</p>
<ul>
  <li><strong>Word pool, on demand.</strong> Pick a theme - Agile &amp; Tech, Movies, Food, Office Life, General - and a difficulty (easy / medium / hard). The model returns a fresh word the team hasn't seen yet that session.</li>
  <li><strong>No-spoiler hints.</strong> When the drawer is stuck, they can request a hint. The model is told <em>explicitly</em> not to include the word - and there's a defensive check that swaps in a safe fallback if it slips through.</li>
  <li><strong>Curated fallbacks.</strong> If the model hiccups, a hand-picked list of words and hints kicks in so the round still runs.</li>
</ul>
<p>The AI never <em>plays</em>. It just sets the table.</p>

<h2 id="rules">Suggested rules &amp; scoring</h2>
<ul>
  <li><strong>90-second rounds.</strong> Long enough to draw a decent picture, short enough to stay punchy.</li>
  <li><strong>First correct: full points. Later correct: partial.</strong> This is the default. It rewards speed without leaving slower guessers with nothing.</li>
  <li><strong>Drawer score = how fast someone guessed.</strong> Encourages clear drawings, not just clever wordplay.</li>
  <li><strong>One hint per minute, max three.</strong> Keeps the AI as a safety net, not a crutch.</li>
  <li><strong>No typing words you suspect.</strong> Honor system. Same as real Pictionary.</li>
</ul>

<h2 id="themes">Theme suggestions by team</h2>
<ul>
  <li><strong>Engineering team:</strong> Agile &amp; Tech (medium). Wrestling "code review", "merge conflict" or "sprint" into a drawing is half the fun.</li>
  <li><strong>Cross-functional / mixed team:</strong> Movies (easy). Lowest common denominator, universally drawable.</li>
  <li><strong>Onboarding session:</strong> Food (easy). Friendly, culturally safe, fast wins.</li>
  <li><strong>End-of-quarter wind-down:</strong> Office Life (hard). Drawing "performance review" or "town hall" hits different after Q3.</li>
</ul>

<h2 id="vs">Doodle Quest vs. Skribbl, Drawasaurus, Gartic Phone</h2>
<p>Honest comparison - these are all good tools and the right pick depends on what you need:</p>
<ul>
  <li><strong>Skribbl.io</strong> - fast, free, classic. But ads and a community word list that doesn't fit work themes.</li>
  <li><strong>Drawasaurus</strong> - clean, but no AI assistance and limited themes.</li>
  <li><strong>Gartic Phone</strong> - different game (telephone-style drawing chain). Great, but not Pictionary.</li>
  <li><strong>Doodle Quest</strong> - work-themed AI word selection, drawer-side hints, integrated with your retrospective tool if you also run retros here, no ads, no account required.</li>
</ul>
<p>If you're already using reAItro for retros, Doodle Quest is the zero-friction option. If you just need a one-off browser game, Skribbl is fine. If you want themed words plus AI hints plus a real-time team scoreboard with persistent identity inside your tool, Doodle Quest is what we'd pick.</p>

<h2 id="faq">FAQ</h2>
<h3>Is online Pictionary free?</h3>
<p>Doodle Quest is free. No credit card, no sign-up required to join a room (anonymous mode is supported). Heavy AI usage is rate-limited so we can keep the service free.</p>
<h3>How many people can play?</h3>
<p>Comfortably up to about 20 active players. Beyond that, split into two rooms or switch to <a href="/blog/virtual-trivia-for-team-meetings">Trivia Race</a> instead.</p>
<h3>Do I need to install anything?</h3>
<p>No. It runs in any modern browser, mobile included. The canvas supports touch input.</p>
<h3>Can the AI accidentally reveal the word in a hint?</h3>
<p>The prompt explicitly forbids the model from including the word, and there's a defensive check that swaps in a safe fallback if the model slips up. In practice it happens vanishingly rarely.</p>
<h3>Is anything saved when the game ends?</h3>
<p>No. The drawings, guesses, and scoreboard are gone the moment the room closes.</p>
<h3>Can I run Doodle Quest alongside a retrospective?</h3>
<p>Yes. Every reAItro retrospective has a 🎮 <em>Play Games</em> button that opens Doodle Quest and the other four games in a modal. Great for ending a long retro on a high.</p>
`
  },
  {
    slug: 'virtual-trivia-for-team-meetings',
    title: 'Virtual Trivia for Team Meetings: 7 Categories &amp; a Free AI Tool (2026)',
    description:
      'Run virtual trivia for your team meeting in under 10 minutes. Free, no sign-up, AI-generated questions across 7 categories with shared live scoreboard. Built for remote and hybrid teams.',
    keywords:
      'virtual trivia, online trivia for teams, team trivia game, virtual trivia for meetings, free online trivia, virtual office trivia, work trivia, remote team trivia, AI trivia generator, trivia for zoom meeting, online quiz for teams, team building trivia',
    author: baseAuthor,
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-18',
    readingMinutes: 9,
    tags: ['Team Building', 'Games', 'Remote Work'],
    hero: {
      eyebrow: 'Virtual trivia',
      title: 'Virtual trivia for team meetings - free, AI-generated, 10 minutes flat',
      subtitle: 'Trivia Race spins up a fresh question on demand, runs a buzzer race, tracks scores live. No QuizUp account, no $200/month SaaS.',
      gradient: 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 50%,#8b5cf6 100%)'
    },
    toc: [
      { id: 'why', label: 'Why trivia works for remote teams' },
      { id: 'how', label: 'How Trivia Race works' },
      { id: 'categories', label: '7 categories to pick from' },
      { id: 'ai-role', label: 'How AI generates the questions' },
      { id: 'host-tips', label: 'Host tips' },
      { id: 'vs', label: 'How it compares to Kahoot, QuizBreaker, Water Cooler Trivia' },
      { id: 'faq', label: 'FAQ' }
    ],
    body: `
<h2 id="why">Why virtual trivia works for remote teams</h2>
<p>Trivia is the most reliable virtual icebreaker on the market. It works because the cognitive load is low (just pick A/B/C/D), the feedback is instant (you were right or you weren't), and it produces small moments of <em>I-didn't-know-you-knew-that</em> across people who'd otherwise never speak. It's also the only icebreaker an introvert and an extrovert enjoy equally.</p>
<p>The catch is that most virtual trivia tools are either expensive (Water Cooler Trivia, $200+/month for teams), heavy (Kahoot needs setup time), or made for kids in a classroom (most quiz apps). <strong>Trivia Race</strong> in reAItro is free, generates fresh AI-written questions on demand, and runs from a link in your channel.</p>

<h2 id="how">How Trivia Race works</h2>
<ol>
  <li><strong>Host opens a room.</strong> <a href="/play">/play</a> → Create Game Room → share link.</li>
  <li><strong>Pick category &amp; difficulty.</strong> Or leave on "General".</li>
  <li><strong>Click Start.</strong> The AI returns one multiple-choice question with four options, the correct index, and a one-line explanation. The question appears at the same time for everyone.</li>
  <li><strong>Everyone buzzes in.</strong> First correct answer wins a speed bonus. Anyone else who's correct still scores.</li>
  <li><strong>Reveal &amp; explain.</strong> The right answer is shown, plus the explanation. Conversation happens here - "oh wow, I didn't know that".</li>
  <li><strong>Next question.</strong> Five rounds is the sweet spot. Done in under 10 minutes.</li>
</ol>

<h2 id="categories">7 categories to pick from</h2>
<ul>
  <li><strong>General knowledge</strong> - the safe default, broad appeal, no expertise required.</li>
  <li><strong>Movies &amp; TV</strong> - high engagement, cross-cultural variability adds humor.</li>
  <li><strong>Tech &amp; coding</strong> - great for engineering teams. Watch the principal engineers and grads tie.</li>
  <li><strong>Science</strong> - surprisingly nostalgic for most adults ("oh god, GCSE physics").</li>
  <li><strong>Geography</strong> - well-suited to multi-region teams. Bonus: people share stories about places they've lived.</li>
  <li><strong>Sports</strong> - split your team into the sports-obsessed and everyone else. Mix this one in, don't make it the whole round.</li>
  <li><strong>Food &amp; drink</strong> - light, friendly, never controversial. Good for new-hire welcome.</li>
</ul>

<h2 id="ai-role">How AI generates the questions</h2>
<p>The hard part of trivia is the question pool. Pre-made decks go stale; writing your own is hours of work. We let AI generate each question on demand, with a strict schema:</p>
<pre><code>{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correct_index": 0,
  "explanation": "one short sentence why the answer is correct"
}</code></pre>
<p>The model is constrained to: a single category + difficulty, safe-for-work, no offensive material, four options exactly, integer 0-3 for the correct index. The response is parsed and validated before being shown - if the model returns malformed output, a curated fallback question is used instead. In practice this almost never fires.</p>
<p>What this gets you in practice: <strong>endless fresh questions</strong>. Run trivia every Friday for six months and you won't repeat.</p>

<h2 id="host-tips">Host tips for actually-fun trivia</h2>
<ul>
  <li><strong>Five rounds, never ten.</strong> Trivia fatigue is real. End on a high.</li>
  <li><strong>Mix categories.</strong> Rounds 1-3 General → Round 4 Tech → Round 5 Food. Keeps everyone in the game.</li>
  <li><strong>Read the explanation out loud.</strong> The conversation after the answer is where the team-building actually happens. Don't skip it.</li>
  <li><strong>Don't apologize for easy questions.</strong> Easy questions are <em>good</em>. They keep everyone scoring.</li>
  <li><strong>Cap difficulty at "medium" for mixed teams.</strong> Hard questions favor the trivia nerds and lose everyone else.</li>
</ul>

<h2 id="vs">How Trivia Race compares</h2>
<ul>
  <li><strong>Kahoot</strong> - great in classrooms. For work meetings the gameshow UI is a lot, and you have to pre-build the question bank.</li>
  <li><strong>QuizBreaker</strong> - async, scheduled to email. Different product. Good for ongoing rather than live.</li>
  <li><strong>Water Cooler Trivia</strong> - weekly email quiz. Best-in-class for async, expensive for live use.</li>
  <li><strong>Trivia Race</strong> - live, in-browser, AI-generated questions, free, integrated with your retros. Zero setup, zero ongoing cost.</li>
</ul>
<p>None of these are wrong - they're optimizing for different things. Trivia Race is the right pick when you want trivia <em>right now</em>, for free, with infinite question variety.</p>

<h2 id="faq">FAQ</h2>
<h3>Is virtual trivia free?</h3>
<p>Yes - Trivia Race in reAItro is free. We rate-limit heavy use so the service stays free for everyone.</p>
<h3>How long does a session take?</h3>
<p>Five questions ~7-10 minutes including the chat after each answer. Good for the end of a 25-minute meeting or as a standalone 10-minute slot.</p>
<h3>How many people can play?</h3>
<p>Scales comfortably to 20+ active players. Above 30, latency on the buzzer becomes noticeable; split into two rooms or run consecutively.</p>
<h3>Can I write my own questions instead?</h3>
<p>The current version uses AI-generated questions only. If you need pre-written question banks (e.g. for company-specific quiz nights), tell us - it's on our radar.</p>
<h3>What if the AI generates a wrong question?</h3>
<p>Schema-validated responses + a curated fallback means malformed questions never reach the player. Occasionally a fact may be debatable; the host can skip the question with one click.</p>
<h3>Can we play it as part of a retrospective?</h3>
<p>Yes. Every reAItro retro has a 🎮 <em>Play Games</em> button. Great as a 5-minute reset between the discussion phase and action items.</p>
`
  },
  {
    slug: 'two-truths-and-a-lie-examples',
    title: 'Two Truths and a Lie: 60 Good Examples + a Free Online Tool (2026)',
    description:
      'Stuck on what to say for Two Truths and a Lie? 60 work-appropriate examples by category, tips for writing a convincing lie, and a free AI-assisted online tool to play with your team.',
    keywords:
      'two truths and a lie, two truths and a lie examples, two truths and a lie ideas, good two truths and a lie, two truths one lie, two truths and a lie work, two truths and a lie online, two truths and a lie game, two truths and a lie for team building, two truths and a lie virtual',
    author: baseAuthor,
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-18',
    readingMinutes: 10,
    tags: ['Team Building', 'Games', 'Icebreakers'],
    hero: {
      eyebrow: 'Two Truths and a Lie',
      title: 'Two Truths and a Lie: 60 good examples + a free online tool',
      subtitle: 'How to write a convincing lie, work-appropriate examples by category, and a browser-based version of the game with AI-suggested lies when you\'re stuck.',
      gradient: 'linear-gradient(135deg,#22c55e 0%,#0ea5e9 55%,#6366f1 100%)'
    },
    toc: [
      { id: 'how-to-play', label: 'How to play (the rules)' },
      { id: 'write-a-good-lie', label: 'How to write a convincing lie' },
      { id: 'examples-travel', label: '15 travel examples' },
      { id: 'examples-food', label: '15 food examples' },
      { id: 'examples-work', label: '15 work examples' },
      { id: 'examples-hobbies', label: '15 hobbies examples' },
      { id: 'online-tool', label: 'Play online for free' },
      { id: 'faq', label: 'FAQ' }
    ],
    body: `
<h2 id="how-to-play">How to play (the rules)</h2>
<p>Each player shares three statements about themselves: two true, one false. The rest of the group tries to identify which one is the lie. Whoever spots the most lies wins; bonus points if your lie fools the most teammates. It's the most reliable icebreaker on the market because it does what almost no other game does - it makes <em>everyone</em> share something real about themselves in under 60 seconds.</p>
<p>The version below is the work-friendly variant: statements stay clean, nothing too personal, and the group votes simultaneously rather than calling out one person at a time.</p>

<h2 id="write-a-good-lie">How to write a convincing lie (the actual hard part)</h2>
<p>The lie is the whole game. Most people botch it by making the lie too outlandish ("I've been to the moon") or too obvious ("I love Excel"). A good lie is <em>close to plausibly true</em>. Here's how to write one:</p>
<ol>
  <li><strong>Start from something true.</strong> Take a real fact about yourself and change one detail. "I've been to 8 countries" → "I've been to 18 countries". Same shape, different number.</li>
  <li><strong>Mirror your truths.</strong> If your two true statements are mundane, the lie should be mundane. If they're impressive, the lie should be impressive.</li>
  <li><strong>Specificity sells.</strong> "I once met a celebrity at an airport" is vague. "I sat next to Daniel Radcliffe on a flight to JFK in 2017" is suspiciously specific - which makes it land either way.</li>
  <li><strong>Borrow from teammates.</strong> A lie that sounds like something <em>they</em> would say is harder to spot. (Mild gaslighting, all in good fun.)</li>
  <li><strong>Don't pick your two true statements first.</strong> Pick the lie first and build truths around it. You'll match tone better.</li>
</ol>

<h2 id="examples-travel">15 travel examples (mix and match - pick two truths and a lie)</h2>
<ul>
  <li>I've been to all seven continents</li>
  <li>I once missed a flight because I was reading and lost track of time</li>
  <li>I lived in three different countries before I turned 18</li>
  <li>I've taken the Trans-Siberian Railway end to end</li>
  <li>I got lost in Tokyo for six hours without a phone</li>
  <li>I have a tattoo I got in a foreign country and immediately regretted</li>
  <li>I've never been on a plane until I was 21</li>
  <li>I once drove across the US in under 50 hours</li>
  <li>I had to spend a night in an airport because of a volcano</li>
  <li>I've stayed in over 30 different hostels</li>
  <li>I learned to ski as an adult, on a work trip</li>
  <li>I've been kicked out of a museum (politely)</li>
  <li>I bought a car the day I arrived in a new country</li>
  <li>I once gave directions to a tourist in a language I don't speak fluently</li>
  <li>I went to a country on a whim because the flights were $14</li>
</ul>

<h2 id="examples-food">15 food examples</h2>
<ul>
  <li>I've worked in a restaurant kitchen</li>
  <li>I make my own kombucha</li>
  <li>I cannot eat coriander - it tastes like soap to me</li>
  <li>I've eaten the exact same breakfast for over 1,000 days in a row</li>
  <li>I once entered a chili-eating contest and finished second</li>
  <li>I'm a certified barista</li>
  <li>I grew up on a farm that had its own cows</li>
  <li>I can identify olive oil brands by taste</li>
  <li>I've been a vegetarian, vegan, pescatarian, and carnivore at different points</li>
  <li>I have a sourdough starter that's older than my niece</li>
  <li>I once made my own cheese (badly)</li>
  <li>I've been to a Michelin-starred restaurant on a budget tour</li>
  <li>I cook every meal at home in a 14-cm pan</li>
  <li>I owned a food truck for one summer</li>
  <li>I'm allergic to something extremely common but I'll never tell you what</li>
</ul>

<h2 id="examples-work">15 work examples (good for onboarding)</h2>
<ul>
  <li>My first job was at a place that no longer exists</li>
  <li>I've been fired exactly once and it was the best thing that ever happened to me</li>
  <li>I've worked in 5+ different industries</li>
  <li>I once shipped a bug that took down production on my third day</li>
  <li>I worked night shifts for a year before going into tech</li>
  <li>I've turned down a job offer because the office had no windows</li>
  <li>I have a college degree completely unrelated to what I do now</li>
  <li>I once interviewed for the job I currently have, was rejected, and reapplied three years later</li>
  <li>I've worked in three different timezones in the same week</li>
  <li>I taught myself the skill I now do professionally</li>
  <li>I have an Erdős number</li>
  <li>I've negotiated a raise by leaving and coming back</li>
  <li>I once accidentally emailed my boss something meant for my partner</li>
  <li>I worked for a year without telling anyone in my family what I actually did</li>
  <li>I've written code that's still running in production years after I left the company</li>
</ul>

<h2 id="examples-hobbies">15 hobbies examples</h2>
<ul>
  <li>I can solve a Rubik's cube in under two minutes</li>
  <li>I run an Etsy shop nobody at work knows about</li>
  <li>I've completed a marathon</li>
  <li>I play an instrument almost nobody has heard of</li>
  <li>I keep a journal I've written in every day for over a decade</li>
  <li>I once met someone famous and didn't realize until afterwards</li>
  <li>I have over 200 plants at home</li>
  <li>I'm a certified scuba diver</li>
  <li>I've never seen Star Wars</li>
  <li>I've read every book on the Booker shortlist for the last five years</li>
  <li>I beat the speedrun world record for a video game (it was a small game)</li>
  <li>I can knit, but only one shape</li>
  <li>I've performed stand-up comedy in front of strangers, exactly once</li>
  <li>I've taught myself to juggle and can do five balls</li>
  <li>I write fanfiction under a pseudonym</li>
</ul>

<h2 id="online-tool">Play Two Truths and a Lie online - free</h2>
<p>If you'd rather just play, open the <a href="/play">games lobby</a> and create a Two Truths and a Lie room. Everyone joins via the link. Each player writes their two truths and a lie, the group votes simultaneously, and reveals are shown all at once. There's an <em>"🤖 AI: suggest a lie"</em> button when you're stuck - it returns three plausible-but-fictional one-liners (you pick what to actually submit) so cold-start doesn't kill the game.</p>
<p>The AI never reads your real life. It just helps you draft a convincing fake. None of the room content is stored after the game ends, and no input is used to train any model (we operate under an enterprise no-training agreement with our AI provider).</p>

<h2 id="faq">FAQ</h2>
<h3>What are good Two Truths and a Lie examples for work?</h3>
<p>The work examples section above has 15. Stay away from anything political, religious, or about pay/personal finance. Travel, food and hobbies are the safest categories for mixed work groups.</p>
<h3>How do you win Two Truths and a Lie?</h3>
<p>Two ways: spot lies (one point per correct guess) and fool teammates (one point for each person who voted for one of your truths instead of your lie). Most points wins.</p>
<h3>How many people can play?</h3>
<p>Best at 4-10. Below 4 the voting math is boring; above 10 the round time gets long. For bigger groups, split into rooms or run two parallel sessions.</p>
<h3>What's a good Two Truths and a Lie for a new hire?</h3>
<p>For a new joiner, lean into the "Travel" or "Hobbies" categories - gives the team a way to start follow-up conversations without immediately diving into work. Save "Work" examples for once they're settled.</p>
<h3>Is the online tool free?</h3>
<p>Yes. No credit card, no account required to join a room.</p>
`
  },
  {
    slug: 'emoji-story-games-for-teams',
    title: 'Emoji Story Games for Teams: A 3-Minute Icebreaker That Actually Works',
    description:
      'Emoji-only storytelling is the fastest icebreaker for cross-cultural and remote teams. Free online version with AI prompts and AI judging. Examples, prompts, and how to host.',
    keywords:
      'emoji story game, emoji storytelling, emoji icebreaker, emoji games for teams, emoji story prompts, emoji team building, virtual icebreaker emoji, multilingual team icebreaker, cross-cultural icebreaker, emoji game online, AI emoji game',
    author: baseAuthor,
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-18',
    readingMinutes: 6,
    tags: ['Team Building', 'Games', 'Icebreakers'],
    hero: {
      eyebrow: 'Emoji Tales',
      title: 'Emoji story games - the 3-minute icebreaker that actually works',
      subtitle: 'AI picks the prompt, your team replies in emojis only, AI picks the most creative entry. Zero writing, zero language barriers, three minutes.',
      gradient: 'linear-gradient(135deg,#ec4899 0%,#f97316 55%,#facc15 100%)'
    },
    toc: [
      { id: 'why', label: 'Why emoji-only works' },
      { id: 'how', label: 'How Emoji Tales plays out' },
      { id: 'prompts', label: '20 prompts to steal' },
      { id: 'when', label: 'When to run it' },
      { id: 'faq', label: 'FAQ' }
    ],
    body: `
<h2 id="why">Why emoji-only icebreakers work</h2>
<p>Emoji-only storytelling is the unsung hero of icebreakers. Three reasons it works where everything else fails:</p>
<ol>
  <li><strong>It bypasses language fluency.</strong> A team with members in Bangalore, Berlin and Boston can all express "great sprint, then deploy on Friday" with 🚀✅🚀🚀💥 - no English required.</li>
  <li><strong>It's universally fast.</strong> Even slow typists can pick three emojis in 15 seconds.</li>
  <li><strong>It rewards humor over articulacy.</strong> The most creative entry usually comes from someone who barely says anything in standups.</li>
</ol>
<p><strong>Emoji Tales</strong> is reAItro's take: prompt appears, everyone types their emoji story, AI judges the most creative entry with a one-line warm reason. Three minutes, max.</p>

<h2 id="how">How Emoji Tales plays out</h2>
<ol>
  <li><strong>Host opens the game.</strong> Picks a prompt from the suggested list or types a custom one.</li>
  <li><strong>30-second timer.</strong> Everyone submits a story made <em>only</em> of emojis.</li>
  <li><strong>All entries reveal simultaneously.</strong> Nobody sees others' answers until the timer ends - keeps it un-copyable.</li>
  <li><strong>AI picks a winner.</strong> The model judges on prompt-fit and creativity. Returns the winner's name and a one-line reason ("clever play on the deploy-then-vacation theme - the 🌴 at the end made it"). The host stays neutral, no awkward favoritism.</li>
  <li><strong>Reset, new prompt.</strong> One or two more rounds is plenty.</li>
</ol>

<h2 id="prompts">20 emoji story prompts to steal</h2>
<ul>
  <li>Sum up your last sprint in emojis</li>
  <li>Describe your last vacation</li>
  <li>Your week as a movie poster</li>
  <li>How Monday felt</li>
  <li>The retro you wish we'd had</li>
  <li>Your relationship with your inbox</li>
  <li>The vibe of your engineering team this quarter</li>
  <li>How the last all-hands felt</li>
  <li>Predict next sprint in emojis</li>
  <li>Your morning routine</li>
  <li>The launch we just shipped, told in emojis</li>
  <li>Your spirit ticket from the backlog</li>
  <li>Re-org as a fairy tale</li>
  <li>How you actually feel about the new design system</li>
  <li>If your job had a soundtrack, the emoji version</li>
  <li>Onboarding week, recap</li>
  <li>Code review through the ages</li>
  <li>Your meeting calendar this week</li>
  <li>A standup that went off the rails</li>
  <li>The product launch as a hero's journey</li>
</ul>

<h2 id="when">When to run Emoji Tales</h2>
<ul>
  <li><strong>Monday standup warmup.</strong> 3 minutes. Wakes everyone up better than coffee.</li>
  <li><strong>Retrospective opener.</strong> Instead of "how do you feel today?", drop the prompt "your last sprint in emojis". Faster, funnier, more honest.</li>
  <li><strong>Cross-cultural meeting.</strong> Multilingual teams love this because nobody has the language disadvantage.</li>
  <li><strong>Between two long meetings.</strong> 3-minute energy spike. Beats a coffee break for re-engagement.</li>
  <li><strong>Friday wind-down.</strong> "Sum up the week in emojis" never stops being funny.</li>
</ul>

<h2 id="faq">FAQ</h2>
<h3>How long does Emoji Tales take?</h3>
<p>One round is about 90 seconds: 30 to submit, ~30 for reveals, ~30 for the AI to pick and explain. Two rounds is the right session length.</p>
<h3>What if someone submits something inappropriate?</h3>
<p>The AI judge is told to ignore inappropriate entries. In practice work teams self-police; we haven't seen a problem.</p>
<h3>How does the AI judge?</h3>
<p>It's prompted to pick the most creative on-theme entry and give a one-line warm reason. It does not score based on emoji count or complexity - it picks for charm.</p>
<h3>Is the game multilingual?</h3>
<p>Effectively yes - emojis are language-agnostic. The AI judgment is in English by default but works fine for teams that operate in any language.</p>
<h3>Where do I play?</h3>
<p>Open the <a href="/play">games lobby</a>, create a room, share the link. Two minutes from now you're laughing at someone's interpretation of "Monday".</p>
`
  },
  {
    slug: 'donut-alternatives-for-slack',
    title: 'Donut Alternatives for Slack: 5 Free Options That Don\'t Need a Subscription (2026)',
    description:
      'Looking for a Donut alternative? Five free options for random pairing, virtual coffee, and team mixers - including in-meeting alternatives that need no Slack integration at all.',
    keywords:
      'donut alternative, donut bot alternative, slack donut alternative, free donut alternative, virtual coffee tool, random pairing slack, slack random coffee, coffee chat tool, slack matching bot, donut slack alternative free, watercooler slack',
    author: baseAuthor,
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-18',
    readingMinutes: 8,
    tags: ['Team Building', 'Remote Work', 'Tools'],
    hero: {
      eyebrow: 'Tool comparison',
      title: 'Donut alternatives for Slack - 5 options, plus when you don\'t need Donut at all',
      subtitle: 'Honest comparison of Donut, Mystery, Chime, RandomCoffee - and when a live in-meeting pairing tool like Meeting Roulette is the better call.',
      gradient: 'linear-gradient(135deg,#f97316 0%,#ef4444 60%,#ec4899 100%)'
    },
    toc: [
      { id: 'what-is', label: 'What Donut does, and why people leave' },
      { id: 'alternatives', label: '5 alternatives, honestly compared' },
      { id: 'no-bot', label: 'When you don\'t need a bot at all' },
      { id: 'choosing', label: 'How to choose' },
      { id: 'faq', label: 'FAQ' }
    ],
    body: `
<h2 id="what-is">What Donut does, and why people leave</h2>
<p>Donut is a Slack app that pairs people randomly on a recurring schedule and prompts them to meet for coffee. It became a default for remote-work onboarding around 2020 and is still widely used. What pushes teams to look for an alternative:</p>
<ul>
  <li><strong>Pricing.</strong> Donut now costs around $99/month for the basic plan and significantly more at scale. For a startup or a side-of-desk culture initiative, that's hard to justify.</li>
  <li><strong>Engagement decay.</strong> Pairings get DM'd; many never actually schedule the chat. The "did the meeting happen" loop is weak.</li>
  <li><strong>Slack-only.</strong> If your team is on Discord, Teams, Mattermost or doesn't want a Slack app installed, you're out of options.</li>
  <li><strong>Wrong shape for your use case.</strong> If what you actually want is "everyone meets everyone in one 15-minute session" (new-hire welcome, re-org reset), Donut's async drip is the wrong tool.</li>
</ul>

<h2 id="alternatives">5 alternatives, honestly compared</h2>

<h3>1. Mystery / Chime</h3>
<p><strong>Best for:</strong> teams that want async pairing with structured prompts.</p>
<p><strong>How it differs from Donut:</strong> richer activity prompts ("share a photo of your desk", "play this micro-game") to combat the "we paired but never met" decay.</p>
<p><strong>Pricing:</strong> mid-tier SaaS, similar to Donut.</p>

<h3>2. RandomCoffee</h3>
<p><strong>Best for:</strong> larger organizations that want admin controls over pairings (departments, seniority, geography).</p>
<p><strong>How it differs:</strong> rule-based matching is the differentiator. You can guarantee cross-team pairings.</p>
<p><strong>Pricing:</strong> per-seat, enterprise-flavored.</p>

<h3>3. Slack Workflow Builder + a Google Sheet</h3>
<p><strong>Best for:</strong> teams that want to roll their own and avoid yet another SaaS bill.</p>
<p><strong>How it works:</strong> a weekly workflow randomizes the team list (in a Google Sheet via Apps Script) and posts pairings to a channel.</p>
<p><strong>Pricing:</strong> free.</p>
<p><strong>Caveat:</strong> someone has to maintain it. Almost always abandoned within 3 months.</p>

<h3>4. WaterCooler / similar free-tier bots</h3>
<p><strong>Best for:</strong> small teams (under 20) that want Donut's shape on a free tier.</p>
<p><strong>How it works:</strong> generous free tier for small teams, paid plans above. Same DM-and-hope-they-meet pattern.</p>

<h3>5. Meeting Roulette (in reAItro)</h3>
<p><strong>Best for:</strong> live, in-meeting pairing instead of background scheduling.</p>
<p><strong>How it works:</strong> open a room link, everyone joins, random pairs get an AI-generated icebreaker per round, three rotations, everyone has met someone new in 15 minutes. <em>No Slack integration. No scheduling. No admin panel.</em> Free.</p>
<p><strong>Why it's on this list:</strong> for half of the use cases people install Donut for - onboarding a new hire, re-org reset day, cross-team kickoff - Meeting Roulette is the better tool because it produces actual conversations in real time rather than DMs people will ignore.</p>

<h2 id="no-bot">When you don't need a Slack bot at all</h2>
<p>Here's the unpopular take: <strong>most teams installing Donut don't actually need recurring async pairings</strong>. They need:</p>
<ul>
  <li>A way to welcome new joiners.</li>
  <li>A way to break silos during/after a re-org.</li>
  <li>A way for offshore + onshore teams to actually meet each other.</li>
  <li>A periodic "shake the team out of routine" moment.</li>
</ul>
<p>All four are better served by a <em>single live 15-minute session</em> than by 12 weeks of "you've been paired with Maya 🍩" messages that 60% of people ignore.</p>
<p>If recurring async pairing <em>is</em> what you want - fine, Donut is good at that. But before you sign up, ask yourself: <em>do we actually want a calendar-burning meeting every two weeks, or do we want one good 15-minute mixer when there's a reason?</em></p>

<h2 id="choosing">How to choose</h2>
<ul>
  <li><strong>You want recurring async pairings, and money's not the constraint:</strong> Donut.</li>
  <li><strong>You want recurring async pairings, but Donut is too expensive:</strong> WaterCooler or a Slack Workflow.</li>
  <li><strong>You want admin control over cross-team matching:</strong> RandomCoffee.</li>
  <li><strong>You're not on Slack:</strong> Mattermost/Teams have native integrations; for everyone else, a live in-meeting tool is simpler.</li>
  <li><strong>You want everyone to meet everyone, in one session:</strong> <a href="/play">Meeting Roulette</a>. Free, no install.</li>
  <li><strong>You want both:</strong> Donut for the background, Meeting Roulette for the kickoff moments. They don't conflict.</li>
</ul>

<h2 id="faq">FAQ</h2>
<h3>What's the best free Donut alternative?</h3>
<p>It depends. For recurring async pairings on Slack, WaterCooler's free tier is the closest. For live in-meeting random pairings, Meeting Roulette is free and needs no Slack at all.</p>
<h3>Why is Donut so expensive?</h3>
<p>Donut prices per active employee. For organizations of 100+, the cost adds up. Smaller teams are usually fine on free tiers of alternatives.</p>
<h3>Is Donut worth it?</h3>
<p>If your team genuinely engages with the pairings (calendar invites get sent, chats actually happen), yes. If pairings get ignored - measure this in your channels - it's not.</p>
<h3>Do I need a Slack admin to install these tools?</h3>
<p>Slack-based tools, yes. Meeting Roulette has no Slack integration at all - anyone can open a room and share a link.</p>
<h3>Can I run Donut and Meeting Roulette together?</h3>
<p>Yes, and we'd recommend it for any team over ~30 people. Donut for background; Meeting Roulette for the moments that need everyone to meet everyone live.</p>
`
  },
  {
    slug: 'virtual-icebreakers-for-hybrid-teams',
    title: 'Virtual Icebreakers for Hybrid Teams: 12 That Don\'t Make People Cringe (2026)',
    description:
      'Twelve virtual icebreakers that work for hybrid teams - ranked by speed, by group size, and by how much "performance" they require. With links to free AI-powered tools for each.',
    keywords:
      'virtual icebreakers, hybrid team icebreakers, virtual icebreakers for meetings, online icebreakers, remote team icebreakers, icebreaker games for hybrid teams, virtual icebreaker activities, quick virtual icebreakers, icebreaker questions for work, 5 minute icebreakers',
    author: baseAuthor,
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-18',
    readingMinutes: 11,
    tags: ['Team Building', 'Icebreakers', 'Remote Work'],
    hero: {
      eyebrow: 'Icebreaker playbook',
      title: '12 virtual icebreakers for hybrid teams that don\'t make people cringe',
      subtitle: 'Ranked by speed, group size, and how much performance they ask of introverts. Plus the AI-powered tools that make hosting them painless.',
      gradient: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 55%,#ec4899 100%)'
    },
    toc: [
      { id: 'rules', label: 'The 3 rules of a good icebreaker' },
      { id: 'sub-5min', label: 'Sub-5-minute icebreakers' },
      { id: 'sub-10min', label: 'Sub-10-minute icebreakers' },
      { id: 'longer', label: '10-15 minute icebreakers' },
      { id: 'introvert', label: 'Introvert-safe ones' },
      { id: 'multi-region', label: 'For multi-region/multilingual teams' },
      { id: 'faq', label: 'FAQ' }
    ],
    body: `
<h2 id="rules">The 3 rules of a good virtual icebreaker</h2>
<ol>
  <li><strong>It should be optional.</strong> Mandatory icebreakers are how people learn to hate icebreakers. Make participation a choice and you'll be amazed how many people opt in.</li>
  <li><strong>It should be time-boxed.</strong> 5 minutes, 10 minutes, 15 minutes. Never "until everyone's gone". The energy drops the moment it overruns.</li>
  <li><strong>It should ask the same of everyone.</strong> If only one person at a time has to talk, the other 19 are watching a performance. The good ones either get everyone playing simultaneously or rotate fast.</li>
</ol>
<p>What follows is a curated list - twelve icebreakers that pass all three rules, organized by time budget.</p>

<h2 id="sub-5min">Sub-5-minute icebreakers</h2>

<h3>1. Emoji weather report</h3>
<p>Each person posts in chat: three emojis describing their week. No talking, no explanation. Read them all in 30 seconds. Done.</p>
<p><strong>Tooling:</strong> any chat. Or run <a href="/blog/emoji-story-games-for-teams">Emoji Tales</a> for the AI-judged version.</p>

<h3>2. One-word sprint vibe</h3>
<p>Around the room, one word each on how the sprint felt. No follow-up questions. Use it as a heat check before a retro.</p>

<h3>3. Two-emoji intro</h3>
<p>New hires: drop two emojis that describe you in chat. Watch the team guess. Better than "tell us about yourself".</p>

<h3>4. Map drop</h3>
<p>Open a shared map (Google Maps, Miro). Everyone drops a pin where they're working from. Done. Useful for distributed teams to feel less abstract.</p>

<h2 id="sub-10min">Sub-10-minute icebreakers</h2>

<h3>5. AI-generated trivia round</h3>
<p>Five questions, multiple choice, AI-generated, mixed difficulty. Everyone buzzes in. The most reliable 10-minute icebreaker on the market.</p>
<p><strong>Tooling:</strong> <a href="/blog/virtual-trivia-for-team-meetings">Trivia Race</a> - free, no setup, fresh questions every time.</p>

<h3>6. Two Truths and a Lie (work edition)</h3>
<p>Three statements per person - two true, one false. Vote on the lie. Best icebreaker for new joiners; it makes the team learn something about each other that lasts.</p>
<p><strong>Tooling:</strong> <a href="/blog/two-truths-and-a-lie-examples">Two Truths &amp; a Lie</a> - AI helps you write a believable lie if you're stuck. 60 examples in the article.</p>

<h3>7. Doodle Quest (one round)</h3>
<p>One person draws an AI-picked word, everyone else types guesses. One round = ~5 minutes. Universal joy.</p>
<p><strong>Tooling:</strong> <a href="/blog/online-pictionary-for-remote-teams">Doodle Quest</a>.</p>

<h3>8. "Show us your desk" carousel</h3>
<p>Everyone takes a 5-second pan of their desk. Hold up coffee mugs. The least-Zoom Zoom you've done all week.</p>

<h2 id="longer">10-15 minute icebreakers</h2>

<h3>9. Meeting Roulette</h3>
<p>Everyone randomly paired (or trios) for 5-minute 1:1s with an AI-generated icebreaker. Three rotations. By the end, everyone has met someone they wouldn't have otherwise.</p>
<p><strong>Tooling:</strong> <a href="/blog/meeting-roulette-for-new-hire-onboarding">Meeting Roulette</a>.</p>

<h3>10. "Highs and lows" round-robin</h3>
<p>One high from the week, one low. Cap at 30 seconds per person. Don't problem-solve in the moment. Useful as the opener for a retrospective.</p>

<h3>11. The "what would you do with an extra hour" round</h3>
<p>Each person says how they'd spend a free hour today. Cap at 20 seconds. People reveal what they're actually missing in their life - it's quietly profound.</p>

<h3>12. Three rounds of Emoji Tales</h3>
<p>Three prompts back-to-back, AI judges each. Burns ~10 minutes. Best for cross-cultural teams because nobody is at a language disadvantage.</p>
<p><strong>Tooling:</strong> <a href="/blog/emoji-story-games-for-teams">Emoji Tales</a>.</p>

<h2 id="introvert">Introvert-safe icebreakers</h2>
<p>Some icebreakers are exhausting for people who don't like being put on the spot. The introvert-friendly subset of the list above:</p>
<ul>
  <li>Emoji weather report (no talking required)</li>
  <li>One-word sprint vibe (one word, low stakes)</li>
  <li>AI-generated trivia (just click an answer)</li>
  <li>Doodle Quest as a guesser (type when you have a guess)</li>
  <li>Emoji Tales (compose silently, reveal simultaneously)</li>
</ul>
<p>The ones to <em>skip</em> for introvert-heavy teams: anything that requires extended one-at-a-time storytelling without a clear time cap. "Tell us about yourself" is the worst offender.</p>

<h2 id="multi-region">For multi-region / multilingual teams</h2>
<p>If half your team operates in English-as-a-second-language, prioritize icebreakers that don't tax fluency:</p>
<ul>
  <li><strong>Emoji Tales</strong> - language-agnostic by design.</li>
  <li><strong>Doodle Quest</strong> - drawing is universal, guessing is short single words.</li>
  <li><strong>Map drop</strong> - visual only.</li>
  <li><strong>Trivia Race</strong> - multiple choice, no composition required.</li>
</ul>
<p>De-prioritize: anything with long open-ended storytelling. "What's the most interesting thing about you" is a fluency tax disguised as a question.</p>

<h2 id="faq">FAQ</h2>
<h3>What's a good 5-minute virtual icebreaker?</h3>
<p>Emoji weather report (zero setup) or one round of Trivia (5 questions ~ 8 minutes). For the absolute fastest, "one word for how this week felt" round-robin.</p>
<h3>What icebreaker works for a large hybrid team?</h3>
<p>For 20+ players, AI-generated trivia or Emoji Tales scale best. Anything 1:1-based (Meeting Roulette) caps around 16.</p>
<h3>How do I run an icebreaker without making people cringe?</h3>
<p>Three rules: keep it optional, time-box hard, and make sure everyone participates simultaneously rather than one-at-a-time-on-the-spot. The list above is curated against those rules.</p>
<h3>Are these icebreakers free?</h3>
<p>All the AI-powered tools linked (Trivia Race, Doodle Quest, Emoji Tales, Meeting Roulette, Two Truths and a Lie) are free in reAItro. No sign-up to join a room.</p>
<h3>Can I run more than one in a session?</h3>
<p>You can but you shouldn't. Pick one. Time-box it. End on a high. Save the others for next time.</p>
`
  }
];

export const blogPostMap = Object.fromEntries(blogPosts.map(p => [p.slug, p]));
