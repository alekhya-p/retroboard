export interface LandingFaq {
  q: string;
  a: string;
}

export interface LandingPage {
  path: string;
  title: string;
  metaDescription: string;
  keywords: string;
  heroEyebrow: string;
  h1: string;
  subtitle: string;
  gradient: string;
  body: string; // HTML
  faq: LandingFaq[];
  related: Array<{ label: string; path: string }>;
}

export const landingPages: LandingPage[] = [
  {
    path: '/ai-retrospective',
    title: 'AI Retrospective - Free AI-Powered Sprint Retrospectives | reAItro',
    metaDescription:
      'Run an AI retrospective in minutes. Free AI-powered sprint retrospective board with one-click summaries, SMART action items and an AI template generator. No credit card.',
    keywords:
      'AI retrospective, AI retro, AI sprint retrospective, AI agile retrospective, AI retrospective tool, generative AI retrospective, AI scrum master, AI retro summary, AI action items',
    heroEyebrow: 'AI retrospective',
    h1: 'The free AI retrospective for agile and scrum teams',
    subtitle:
      'Generate the board, run the retro, summarize the discussion and extract SMART action items - all in one tool, all powered by enterprise AI.',
    gradient: 'linear-gradient(135deg,#6366f1 0%,#a855f7 55%,#ec4899 100%)',
    body: `
<h2 id="what-is">What is an AI retrospective?</h2>
<p>An <strong>AI retrospective</strong> is a sprint retrospective where generative AI does the work that used to drain your Scrum Master: it reads the board, writes the summary, drafts SMART action items, and can even invent a custom retro format from a one-sentence prompt. You still run the discussion. The AI handles everything around it.</p>
<p>reAItro is a free AI retrospective tool built around three core AI features: <strong>one-click summaries</strong>, <strong>SMART action item extraction</strong>, and an <strong>AI template generator</strong>. It runs in your browser. No setup, no credit card, no per-seat pricing.</p>

<h2 id="why">Why agile teams switch to an AI retrospective</h2>
<ul>
  <li><strong>The writeup happens before the team leaves the call.</strong> One click → executive paragraph + per-column themes → drop in Slack.</li>
  <li><strong>Action items don't vanish.</strong> The AI extracts every concrete commitment buried in the stickies. The team validates owners in the last 5 minutes.</li>
  <li><strong>The format stays fresh.</strong> Type a sentence - "a retro for the team that just finished hardening week" - and AI generates a fitting custom template in 8 seconds.</li>
  <li><strong>Patterns get surfaced.</strong> Sprint-over-sprint sentiment trends become an early warning system for burnout and friction.</li>
</ul>

<h2 id="how">How an AI retrospective works in reAItro</h2>
<ol>
  <li><strong>Pick or generate a template.</strong> Choose from 26 ready-made retrospective formats (DAKI, Sailboat, 4Ls, Glad/Sad/Mad, Start/Stop/Continue, and more) or describe your sprint in one sentence and let the <a href="/ai-generator">AI template generator</a> build a custom one.</li>
  <li><strong>Run the retro.</strong> Silent writing, dot-voting, clustering, discussion - same flow you already use, in real time across the team.</li>
  <li><strong>Click "Summarize".</strong> AI reads every sticky and returns a structured summary: executive paragraph, per-column themes, sentiment.</li>
  <li><strong>Click "Action items".</strong> The AI pulls SMART action items out of the board, ready for the team to validate, own and date.</li>
  <li><strong>Share.</strong> Copy the summary into Slack, export the PDF, or pin it on the next sprint's board.</li>
</ol>

<h2 id="privacy">Privacy & data handling</h2>
<p>reAItro runs on an enterprise AI provider under a strict no-training agreement. <strong>Your retro content is not used to train any model.</strong> Boards are private by default, anonymous mode is available for sensitive retros, and standard GDPR controls apply.</p>

<h2 id="compare">AI retrospective vs. classic retrospective</h2>
<p>The team conversation is identical. What changes is everything around it:</p>
<ul>
  <li><strong>Writeup time:</strong> 30 minutes → 30 seconds.</li>
  <li><strong>Action item quality:</strong> from "improve CI" to "cut CI time from 14 → 8 minutes by next demo, owner: Priya".</li>
  <li><strong>Format variety:</strong> three formats you remember → 26 templates + unlimited AI-generated ones.</li>
  <li><strong>Follow-through:</strong> action items reviewed automatically at the next retro.</li>
</ul>

<h2 id="get-started">Start your AI retrospective now</h2>
<p><a href="/boards/templates">Browse the templates</a> to start with a proven format, or <a href="/ai-generator">launch the AI generator</a> to invent a custom retro tailored to this sprint. Both are free, both take less than a minute to set up, and both end with a one-click AI summary your team will actually read.</p>
`,
    faq: [
      {
        q: 'What is an AI retrospective?',
        a: 'An AI retrospective is a sprint retrospective where generative AI assists facilitation - typically by generating one-click summaries of the board, extracting SMART action items from sticky notes, and creating custom retro templates from a one-sentence prompt.'
      },
      {
        q: 'Is the AI retrospective in reAItro free?',
        a: 'Yes. AI summaries, AI action items and the AI template generator are free for agile teams. No credit card required.'
      },
      {
        q: 'Does the AI train on my retrospective data?',
        a: 'No. reAItro uses AI under Google\'s no-training terms. Your retro content is not used to train any model.'
      },
      {
        q: 'Can AI replace a Scrum Master in a retrospective?',
        a: 'No. AI replaces the homework around the retrospective - writeup, action item drafts, template generation - not the facilitation itself. Discussion, coaching and follow-through still need a human.'
      },
      {
        q: 'Which AI model powers reAItro?',
        a: 'reAItro runs on a fast, enterprise-grade large language model selected for its speed and quality on long retro boards. The specific sub-processor is disclosed in our Privacy page.'
      }
    ],
    related: [
      { label: 'How AI improves retrospectives', path: '/blog/how-ai-improves-retrospectives' },
      { label: 'Best retrospective tools in 2026', path: '/blog/best-retrospective-tools' },
      { label: 'AI template generator', path: '/ai-generator' },
      { label: 'Retrospective templates', path: '/boards/templates' }
    ]
  },
  {
    path: '/free-retrospective-tool',
    title: 'Free Retrospective Tool - Real-Time Boards + AI Summaries | reAItro',
    metaDescription:
      'A genuinely free retrospective tool for agile teams. Real-time boards, 26 templates, AI-generated summaries, SMART action items. No credit card, no per-seat pricing.',
    keywords:
      'free retrospective tool, free retro tool, free retrospective board, free online retrospective tool, free retrospective software, free agile retrospective, free sprint retrospective tool',
    heroEyebrow: 'Free forever',
    h1: 'A free retrospective tool that actually does the work',
    subtitle:
      'Real-time retrospective boards, 26 ready-made templates, one-click AI summaries and SMART action items - free for agile teams. No card, no seat limits, no nag screens.',
    gradient: 'linear-gradient(135deg,#22c55e 0%,#0ea5e9 55%,#6366f1 100%)',
    body: `
<h2 id="what-you-get">What you actually get for free</h2>
<p>"Free" in retro tooling usually means "free until you want the useful features". <strong>reAItro is free for the useful features</strong> - the ones that change how a retro actually goes. Specifically:</p>
<ul>
  <li><strong>Real-time multi-user retrospective boards.</strong> Multiple cursors, instant sticky updates, no refresh.</li>
  <li><strong>26 ready-made templates.</strong> Sailboat, DAKI, 4Ls, Glad/Sad/Mad, Start/Stop/Continue, Three Little Pigs, Mountain Climber, Space Mission, and more.</li>
  <li><strong>One-click AI summaries.</strong> Executive paragraph + per-column themes + sentiment, generated in seconds by AI.</li>
  <li><strong>SMART action item extraction.</strong> AI pulls every concrete commitment from the board.</li>
  <li><strong>AI template generator.</strong> Describe your sprint in one sentence; get a fitting custom format.</li>
  <li><strong>Anonymous guest links.</strong> Teammates join in one click, no account needed.</li>
  <li><strong>Printable PDF and Slack export.</strong> The writeup leaves the tool the moment the retro ends.</li>
</ul>

<h2 id="why-free">Why we built it free</h2>
<p>The math is simple. Most agile teams retro every two weeks. That's 26 retros a year. A "free trial" tool runs out exactly when the team has built the habit. A "$10 per seat per month" tool tells a 6-person team to pay $720 a year to write sticky notes. Neither is good for adoption - and adoption is the only thing that makes retros work.</p>
<p>So we made the things that matter free for everyone, paid for the infrastructure with enterprise plans for larger orgs, and left it at that. Small agile teams get a real retro tool with AI included. Done.</p>

<h2 id="vs-paid">Free retrospective tool vs. paid alternatives</h2>
<table>
  <thead>
    <tr><th>Feature</th><th>reAItro (free)</th><th>Typical paid tool</th></tr>
  </thead>
  <tbody>
    <tr><td>Real-time collaboration</td><td>Yes</td><td>Yes</td></tr>
    <tr><td>Template library</td><td>26+ templates</td><td>10-20 templates</td></tr>
    <tr><td>AI summary</td><td>Free, one-click</td><td>Paid tier only</td></tr>
    <tr><td>AI action items</td><td>Free</td><td>Paid tier only</td></tr>
    <tr><td>AI template generator</td><td>Free</td><td>Rarely available</td></tr>
    <tr><td>Per-seat pricing</td><td>None</td><td>$8-$15 per seat / month</td></tr>
    <tr><td>Card required to start</td><td>No</td><td>Usually yes</td></tr>
  </tbody>
</table>

<h2 id="who-for">Who this free retrospective tool is for</h2>
<ul>
  <li>Scrum teams running sprint retrospectives every 1-2 weeks.</li>
  <li>Kanban teams running rolling cadence retros.</li>
  <li>Remote and async teams that need real-time + AI summaries.</li>
  <li>New Scrum Masters who want a good starting point without a procurement process.</li>
  <li>Anyone tired of expensing per-seat licenses for a meeting that runs once a sprint.</li>
</ul>

<h2 id="start">Start your free retrospective in 30 seconds</h2>
<p>No setup, no card. <a href="/boards/templates">Pick a template</a> or <a href="/ai-generator">let AI build one</a> for your next sprint. Run the retro. Click the summary button. You're done.</p>
`,
    faq: [
      {
        q: 'Is reAItro really free?',
        a: 'Yes. Real-time retrospective boards, 26+ templates, AI summaries, SMART action items and the AI template generator are free for agile teams. No credit card required.'
      },
      {
        q: 'Is there a seat limit on the free retrospective tool?',
        a: 'No per-seat fee for small agile teams. Invite the whole team. Anonymous guest links let teammates join in one click without an account.'
      },
      {
        q: 'What\'s the catch?',
        a: 'There isn\'t one. Enterprise teams that need SSO, audit logs and SLA support pay for an enterprise plan. The everyday retro features stay free.'
      },
      {
        q: 'Do you train AI on our retrospective data?',
        a: 'No. reAItro uses AI under Google\'s no-training terms. Your retro content is not used to train any model.'
      }
    ],
    related: [
      { label: 'Best retrospective tools in 2026', path: '/blog/best-retrospective-tools' },
      { label: 'Choosing an online retrospective tool', path: '/blog/online-retrospective-tool' },
      { label: 'Retrospective templates', path: '/boards/templates' },
      { label: 'AI template generator', path: '/ai-generator' }
    ]
  },
  {
    path: '/sprint-retrospective',
    title: 'Sprint Retrospective - Run Real-Time Sprint Retros with AI | reAItro',
    metaDescription:
      'Everything you need to run a great sprint retrospective: 26 templates, real-time collaboration, AI summaries and SMART action items - free for agile teams.',
    keywords:
      'sprint retrospective, sprint retro, sprint retrospective tool, sprint retrospective template, agile sprint retro, scrum sprint retrospective, online sprint retrospective',
    heroEyebrow: 'Sprint retrospective',
    h1: 'Run a sprint retrospective your team will actually use',
    subtitle:
      'Twenty-six proven sprint retrospective templates, real-time collaboration, and one-click AI summaries. Free, no credit card. Built for two-week sprints.',
    gradient: 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 55%,#a855f7 100%)',
    body: `
<h2 id="what">What is a sprint retrospective?</h2>
<p>A <strong>sprint retrospective</strong> is the last event in a scrum sprint. The team inspects what happened - process, quality, delivery, morale - and decides what to change for the next sprint. It's the only ceremony in scrum explicitly aimed at improvement, which makes it the highest-leverage hour in the sprint.</p>
<p>For a two-week sprint, plan 60-90 minutes. The Scrum Guide caps it at three hours for a one-month sprint, proportionally less for shorter sprints.</p>

<h2 id="agenda">A proven sprint retrospective agenda (75 minutes)</h2>
<ol>
  <li><strong>(5 min) Open.</strong> Welcome, restate the sprint goal, read the prime directive, one-word check-in.</li>
  <li><strong>(5 min) Review last sprint's actions.</strong> Did we do them? Any blockers?</li>
  <li><strong>(10 min) Set the scene.</strong> Velocity, key incidents, notable events. Facts, not opinions.</li>
  <li><strong>(15 min) Gather data.</strong> Silent writing into your chosen format (DAKI, Sailboat, etc.).</li>
  <li><strong>(10 min) Cluster &amp; vote.</strong> Group similar stickies. Dot-vote on themes.</li>
  <li><strong>(20 min) Discuss.</strong> Open discussion on the top 2-3 themes. Use five whys.</li>
  <li><strong>(5 min) Decide actions.</strong> 1-3 SMART action items, single owner each.</li>
  <li><strong>(5 min) Close.</strong> One-click AI summary, one-word out, drop the writeup in Slack.</li>
</ol>

<h2 id="templates">Sprint retrospective templates worth rotating through</h2>
<p>The fastest way to make a sprint retro feel stale is to run the same format every two weeks. Rotate among a few proven sprint retrospective templates:</p>
<ul>
  <li><a href="/templates/start-stop-continue">Start / Stop / Continue</a> - the easy default.</li>
  <li><a href="/templates/daki-framework">DAKI</a> - Drop / Add / Keep / Improve. Richer than SSC.</li>
  <li><a href="/templates/4ls">4Ls</a> - Liked / Learned / Lacked / Longed-for. Good for milestones.</li>
  <li><a href="/templates/sailboat">Sailboat</a> - strategic, surfaces forces visually.</li>
  <li><a href="/templates/glad-sad-mad">Glad / Sad / Mad</a> - morale check, emotionally honest.</li>
  <li><a href="/templates/space-mission">Space Mission</a> - after a major launch.</li>
  <li><a href="/templates/three-little-pigs">Three Little Pigs</a> - post-incident retros.</li>
</ul>
<p>Need something specific to this sprint? The <a href="/ai-generator">AI template generator</a> builds a custom sprint retrospective format from a one-sentence prompt.</p>

<h2 id="ai">AI in the sprint retrospective</h2>
<p>The hardest part of a sprint retrospective is usually <em>after</em>: the Scrum Master spending 30 minutes turning stickies into a writeup. reAItro replaces that step with a single button:</p>
<ul>
  <li><strong>AI summary.</strong> Executive paragraph + per-column themes + sentiment, generated by AI in seconds.</li>
  <li><strong>SMART action items.</strong> The AI extracts concrete commitments from the discussion and drafts them with suggested owners.</li>
  <li><strong>AI template generator.</strong> Custom retro formats on demand.</li>
</ul>

<h2 id="follow">Make the sprint retrospective actually stick</h2>
<ul>
  <li>One owner per action item. "The team" is not an owner.</li>
  <li>Every action gets a due date - by next retro at the latest.</li>
  <li>Review last sprint's actions for two minutes at the start of every new retro.</li>
  <li>Rotate facilitators. Surfaces blind spots and shares the load.</li>
</ul>

<h2 id="start">Start your sprint retrospective</h2>
<p><a href="/boards/templates">Pick a template</a> and you'll be in your sprint retrospective board in 30 seconds. Free, real-time, with AI summaries and SMART action items included.</p>
`,
    faq: [
      {
        q: 'How long should a sprint retrospective be?',
        a: 'For a two-week sprint, plan 60-90 minutes. The Scrum Guide caps the retrospective at three hours for a one-month sprint, proportionally less for shorter sprints.'
      },
      {
        q: 'Who attends a sprint retrospective?',
        a: 'The whole scrum team that delivered the sprint - developers, product owner, Scrum Master. Stakeholders typically don\'t attend, since their presence reduces psychological safety.'
      },
      {
        q: 'What is the best sprint retrospective template?',
        a: 'There is no single best template - the right one depends on the sprint outcome and team mood. DAKI is a strong default. Sailboat suits strategic retros. Glad/Sad/Mad works for morale check-ins. Rotate every 2-3 sprints.'
      },
      {
        q: 'How do I make sprint retrospective action items stick?',
        a: 'Single owner per action, clear due date, public read-back at the close of the retro, and a 2-minute review of the previous sprint\'s actions at the start of the next retro.'
      }
    ],
    related: [
      { label: 'How to run an agile retrospective', path: '/blog/how-to-run-an-agile-retrospective' },
      { label: '35 sprint retrospective ideas', path: '/blog/sprint-retrospective-ideas' },
      { label: 'Retrospective questions to ask', path: '/blog/retrospective-questions-to-ask' },
      { label: 'Sprint retrospective templates', path: '/boards/templates' }
    ]
  },
  {
    path: '/scrum-retrospective',
    title: 'Scrum Retrospective - Templates, Agenda & AI for Scrum Masters | reAItro',
    metaDescription:
      'A complete scrum retrospective workflow - proven templates, a 75-minute agenda, facilitation tips and free AI summaries. Built for Scrum Masters and agile teams.',
    keywords:
      'scrum retrospective, scrum retro, scrum master retrospective, scrum retrospective template, scrum retrospective tool, scrum framework retrospective, agile scrum retro',
    heroEyebrow: 'Scrum retrospective',
    h1: 'The scrum retrospective, end to end - for Scrum Masters',
    subtitle:
      'Templates, agendas, facilitation tips and free one-click AI summaries - everything a Scrum Master needs to run a scrum retrospective that produces change.',
    gradient: 'linear-gradient(135deg,#a855f7 0%,#6366f1 55%,#0ea5e9 100%)',
    body: `
<h2 id="definition">The scrum retrospective in one paragraph</h2>
<p>The <strong>scrum retrospective</strong> is the final event in a scrum sprint. Per the Scrum Guide, the team uses it to inspect the sprint with regard to individuals, interactions, processes, tools and the definition of done, then identify and order the most important improvements for the next sprint. In practice, it's the highest-leverage hour your team has, and the one stakeholders try to cut first. Don't let them.</p>

<h2 id="role">The Scrum Master's role in the retrospective</h2>
<p>The Scrum Master is the <em>facilitator</em>, not the <em>boss</em>. That means:</p>
<ul>
  <li>Pick a format that fits the sprint and the team's mood (rotate every 2-3 sprints).</li>
  <li>Create psychological safety. Read the prime directive. Defuse blame language.</li>
  <li>Run silent writing first to neutralize loud voices.</li>
  <li>Keep discussion focused on systems, not individuals.</li>
  <li>Time-box ruthlessly. A 75-minute retro that finishes on time beats a 110-minute retro that runs late.</li>
  <li>Track action items and review them at the start of the next retro.</li>
</ul>

<h2 id="agenda">A proven 75-minute scrum retrospective agenda</h2>
<ol>
  <li>(5 min) Open: welcome, sprint goal, prime directive, one-word check-in.</li>
  <li>(5 min) Review last sprint's action items.</li>
  <li>(10 min) Set the scene: velocity, incidents, key events.</li>
  <li>(15 min) Gather data: silent writing into the chosen format.</li>
  <li>(10 min) Cluster and dot-vote.</li>
  <li>(20 min) Discuss top 2-3 themes.</li>
  <li>(5 min) Decide 1-3 SMART action items with single owners.</li>
  <li>(5 min) Close: one-click AI summary, one-word out, share to Slack.</li>
</ol>

<h2 id="formats">Scrum retrospective formats Scrum Masters reach for</h2>
<ul>
  <li><a href="/templates/start-stop-continue">Start / Stop / Continue</a> - the universal default.</li>
  <li><a href="/templates/daki-framework">DAKI</a> - when "improve" matters more than "stop".</li>
  <li><a href="/templates/4ls">4Ls</a> - milestones and project ends.</li>
  <li><a href="/templates/sailboat">Sailboat</a> - strategic, surfaces forces.</li>
  <li><a href="/templates/glad-sad-mad">Glad / Sad / Mad</a> - morale check.</li>
  <li><a href="/templates/three-little-pigs">Three Little Pigs</a> - quality and post-incident.</li>
  <li><a href="/ai-generator">AI Generator</a> - when nothing on the shelf fits this sprint.</li>
</ul>

<h2 id="ai">How AI changes the Scrum Master's job in the retrospective</h2>
<p>The most time-consuming part of running a scrum retrospective used to be the <em>after</em>: writing the summary, drafting action items, tracking owners. AI tools now collapse that to minutes.</p>
<p>reAItro generates a full scrum retrospective summary and SMART action item list in one click. The Scrum Master moves from "homework after the retro" to "validate the AI draft with the team in the last 5 minutes". That frees the role to focus on the work AI can't do - facilitation, coaching, and following through on actions across sprints.</p>

<h2 id="metrics">Measure whether your scrum retrospective is working</h2>
<ul>
  <li><strong>Action completion rate.</strong> 70%+ is healthy.</li>
  <li><strong>Repeat themes.</strong> Same theme three retros in a row = your actions aren't addressing the cause.</li>
  <li><strong>Sticky count per person.</strong> Trending down is a warning sign.</li>
  <li><strong>Sentiment trend.</strong> Sprint-over-sprint mood, automatically surfaced by AI tools.</li>
</ul>

<h2 id="start">Run your next scrum retrospective free</h2>
<p>No setup. <a href="/boards/templates">Pick a template</a> or <a href="/ai-generator">generate a custom one</a>. Click "Summarize" at the end. The Scrum Master leaves the retro with a finished writeup, owned action items, and the rest of the day back.</p>
`,
    faq: [
      {
        q: 'What is a scrum retrospective?',
        a: 'A scrum retrospective is the last event in a scrum sprint. The team inspects how the sprint went and decides what to change for the next one. It is the only scrum event whose explicit purpose is to improve how the team works.'
      },
      {
        q: 'How is the scrum retrospective different from the sprint review?',
        a: 'The sprint review demos the product increment to stakeholders. The scrum retrospective inspects how the team itself worked. The review is product-focused; the retrospective is team-focused.'
      },
      {
        q: 'Who facilitates the scrum retrospective?',
        a: 'Usually the Scrum Master, though facilitation can rotate. The manager typically doesn\'t facilitate - their presence often dampens honesty.'
      },
      {
        q: 'How long is a scrum retrospective?',
        a: 'The Scrum Guide caps it at three hours for a one-month sprint, proportionally less for shorter sprints. For a typical two-week sprint, 60-90 minutes is right.'
      }
    ],
    related: [
      { label: 'The scrum retrospective guide for Scrum Masters', path: '/blog/scrum-retrospective-guide' },
      { label: 'How to run an agile retrospective', path: '/blog/how-to-run-an-agile-retrospective' },
      { label: 'Retrospective templates', path: '/boards/templates' },
      { label: 'AI template generator', path: '/ai-generator' }
    ]
  },
  {
    path: '/retrospective-ideas',
    title: 'Retrospective Ideas - 35+ Sprint Retro Ideas, Formats & Activities | reAItro',
    metaDescription:
      '35+ retrospective ideas, themed formats and activities to break the routine and re-energize your sprint retros. Free templates and AI-generated custom retros included.',
    keywords:
      'retrospective ideas, sprint retrospective ideas, retro ideas, fun retrospective ideas, creative retrospective, retrospective activities, retrospective format ideas, agile retro ideas',
    heroEyebrow: 'Retrospective ideas',
    h1: 'Retrospective ideas your team will actually look forward to',
    subtitle:
      '35+ retro ideas across openers, full formats, themed retros and closing rituals. Free templates and an AI generator for when nothing on the shelf fits.',
    gradient: 'linear-gradient(135deg,#f59e0b 0%,#ef4444 55%,#a855f7 100%)',
    body: `
<h2 id="why">Why you need new retrospective ideas every few sprints</h2>
<p>Run the same retro format every two weeks and the team goes on autopilot. Stickies become muscle memory. Action items get vaguer. The retrospective itself starts feeling like a tax on the sprint, not the highest-leverage hour. Rotating <strong>retrospective ideas</strong> - formats, openers, themes, closers - is the single fastest fix.</p>

<h2 id="openers">Retrospective ideas: 8 openers</h2>
<ol>
  <li>One-word check-in: "describe how you arrived" in one word.</li>
  <li>Weather forecast: sunny / cloudy / hurricane in your head right now.</li>
  <li>Energy bar: 1-10 on how energized you feel for the retro.</li>
  <li>Emoji round: drop the emoji that describes the sprint.</li>
  <li>"What I almost said in stand-up" - surface withheld observations.</li>
  <li>Sprint headlines: each person writes a fake newspaper headline.</li>
  <li>Two truths and a lie about the sprint.</li>
  <li>Mood map: energy vs. clarity grid.</li>
</ol>

<h2 id="formats">Retrospective ideas: 15 formats to rotate through</h2>
<ul>
  <li><a href="/templates/start-stop-continue">Start / Stop / Continue</a> - easy default.</li>
  <li><a href="/templates/daki-framework">DAKI</a> - Drop / Add / Keep / Improve.</li>
  <li><a href="/templates/4ls">4Ls</a> - Liked / Learned / Lacked / Longed-for.</li>
  <li><a href="/templates/sailboat">Sailboat</a> - wind, anchors, rocks, island.</li>
  <li><a href="/templates/glad-sad-mad">Glad / Sad / Mad</a> - pure emotion.</li>
  <li><a href="/templates/hot-air-balloon">Hot Air Balloon</a> - Sailboat in the sky.</li>
  <li><a href="/templates/space-mission">Space Mission</a> - after a big launch.</li>
  <li><a href="/templates/mountain-climber">Mountain Climber</a> - celebrates a hard sprint.</li>
  <li><a href="/templates/three-little-pigs">Three Little Pigs</a> - post-incident.</li>
  <li><a href="/templates/kitchen-nightmares">Kitchen Nightmares</a> - post-mortem style.</li>
  <li><a href="/templates/energy-levels">Energy Levels</a> - burnout signal.</li>
  <li><a href="/templates/video-game">Video Game</a> - XP, boss fights, glitches.</li>
  <li><a href="/templates/marauders-map-retro">Marauder's Map</a> - for the Potterheads.</li>
  <li><a href="/templates/lean-coffee">Lean Coffee</a> - democratic, timeboxed.</li>
  <li>Five Whys - pick one problem, ask "why" five times.</li>
</ul>

<h2 id="themed">Retrospective ideas: 8 themed formats</h2>
<ol>
  <li>Movie genre retro: pick a genre - horror, comedy, heist - and frame columns around it.</li>
  <li>Restaurant retro: ingredients / recipe / customers / dumpster.</li>
  <li>Sports team retro: starting line-up / MVPs / fouls / bench.</li>
  <li>Concert retro: headliner / opening act / soundcheck issues / encores.</li>
  <li>Road trip retro: route / detours / fuel stops / breakdowns.</li>
  <li>Hardware launch retro: spec / build / test / ship.</li>
  <li>Heist retro: plan / crew / score / getaway.</li>
  <li>Cooking show retro: pantry / recipe / dish / critique.</li>
</ol>

<h2 id="closers">Retrospective ideas: 6 closing rituals</h2>
<ol>
  <li>One-word out - mirror of the opening check-in.</li>
  <li>Action item read-back - each owner reads their commitment aloud.</li>
  <li>Thanks round - each person thanks one teammate specifically.</li>
  <li>Confidence vote - 1-5 on "will these actions actually stick?"</li>
  <li>One-click AI summary - drop into Slack before anyone logs off.</li>
  <li>Calendar the review - add "review last retro's actions" to the next retro now.</li>
</ol>

<h2 id="ai-ideas">Use AI to invent your next retrospective idea</h2>
<p>You can keep inventing retros by hand, or you can let AI do it. reAItro's <a href="/ai-generator">template generator</a> takes a sentence - "a retro for a team that just finished a brutal incident response week" or "a celebratory retro themed around our team's love of cycling" - and produces a fully formed template with columns, colors and prompts in 8 seconds.</p>
<p>Pair that with one-click AI summaries and SMART action items, and your retros stop being homework for the Scrum Master and start being the meeting the team genuinely values.</p>
`,
    faq: [
      {
        q: 'How often should I change my retrospective ideas?',
        a: 'Rotate the format every 2-3 sprints at minimum. Even small changes (different opener, themed framing) keep the team\'s brain engaged.'
      },
      {
        q: 'What is the best retrospective idea for a tired team?',
        a: 'Glad / Sad / Mad or Energy Levels. Both surface morale honestly and require very low cognitive load - perfect when the team is running on fumes.'
      },
      {
        q: 'What is the best retrospective idea after a major launch?',
        a: 'Space Mission or Mountain Climber. Both celebrate the milestone while capturing concrete learnings, which is the right balance after a high-effort delivery.'
      },
      {
        q: 'Can AI come up with retrospective ideas?',
        a: 'Yes. The reAItro template generator builds a fully formed custom retrospective from a one-sentence prompt - columns, color palette, prompts and an action column included.'
      }
    ],
    related: [
      { label: '35 sprint retrospective ideas', path: '/blog/sprint-retrospective-ideas' },
      { label: 'Fun retrospective ideas', path: '/blog/fun-retrospective-ideas' },
      { label: '60 retrospective questions to ask', path: '/blog/retrospective-questions-to-ask' },
      { label: 'AI template generator', path: '/ai-generator' }
    ]
  },
  {
    path: '/retrospective-games',
    title: 'Retrospective Games - 5 Free AI Team Games for Sprint Retros | reAItro',
    metaDescription:
      'Five free, built-in AI retrospective games to make sprint retros fun and engaging. Live multiplayer games for remote, offshore and onboarding teams. No credit card.',
    keywords:
      'retrospective games, retro games, fun retrospective games, team games for retrospectives, online retro games, sprint retrospective games, multiplayer retro games, icebreaker games for retros',
    heroEyebrow: '🎮 Retro games',
    h1: 'Retrospective games that make the team actually show up',
    subtitle:
      'Five built-in, AI-powered multiplayer games to warm up a retro, energize a tired team, and onboard new joiners - free, real-time, no installs.',
    gradient: 'linear-gradient(135deg,#f97316 0%,#ec4899 50%,#8b5cf6 100%)',
    body: `
<h2 id="why">Why retrospective games work</h2>
<p>The hardest part of most retros isn't the agenda - it's the silence. People join the call, cameras off, and wait for someone braver to type the first sticky. <strong>Retrospective games</strong> break that ice. A two-minute game at the top of the meeting shifts the team from "another ceremony" to "people I want to talk to", and the honest input flows from there.</p>
<p>reAItro ships with <strong>five live multiplayer games</strong> built directly into the retro board - no separate tool, no installs, no setup. Everyone is already in the room, so you just launch a game and play.</p>

<h2 id="the-five">The 5 built-in AI retrospective games</h2>
<ul>
  <li><strong>Doodle Quest</strong> - a fast drawing-and-guessing game. Great for camera-shy teams; the chaos of bad sketches loosens everyone up in seconds.</li>
  <li><strong>Trivia Race</strong> - an AI-generated trivia round where the team races to answer. The AI keeps questions fresh every time, so it never goes stale.</li>
  <li><strong>Emoji Tales</strong> - players tell the story of the sprint (or anything) purely in emoji while others decode it. A sneaky-good way to surface how the sprint actually felt.</li>
  <li><strong>Two Truths &amp; a Lie</strong> - the classic getting-to-know-you game, perfect for new joiners and newly-formed squads.</li>
  <li><strong>Meeting Roulette</strong> - a spin-the-wheel prompt game that randomly picks who shares, what they share, or which icebreaker the team runs next.</li>
</ul>
<p>Because the games are AI-powered and multiplayer, they stay different every session and work just as well across a distributed team as they do in one room.</p>

<h2 id="when">When to drop a game into your retro</h2>
<ul>
  <li><strong>The opener.</strong> Two minutes of Doodle Quest or Emoji Tales before silent writing. Engagement for the rest of the hour goes up noticeably.</li>
  <li><strong>The energy dip.</strong> If a discussion stalls, a quick round of Trivia Race resets the room.</li>
  <li><strong>Onboarding a new joiner.</strong> Two Truths &amp; a Lie is the fastest way for a new teammate to feel like part of the group.</li>
  <li><strong>Friday / end-of-quarter retros.</strong> When the team is fried, lead with a game and a lighter format like Glad/Sad/Mad.</li>
</ul>

<h2 id="remote">Why retro games matter most for remote and offshore teams</h2>
<p>Distributed and offshore teams lose the hallway moments that build trust in a co-located team. Over time that shows up as quiet retros and low psychological safety. A recurring two-minute game is one of the cheapest, highest-return rituals a remote team can adopt - it manufactures the social glue that an office used to provide for free, and it does it on the clock, inside a meeting everyone already attends.</p>

<h2 id="how">How to run a retrospective game in reAItro</h2>
<ol>
  <li>Open your retro board and invite the team (anonymous guest links mean no one needs an account).</li>
  <li>Launch a game from the <a href="/play">games hub</a> - everyone joins the same live session instantly.</li>
  <li>Play one round (keep it to 2-5 minutes; the point is warm-up, not the whole hour).</li>
  <li>Jump straight into the retro on the same board, now with a relaxed, engaged team.</li>
  <li>Close with a one-click AI summary and SMART action items.</li>
</ol>
<p><strong>Tip:</strong> rotate the game like you rotate the retro format. Same opener every sprint becomes its own kind of autopilot.</p>

<h2 id="start">Play your first retro game free</h2>
<p>All five games are free and built in. <a href="/play">Open the games hub</a> to try them, or <a href="/boards/templates">pick a retro template</a> and warm the team up before you start. No credit card, no installs, no per-seat pricing.</p>
`,
    faq: [
      {
        q: 'What retrospective games does reAItro include?',
        a: 'Five live multiplayer games are built in: Doodle Quest (draw and guess), Trivia Race (AI-generated trivia), Emoji Tales (storytelling in emoji), Two Truths & a Lie, and Meeting Roulette (spin-the-wheel prompts). All are free.'
      },
      {
        q: 'Are the retrospective games free?',
        a: 'Yes. All five games are free, built directly into the retro board, with no installs and no per-seat pricing. Teammates can join anonymously via a guest link.'
      },
      {
        q: 'Do retro games work for remote and offshore teams?',
        a: 'Especially well. The games are real-time and multiplayer, so a distributed or offshore team plays the same live session together. A two-minute game replaces the hallway moments remote teams otherwise miss.'
      },
      {
        q: 'How long should a retrospective game take?',
        a: 'Keep openers to 2-5 minutes. The goal is to warm up and engage the team, not consume the retro. Play one round, then move into the agenda.'
      },
      {
        q: 'Are retro games good for onboarding new team members?',
        a: 'Yes. Two Truths & a Lie and Emoji Tales are excellent for helping a new joiner feel part of the team quickly, and they lower the barrier to speaking up in the retro that follows.'
      }
    ],
    related: [
      { label: 'Fun retrospective ideas', path: '/blog/fun-retrospective-ideas' },
      { label: 'Retrospective ideas & activities', path: '/retrospective-ideas' },
      { label: 'Play the team games', path: '/play' }
    ]
  },
  {
    path: '/remote-retrospective',
    title: 'Remote Retrospective - Run Engaging Distributed Sprint Retros | reAItro',
    metaDescription:
      'Run engaging remote retrospectives for distributed and offshore teams. Anonymous input, real-time boards, team games and one-click AI summaries. Free, no credit card.',
    keywords:
      'remote retrospective, distributed retrospective, remote sprint retrospective, online retrospective for remote teams, async retrospective, offshore team retrospective, virtual retrospective',
    heroEyebrow: '🌐 Remote retros',
    h1: 'Remote retrospectives that don\'t die in awkward silence',
    subtitle:
      'Anonymous input, a real-time board, built-in team games and one-click AI summaries - everything a distributed or offshore team needs to run a retro that actually works.',
    gradient: 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 55%,#a855f7 100%)',
    body: `
<h2 id="problem">Why remote retrospectives are hard</h2>
<p>A co-located retro carries itself on body language and hallway trust. A <strong>remote retrospective</strong> has none of that, and the cracks show fast:</p>
<ul>
  <li><strong>Silence.</strong> Cameras off, nobody wants to type the first sticky, the loudest person fills the gap and the rest disengage.</li>
  <li><strong>Timezones.</strong> A distributed or offshore team can't always get everyone live at a humane hour.</li>
  <li><strong>Low psychological safety.</strong> It's harder to be candid on a video call with a manager's face in a grid than across a table.</li>
  <li><strong>Lost follow-through.</strong> Action items decided on a call evaporate when there's no shared room to point back to.</li>
</ul>

<h2 id="anonymous">Anonymous input fixes the candor problem</h2>
<p>The single biggest lever for a remote retro is <strong>anonymous writing</strong>. When stickies aren't attributed, junior engineers and offshore teammates say the things they'd never say out loud on a recorded call. reAItro supports anonymous mode and one-click guest links, so the quietest person in the grid contributes as freely as the loudest.</p>

<h2 id="realtime">A real-time board replaces the physical wall</h2>
<p>Everyone edits the same board at once - multiple cursors, instant sticky updates, live dot-voting and clustering. The board becomes the shared room the remote team is missing. After the call it stays put as the durable record of what was decided, so action items don't disappear into someone's notebook.</p>

<h2 id="engagement">Games solve the engagement problem</h2>
<p>Distributed teams lose the social glue that an office provides for free. A two-minute game at the top of a remote retro manufactures it back. reAItro ships five live multiplayer games - Doodle Quest, Trivia Race, Emoji Tales, Two Truths &amp; a Lie and Meeting Roulette - built right into the board. Launch one, the whole distributed team joins the same session, and the retro that follows is warmer and more honest. <a href="/play">Try the games</a>.</p>

<h2 id="async">Handling timezones with an async retrospective</h2>
<p>When you genuinely can't get everyone live, run the gathering phase <strong>async</strong>: open the board, give people 24 hours to add stickies and votes on their own schedule, then hold a shorter live (or recorded) discussion on just the top themes. The AI summary then catches up anyone who couldn't attend, so a missed timezone doesn't mean a missed retro.</p>

<h2 id="ai">One-click AI summaries close the loop</h2>
<p>The most expensive part of a remote retro is the writeup nobody has time for. reAItro generates an executive summary, per-column themes, sentiment and SMART action items in one click. Drop it in Slack and every timezone - including the people who slept through the call - is aligned by morning.</p>

<h2 id="checklist">A remote retrospective checklist</h2>
<ul>
  <li>Turn on <strong>anonymous mode</strong> for candid input.</li>
  <li>Open with a <strong>2-minute game</strong> to break the silence.</li>
  <li>Use <strong>silent writing</strong> first so no single voice dominates.</li>
  <li>Run gathering <strong>async</strong> when timezones won't cooperate.</li>
  <li>Close with a <strong>one-click AI summary</strong> shared to Slack.</li>
  <li>Review last retro's actions for two minutes at the start of the next one.</li>
</ul>

<h2 id="start">Start your remote retrospective free</h2>
<p>No setup, no card. <a href="/boards/templates">Pick a template</a> or <a href="/ai-generator">generate a custom one</a>, send the guest link to the team, and run a remote retro that finally feels engaging.</p>
`,
    faq: [
      {
        q: 'How do you run an engaging remote retrospective?',
        a: 'Use anonymous input to unlock candor, open with a 2-minute team game to break the silence, run silent writing on a real-time board so no one voice dominates, and close with a one-click AI summary shared to the whole team.'
      },
      {
        q: 'How do you handle timezones in a distributed retrospective?',
        a: 'Run the gathering phase asynchronously - give the team 24 hours to add stickies and votes on the shared board - then hold a shorter live discussion on the top themes. The AI summary aligns anyone who could not attend.'
      },
      {
        q: 'Does anonymous mode help remote retros?',
        a: 'Significantly. When stickies are not attributed, junior and offshore teammates raise issues they would never say out loud on a recorded video call, which is the most common failure mode of remote retros.'
      },
      {
        q: 'How do you keep offshore teams engaged in retrospectives?',
        a: 'Built-in multiplayer games rebuild the social glue an office provides for free, anonymous input lowers the stakes of speaking up, and a real-time shared board gives a distributed team a common room to point back to.'
      },
      {
        q: 'Is reAItro free for remote teams?',
        a: 'Yes. Real-time boards, anonymous join, team games, AI summaries and SMART action items are free, with no per-seat pricing and no credit card required.'
      }
    ],
    related: [
      { label: 'Retrospective games for remote teams', path: '/retrospective-games' },
      { label: 'Free retrospective tool', path: '/free-retrospective-tool' },
      { label: 'How to run an agile retrospective', path: '/blog/how-to-run-an-agile-retrospective' }
    ]
  },
  {
    path: '/easyretro-alternative',
    title: 'EasyRetro Alternative - Free AI Retrospective Tool | reAItro',
    metaDescription:
      'Looking for an EasyRetro alternative? reAItro is a free, AI-first retrospective tool with one-click summaries, SMART action items, an AI template generator and team games.',
    keywords:
      'EasyRetro alternative, EasyRetro free alternative, FunRetro alternative, alternative to EasyRetro, retro tool comparison, free EasyRetro alternative',
    heroEyebrow: 'EasyRetro alternative',
    h1: 'A free, AI-first EasyRetro alternative',
    subtitle:
      'If you\'re shopping for an EasyRetro (formerly FunRetro) alternative, here\'s what to look for - and what reAItro gives you free: real-time boards, AI summaries, AI action items, an AI template generator and team games.',
    gradient: 'linear-gradient(135deg,#10b981 0%,#0ea5e9 55%,#6366f1 100%)',
    body: `
<h2 id="why-switch">Why teams look for an EasyRetro alternative</h2>
<p>EasyRetro (formerly FunRetro) is a well-known, capable retro board, and for many teams it does the job. Teams typically start shopping for an <strong>EasyRetro alternative</strong> when they want one or more of the following: more AI built in (summaries, action items, generated formats), more variety in their retros, built-in team engagement, or simply a generous free tier that doesn't run out as the habit takes hold.</p>
<p>reAItro was built around exactly those gaps: it's a <strong>free, AI-first</strong> retro tool. Below is a fair, feature-level comparison so you can decide for yourself.</p>

<h2 id="comparison">EasyRetro alternative comparison</h2>
<p>Competitor capabilities and pricing change often, so rather than quote numbers that may be out of date, the right column lists <strong>what to verify in any EasyRetro alternative you evaluate</strong>. The left column states what reAItro offers today.</p>
<table>
  <thead>
    <tr><th>Capability</th><th>reAItro</th><th>What to check in any EasyRetro alternative</th></tr>
  </thead>
  <tbody>
    <tr><td>Price / free tier</td><td>Free for everyday retros - no card, no per-seat pricing</td><td>Is the free tier capped by boards, members or features?</td></tr>
    <tr><td>One-click AI summaries</td><td>Yes - executive summary, per-column themes, sentiment</td><td>Is AI summarization included, paid, or absent?</td></tr>
    <tr><td>AI action items</td><td>Yes - SMART action items extracted from the board</td><td>Does it draft owned, dated, measurable actions?</td></tr>
    <tr><td>AI template generator</td><td>Yes - describe a retro, AI builds the board</td><td>Can it generate a custom format from a prompt?</td></tr>
    <tr><td>Team games</td><td>5 live multiplayer games built in</td><td>Any built-in engagement, or board-only?</td></tr>
    <tr><td>Real-time board</td><td>Yes - multi-cursor, live voting &amp; clustering</td><td>Confirm true real-time, not refresh-based.</td></tr>
    <tr><td>Anonymous join</td><td>Yes - one-click guest links, anonymous mode</td><td>Can teammates join without an account?</td></tr>
    <tr><td>SSO</td><td>Google &amp; Microsoft SSO</td><td>Which identity providers are supported?</td></tr>
  </tbody>
</table>

<h2 id="ai">The AI-first difference</h2>
<p>The clearest reason to choose reAItro as your EasyRetro alternative is that AI isn't a paid add-on - it's the core of the product. <strong>One-click summaries</strong> turn 30 minutes of post-retro writeup into 30 seconds. <strong>SMART action items</strong> get pulled straight off the board so commitments don't evaporate. And the <strong>AI template generator</strong> means you're never stuck with the same three formats - describe your sprint in a sentence and the board builds itself.</p>

<h2 id="engagement">Built-in engagement</h2>
<p>Beyond the board, reAItro includes five live multiplayer games - Doodle Quest, Trivia Race, Emoji Tales, Two Truths &amp; a Lie and Meeting Roulette - to warm up remote and offshore teams. Most retro tools leave engagement entirely to the facilitator; here it's two clicks away. <a href="/play">Try the games</a>.</p>

<h2 id="migrate">Switching is low-risk</h2>
<p>Because reAItro is free to start with no card and supports anonymous guest links, you can trial it for a single retro alongside your current tool. Run your next sprint retro on reAItro, click "Summarize" at the end, and compare the result to your existing workflow before deciding.</p>

<h2 id="start">Try the free EasyRetro alternative</h2>
<p><a href="/boards/templates">Pick a template</a> or <a href="/ai-generator">let AI generate one</a> and run your next retro free. No credit card, no per-seat pricing, AI included from the first board.</p>
`,
    faq: [
      {
        q: 'What is the best free EasyRetro alternative?',
        a: 'reAItro is a strong free, AI-first EasyRetro alternative: real-time boards, 26 templates, one-click AI summaries, SMART AI action items, an AI template generator and five team games - with no per-seat pricing and no credit card to start.'
      },
      {
        q: 'Is reAItro free?',
        a: 'Yes. The everyday retro features - boards, templates, AI summaries, AI action items, the AI generator and games - are free. Larger organizations can pay for enterprise needs like advanced SSO and SLA support.'
      },
      {
        q: 'What should I look for in an EasyRetro alternative?',
        a: 'Check the real limits of the free tier, whether AI summaries and action items are included or paid, whether it can generate custom templates from a prompt, whether the board is truly real-time, and whether teammates can join anonymously.'
      },
      {
        q: 'Does reAItro support anonymous retrospectives?',
        a: 'Yes. It offers anonymous mode and one-click guest links so teammates can contribute candidly without creating an account.'
      },
      {
        q: 'Can I try it without committing?',
        a: 'Yes. There is no credit card required, so you can run a single retro on reAItro alongside your current tool and compare before switching.'
      }
    ],
    related: [
      { label: 'Parabol alternative', path: '/parabol-alternative' },
      { label: 'Free retrospective tool', path: '/free-retrospective-tool' },
      { label: 'Best retrospective tools in 2026', path: '/blog/best-retrospective-tools' }
    ]
  },
  {
    path: '/parabol-alternative',
    title: 'Parabol Alternative - Free AI-Powered Retrospectives | reAItro',
    metaDescription:
      'A free, AI-powered Parabol alternative for agile retrospectives: one-click summaries, SMART action items, an AI template generator and built-in team games. No credit card.',
    keywords:
      'Parabol alternative, alternative to Parabol, free Parabol alternative, Parabol vs, retrospective tool comparison, Parabol retrospective alternative',
    heroEyebrow: 'Parabol alternative',
    h1: 'A free, AI-powered Parabol alternative',
    subtitle:
      'Shopping for a Parabol alternative? Here\'s what to look for - and what reAItro delivers free: real-time retro boards, AI summaries, SMART AI action items, an AI template generator and live team games.',
    gradient: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 55%,#ec4899 100%)',
    body: `
<h2 id="why-switch">Why teams look for a Parabol alternative</h2>
<p>Parabol is a polished agile meeting platform that covers retros along with standups and other ceremonies, and plenty of teams are happy with it. Teams typically evaluate a <strong>Parabol alternative</strong> when they want something more focused and lightweight for retros specifically, want AI features included rather than gated, want built-in engagement for remote teams, or simply want a free tier generous enough to grow into.</p>
<p>reAItro is a <strong>retro-first, AI-first</strong> tool. Here's a fair, feature-level comparison so you can judge the fit.</p>

<h2 id="comparison">Parabol alternative comparison</h2>
<p>Competitor features and pricing evolve, so instead of quoting figures that may go stale, the right column lists <strong>what to verify in any Parabol alternative</strong>. The left column is what reAItro offers today.</p>
<table>
  <thead>
    <tr><th>Capability</th><th>reAItro</th><th>What to check in any Parabol alternative</th></tr>
  </thead>
  <tbody>
    <tr><td>Price / free tier</td><td>Free for everyday retros - no card, no per-seat pricing</td><td>Is the free tier capped by members, meetings or history?</td></tr>
    <tr><td>One-click AI summaries</td><td>Yes - executive summary, per-column themes, sentiment</td><td>Is AI summarization included or a paid tier?</td></tr>
    <tr><td>AI action items</td><td>Yes - SMART action items extracted from the board</td><td>Does it draft owned, dated, measurable actions?</td></tr>
    <tr><td>AI template generator</td><td>Yes - describe a retro, AI builds the board</td><td>Can it generate a custom format from a prompt?</td></tr>
    <tr><td>Team games</td><td>5 live multiplayer games built in</td><td>Is engagement built in, or facilitator-only?</td></tr>
    <tr><td>Real-time board</td><td>Yes - multi-cursor, live voting &amp; clustering</td><td>Confirm true real-time collaboration.</td></tr>
    <tr><td>Anonymous join</td><td>Yes - one-click guest links, anonymous mode</td><td>Can teammates join without an account?</td></tr>
    <tr><td>SSO</td><td>Google &amp; Microsoft SSO</td><td>Which identity providers are supported?</td></tr>
  </tbody>
</table>

<h2 id="focused">Retro-first, not meeting-suite</h2>
<p>Parabol spans multiple agile ceremonies. reAItro deliberately does one thing - retrospectives - extremely well. If retros are the meeting you care about, a focused tool means fewer settings to wade through, a faster path from "create board" to "run retro", and AI tuned specifically for reading and summarizing a retro board.</p>

<h2 id="ai">AI included, not gated</h2>
<p>The core pitch of reAItro as a Parabol alternative is that AI is the product, not a premium tier. <strong>One-click summaries</strong> collapse the post-retro writeup to seconds. <strong>SMART action items</strong> are extracted straight from the stickies. The <strong>AI template generator</strong> builds a custom format from a single sentence, so your retros never go stale.</p>

<h2 id="engagement">Engagement built in for remote teams</h2>
<p>reAItro bundles five live multiplayer games - Doodle Quest, Trivia Race, Emoji Tales, Two Truths &amp; a Lie and Meeting Roulette - to warm up distributed and offshore teams before the retro begins. <a href="/play">Try the games</a>.</p>

<h2 id="migrate">Low-risk to trial</h2>
<p>No credit card, anonymous guest links, free to start. Run a single retro on reAItro alongside Parabol, click "Summarize" at the end, and compare the output before you decide anything.</p>

<h2 id="start">Try the free Parabol alternative</h2>
<p><a href="/boards/templates">Pick a template</a> or <a href="/ai-generator">generate a custom retro with AI</a> and run your next sprint retro free - AI summaries and action items included from the first board.</p>
`,
    faq: [
      {
        q: 'What is a good free Parabol alternative?',
        a: 'reAItro is a free, AI-powered, retro-first Parabol alternative with real-time boards, 26 templates, one-click AI summaries, SMART AI action items, an AI template generator and five team games - no per-seat pricing and no card to start.'
      },
      {
        q: 'How is reAItro different from Parabol?',
        a: 'reAItro is focused specifically on retrospectives rather than spanning multiple agile ceremonies, and it makes AI features (summaries, action items, template generation) free and central rather than gated behind a paid tier.'
      },
      {
        q: 'Is reAItro really free?',
        a: 'Yes. Everyday retro features including AI summaries, AI action items, the AI generator and team games are free. Enterprise needs such as advanced SSO and SLA support are paid.'
      },
      {
        q: 'What should I evaluate in a Parabol alternative?',
        a: 'Check the real limits of the free tier, whether AI summaries and action items are included or paid, whether it can generate templates from a prompt, whether the board is genuinely real-time, and whether guests can join anonymously.'
      },
      {
        q: 'Can my team join without accounts?',
        a: 'Yes. reAItro supports one-click anonymous guest links plus Google and Microsoft SSO for members who want an account.'
      }
    ],
    related: [
      { label: 'EasyRetro alternative', path: '/easyretro-alternative' },
      { label: 'Retrium alternative', path: '/retrium-alternative' },
      { label: 'Best retrospective tools in 2026', path: '/blog/best-retrospective-tools' }
    ]
  },
  {
    path: '/retrium-alternative',
    title: 'Retrium Alternative - Free Retrospective Tool with AI | reAItro',
    metaDescription:
      'A free Retrium alternative with AI built in: one-click summaries, SMART action items, an AI template generator, real-time boards and five team games. No credit card.',
    keywords:
      'Retrium alternative, alternative to Retrium, free Retrium alternative, Retrium vs, retro software comparison, Retrium retrospective alternative',
    heroEyebrow: 'Retrium alternative',
    h1: 'A free Retrium alternative with AI built in',
    subtitle:
      'Comparing Retrium alternatives? Here\'s what to look for - and what reAItro offers free: real-time retro boards, one-click AI summaries, SMART AI action items, an AI template generator and live team games.',
    gradient: 'linear-gradient(135deg,#0ea5e9 0%,#10b981 55%,#a855f7 100%)',
    body: `
<h2 id="why-switch">Why teams look for a Retrium alternative</h2>
<p>Retrium is a mature, enterprise-friendly retrospective platform with a strong library of techniques, and many organizations rely on it. Teams usually start evaluating a <strong>Retrium alternative</strong> when they want AI baked in (summaries, action items, generated formats), built-in engagement for remote teams, a lighter setup, or a free tier that covers an everyday team without a procurement cycle.</p>
<p>reAItro is a <strong>free, AI-first</strong> retro tool. Here's a fair, feature-level comparison to help you decide.</p>

<h2 id="comparison">Retrium alternative comparison</h2>
<p>Competitor capabilities and pricing shift over time, so rather than cite numbers that may be stale, the right column lists <strong>what to verify in any Retrium alternative</strong>. The left column is what reAItro offers today.</p>
<table>
  <thead>
    <tr><th>Capability</th><th>reAItro</th><th>What to check in any Retrium alternative</th></tr>
  </thead>
  <tbody>
    <tr><td>Price / free tier</td><td>Free for everyday retros - no card, no per-seat pricing</td><td>Is there a real free tier, or trial-only?</td></tr>
    <tr><td>One-click AI summaries</td><td>Yes - executive summary, per-column themes, sentiment</td><td>Is AI summarization included, paid, or absent?</td></tr>
    <tr><td>AI action items</td><td>Yes - SMART action items extracted from the board</td><td>Does it draft owned, dated, measurable actions?</td></tr>
    <tr><td>AI template generator</td><td>Yes - describe a retro, AI builds the board</td><td>Can it generate a custom format from a prompt?</td></tr>
    <tr><td>Team games</td><td>5 live multiplayer games built in</td><td>Is engagement built in, or technique-library only?</td></tr>
    <tr><td>Real-time board</td><td>Yes - multi-cursor, live voting &amp; clustering</td><td>Confirm true real-time collaboration.</td></tr>
    <tr><td>Anonymous join</td><td>Yes - one-click guest links, anonymous mode</td><td>Can teammates join without an account?</td></tr>
    <tr><td>SSO</td><td>Google &amp; Microsoft SSO</td><td>Which identity providers are supported?</td></tr>
  </tbody>
</table>

<h2 id="ai">AI from the first board</h2>
<p>The headline reason to pick reAItro as a Retrium alternative is that AI is free and central. <strong>One-click summaries</strong> turn the post-retro writeup into a 30-second task. <strong>SMART action items</strong> are pulled directly from the stickies so commitments don't slip. And the <strong>AI template generator</strong> creates a custom format from a one-sentence prompt, which keeps retros fresh without manually building boards.</p>

<h2 id="techniques">Plenty of formats, plus unlimited AI ones</h2>
<p>reAItro ships 26 ready-made templates - DAKI, Sailboat, 4Ls, Glad/Sad/Mad, Start/Stop/Continue and many more - covering the techniques most teams rotate through. When none of them fits, the AI generator produces an unlimited supply of custom formats on demand, so you're never boxed in by a fixed library.</p>

<h2 id="engagement">Built-in engagement for distributed teams</h2>
<p>Five live multiplayer games - Doodle Quest, Trivia Race, Emoji Tales, Two Truths &amp; a Lie and Meeting Roulette - are built in to warm up remote and offshore teams before the retro. <a href="/play">Try the games</a>.</p>

<h2 id="migrate">Easy to trial alongside Retrium</h2>
<p>No credit card, anonymous guest links, free to start. Run one retro on reAItro next to your current Retrium workflow, click "Summarize" at the end, and compare the writeup and action items before deciding.</p>

<h2 id="start">Try the free Retrium alternative</h2>
<p><a href="/boards/templates">Browse the templates</a> or <a href="/ai-generator">generate a custom retro with AI</a> and run your next sprint retro free - summaries and action items included from the first board.</p>
`,
    faq: [
      {
        q: 'What is the best free Retrium alternative?',
        a: 'reAItro is a strong free, AI-first Retrium alternative: real-time boards, 26 templates, one-click AI summaries, SMART AI action items, an AI template generator and five team games - with no per-seat pricing and no card to start.'
      },
      {
        q: 'Does reAItro have AI features like summaries and action items?',
        a: 'Yes, and they are free and central to the product: one-click summaries with per-column themes and sentiment, SMART action items extracted from the board, and an AI template generator that builds a custom retro from a one-sentence prompt.'
      },
      {
        q: 'Is reAItro free?',
        a: 'Yes. Everyday retro features including the AI summaries, AI action items, the generator and games are free. Enterprise needs like advanced SSO and SLA support are paid.'
      },
      {
        q: 'What should I check in a Retrium alternative?',
        a: 'Confirm whether there is a real free tier or trial-only, whether AI summaries and action items are included or paid, whether it can generate custom templates, whether the board is truly real-time, and whether teammates can join anonymously.'
      },
      {
        q: 'Can I run a retro without everyone making accounts?',
        a: 'Yes. reAItro supports one-click anonymous guest links, plus Google and Microsoft SSO for members who want an account.'
      }
    ],
    related: [
      { label: 'Parabol alternative', path: '/parabol-alternative' },
      { label: 'EasyRetro alternative', path: '/easyretro-alternative' },
      { label: 'Free retrospective tool', path: '/free-retrospective-tool' }
    ]
  }
];

export const landingPageMap = Object.fromEntries(landingPages.map(p => [p.path, p]));
