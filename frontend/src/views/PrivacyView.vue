<template>
  <AppPage variant="marketing" class="legal-page">
    <section class="legal-hero">
      <div class="legal-hero-inner">
        <span class="legal-eyebrow">Legal · Privacy</span>
        <h1>Privacy Policy</h1>
        <p class="legal-lede">
          We built reAItro so agile teams can run great retrospectives without giving up control of their data.
          This policy explains what we collect, why we collect it, who we share it with, and the choices you have.
        </p>
        <div class="legal-meta">
          <span>Effective: <strong>May 12, 2026</strong></span>
          <span>Last updated: <strong>June 19, 2026</strong></span>
        </div>
      </div>
    </section>

    <article class="legal-body">
      <nav class="legal-toc" aria-label="Privacy table of contents">
        <p class="legal-toc-title">On this page</p>
        <ol>
          <li v-for="item in toc" :key="item.id">
            <a :href="`#${item.id}`">{{ item.label }}</a>
          </li>
        </ol>
      </nav>

      <div class="legal-content">
        <section id="overview">
          <h2>1. Overview</h2>
          <p>
            This Privacy Policy describes how <strong>reAItro</strong> (operating at
            <a href="https://reaitro.com">reaitro.com</a> and related domains, hereafter "reAItro",
            "we", "us", or "our") collects, uses, and shares information about you when you use our website,
            web application, and related services (collectively, the "Service").
          </p>
          <p>
            By using the Service you agree to the practices described here. If you do not agree, please do
            not use the Service. For questions, reach us any time at
            <a href="mailto:support@reaitro.com">support@reaitro.com</a>.
          </p>
        </section>

        <section id="who-we-are">
          <h2>2. Who we are</h2>
          <p>
            reAItro is provided by Regpro Consultancy. Our registered contact for privacy questions is
            <a href="mailto:support@reaitro.com">support@reaitro.com</a>. We act as the
            <em>data controller</em> for personal data collected through the public website and as a
            <em>data processor</em> for content you and your teammates add to your retrospective boards.
          </p>
        </section>

        <section id="information-we-collect">
          <h2>3. Information we collect</h2>
          <h3>3.1 Account information</h3>
          <p>
            When you create an account we collect the minimum information required to identify you: your
            name and email address. You can sign up either with an <strong>email address and password</strong>,
            or via a third-party identity provider (Google or Microsoft), in which case we also receive a
            stable user identifier from that provider.
          </p>
          <p>
            If you sign up with a password, we store it only as a <strong>salted, one-way hash</strong>
            (bcrypt) - we never store, log, or have access to your plaintext password, and we cannot recover
            it (only reset it). We do not request access to your inbox, calendar, files, or contacts.
          </p>
          <h3>3.2 Guest access</h3>
          <p>
            Guest participants provide only a display name. No email is collected. Guest sessions are scoped
            to the board they joined and are deleted automatically when the underlying board is deleted.
          </p>
          <h3>3.3 Content you create</h3>
          <p>
            We store the retrospective boards, columns, stickies, comments, votes, summaries, and action
            items you and your collaborators create on the Service. This content belongs to you.
          </p>
          <h3>3.4 Technical information</h3>
          <p>
            We log standard request metadata (IP address, user agent, timestamps, requested URL, and
            response status) for security, reliability, and abuse prevention. These logs are retained for up
            to 30 days unless required for an ongoing investigation.
          </p>
          <h3>3.5 Cookies and similar technologies</h3>
          <p>
            We use a small number of strictly-necessary cookies and local storage entries to keep you signed
            in, remember your consent choices, and protect against CSRF. We do not use third-party
            advertising cookies. See <a href="#cookies">section 9</a> for the full list.
          </p>
          <h3>3.6 Game history</h3>
          <p>
            If you have an account, we keep a short, capped history of AI-generated game content you've
            already seen (for example trivia questions and drawing prompts) so the same items aren't
            repeated for you across sessions. This is linked to your account and contains no personal
            information beyond the generated game text itself. Guest players have no stored history.
          </p>
        </section>

        <section id="how-we-use">
          <h2>4. How we use your information</h2>
          <ul>
            <li>To create and operate your account.</li>
            <li>To provide the core retrospective functionality (boards, real-time collaboration, voting).</li>
            <li>To generate AI summaries, action items, icebreakers, and templates when you explicitly request them.</li>
            <li>To remember which AI game content you've already seen, so trivia questions and drawing prompts don't repeat for you.</li>
            <li>To authenticate you, including verifying your password and sending password-reset emails when you request them.</li>
            <li>To secure the Service against fraud, abuse, and unauthorised access.</li>
            <li>To communicate critical service notices (security incidents, billing, terms updates). We do not send marketing without your opt-in.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section id="legal-bases">
          <h2>5. Legal bases (GDPR / UK GDPR users)</h2>
          <p>We process personal data under one or more of these bases:</p>
          <ul>
            <li><strong>Contract.</strong> Providing the Service you signed up for.</li>
            <li><strong>Legitimate interest.</strong> Securing and improving the Service. We balance this against your privacy expectations and never use it for invasive analytics.</li>
            <li><strong>Consent.</strong> Where you have explicitly opted in (e.g. non-essential cookies, marketing email).</li>
            <li><strong>Legal obligation.</strong> Tax, accounting, and regulatory requirements.</li>
          </ul>
        </section>

        <section id="ai-processing">
          <h2>6. AI processing</h2>
          <p>
            Our AI features (board summaries, action item extraction, template generation, icebreakers) are
            powered by Google Cloud Vertex AI (Gemini family models). When you click an AI button:
          </p>
          <ul>
            <li>The relevant board content is sent to Vertex AI in the <strong>europe-west4</strong> region.</li>
            <li>The model generates a response and returns it to reAItro for display.</li>
            <li>Under Google's Vertex AI terms, customer prompts and responses are <strong>not used to train
              Google's foundation models</strong>.</li>
            <li>We do not send personal data beyond what is required (board content + your display name where shown).</li>
          </ul>
          <p>
            AI output is generated probabilistically and may contain mistakes. Treat AI summaries as drafts and
            verify them before sharing.
          </p>
        </section>

        <section id="sharing">
          <h2>7. Who we share information with</h2>
          <p>We never sell your personal data. We share data only with:</p>
          <ul>
            <li><strong>Subprocessors</strong> required to run the Service - see <a href="#subprocessors">section 11</a>.</li>
            <li><strong>Collaborators on your boards.</strong> Anything you post on a board is visible to other
              members of that board.</li>
            <li><strong>Authorities</strong> if required by valid legal process. We notify you unless legally
              prohibited.</li>
            <li><strong>Successors</strong> in the unlikely event of a corporate transaction (merger, acquisition).
              Continued use will remain subject to a policy at least as protective as this one.</li>
          </ul>
        </section>

        <section id="retention">
          <h2>8. How long we keep data</h2>
          <ul>
            <li><strong>Account data</strong> - for the life of your account, plus up to 90 days after closure for backup and abuse-prevention purposes.</li>
            <li><strong>Board content</strong> - until you or the board facilitator deletes it. Deleted boards are removed from production within 24 hours and purged from backups within 30 days.</li>
            <li><strong>Logs</strong> - up to 30 days.</li>
            <li><strong>Legal/financial records</strong> - as required by applicable law (typically 7 years).</li>
          </ul>
        </section>

        <section id="cookies">
          <h2>9. Cookies and local storage</h2>
          <ul>
            <li><code>token</code> - your session JWT, stored in local storage. Necessary for authentication.</li>
            <li><code>cookiesConsent</code> - your cookie banner choice. Necessary to remember your decision.</li>
            <li><code>authRedirect</code> - the page you were trying to reach when sent to login. Necessary for OAuth flows.</li>
            <li><code>guestSessions</code> - lets the same browser restore a guest's display name and session; never leaves your device.</li>
          </ul>
          <p>We do not use third-party advertising cookies, marketing pixels, or cross-site trackers.</p>
        </section>

        <section id="your-rights">
          <h2>10. Your rights</h2>
          <p>Depending on where you live, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Correct inaccurate or incomplete data.</li>
            <li>Delete your account and associated data ("right to be forgotten").</li>
            <li>Export your data in a portable format.</li>
            <li>Restrict or object to certain processing.</li>
            <li>Withdraw consent at any time, without affecting the lawfulness of prior processing.</li>
            <li>Lodge a complaint with your local data protection authority.</li>
          </ul>
          <p>
            To exercise any of these rights, email
            <a href="mailto:support@reaitro.com">support@reaitro.com</a>. We respond within 30
            days.
          </p>
        </section>

        <section id="subprocessors">
          <h2>11. Subprocessors</h2>
          <p>We rely on a small set of carefully chosen subprocessors:</p>
          <ul>
            <li><strong>Google Cloud Platform</strong> - hosting (Cloud Run, Firestore), AI inference (Vertex AI), authentication (Google Identity Services). Region: europe-west4.</li>
            <li><strong>Microsoft Identity Platform</strong> - optional enterprise SSO (only used if your organisation enables Microsoft sign-in).</li>
            <li><strong>Resend</strong> - transactional email delivery (e.g. password-reset emails). Receives your email address only when an email needs to be sent.</li>
            <li><strong>Firebase Hosting</strong> - static asset delivery.</li>
          </ul>
        </section>

        <section id="international-transfers">
          <h2>12. International data transfers</h2>
          <p>
            Our primary hosting region is the European Union (Belgium / Netherlands).
            Some subprocessors may transfer or process data outside the EEA - in those cases we rely on
            Standard Contractual Clauses and supplementary technical measures (encryption in transit and at rest).
          </p>
        </section>

        <section id="security">
          <h2>13. Security</h2>
          <p>
            We apply industry-standard safeguards: TLS 1.2+ in transit, encryption at rest, principle of least
            privilege for our staff, signed JWTs, OAuth 2.0 with PKCE, and dependency-scanning in CI. No
            system is perfectly secure - if you spot a vulnerability, please email
            <a href="mailto:support@reaitro.com">support@reaitro.com</a> and we will respond
            promptly.
          </p>
        </section>

        <section id="children">
          <h2>14. Children</h2>
          <p>The Service is not directed to children under 16 and we do not knowingly collect their personal data. If you believe a child has provided us data, please contact us so we can delete it.</p>
        </section>

        <section id="changes">
          <h2>15. Changes to this policy</h2>
          <p>We may update this Privacy Policy from time to time. We will post the new version here and update the "Last updated" date. Material changes will be communicated by email or in-app notice at least 30 days before they take effect.</p>
        </section>

        <section id="contact">
          <h2>16. Contact us</h2>
          <p>
            Questions, requests, or complaints? Email us at
            <a href="mailto:support@reaitro.com">support@reaitro.com</a>. We will respond within 30 days,
            usually much sooner.
          </p>
        </section>
      </div>
    </article>
    <AppFooter />
  </AppPage>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppFooter from '@/components/AppFooter.vue';
import AppPage from '@/components/ui/AppPage.vue';
import { applyHead, breadcrumbJsonLd, SITE_URL } from '@/utils/seo';

const toc = [
  { id: 'overview', label: '1. Overview' },
  { id: 'who-we-are', label: '2. Who we are' },
  { id: 'information-we-collect', label: '3. Information we collect' },
  { id: 'how-we-use', label: '4. How we use your information' },
  { id: 'legal-bases', label: '5. Legal bases (GDPR)' },
  { id: 'ai-processing', label: '6. AI processing' },
  { id: 'sharing', label: '7. Who we share with' },
  { id: 'retention', label: '8. Retention' },
  { id: 'cookies', label: '9. Cookies' },
  { id: 'your-rights', label: '10. Your rights' },
  { id: 'subprocessors', label: '11. Subprocessors' },
  { id: 'international-transfers', label: '12. International transfers' },
  { id: 'security', label: '13. Security' },
  { id: 'children', label: '14. Children' },
  { id: 'changes', label: '15. Changes' },
  { id: 'contact', label: '16. Contact' }
];

onMounted(() => {
  applyHead({
    title: 'Privacy Policy · reAItro',
    description:
      'Read the reAItro privacy policy: what we collect, how we use it, AI processing details, subprocessors, your rights, and how to contact us.',
    keywords: 'retroboard privacy policy, agile retrospective privacy, GDPR retrospective tool, AI retrospective data',
    canonical: `${SITE_URL}/privacy`,
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy' }
      ])
    ]
  });
});
</script>

<style scoped>
.legal-hero {
  background:
    radial-gradient(900px 360px at 100% 0%, rgba(168,85,247,0.22), transparent 60%),
    radial-gradient(700px 320px at 0% 100%, rgba(99,102,241,0.22), transparent 60%),
    linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #312e81 100%);
  color: #fff;
  padding: 56px 24px 64px;
  border-radius: 24px;
  margin: 0 0 32px;
}
.legal-hero-inner { max-width: 760px; }
.legal-eyebrow {
  display: inline-block;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.24);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  margin-bottom: 16px;
}
.legal-hero h1 {
  font-size: 2.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 14px;
}
.legal-lede {
  font-size: 1.05rem;
  color: rgba(241,245,249,0.86);
  max-width: 640px;
  line-height: 1.6;
}
.legal-meta {
  margin-top: 22px;
  display: flex;
  gap: 18px;
  color: rgba(241,245,249,0.7);
  font-size: 0.9rem;
  flex-wrap: wrap;
}
.legal-meta strong { color: #fff; font-weight: 600; }
.legal-body {
  padding: 0 0 80px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 48px;
  align-items: flex-start;
}
.legal-toc {
  position: sticky;
  top: 96px;
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px -16px rgba(15,23,42,0.18);
}
.legal-toc-title {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin: 0 0 12px;
}
.legal-toc ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.legal-toc a {
  text-decoration: none;
  color: #334155;
  font-size: 0.9rem;
  display: block;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
}
.legal-toc a:hover {
  background: rgba(99,102,241,0.1);
  color: #4f46e5;
}
.legal-content {
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 20px;
  padding: 36px 40px;
  box-shadow: 0 18px 50px -28px rgba(15,23,42,0.18);
}
.legal-content :deep(section) { margin-bottom: 32px; scroll-margin-top: 96px; }
.legal-content :deep(h2) {
  font-size: 1.45rem;
  font-weight: 700;
  margin: 0 0 12px;
  letter-spacing: -0.01em;
  color: #0f172a;
}
.legal-content :deep(h3) {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 18px 0 8px;
  color: #1e293b;
}
.legal-content :deep(p),
.legal-content :deep(li) {
  color: #334155;
  line-height: 1.7;
  font-size: 0.98rem;
}
.legal-content :deep(ul),
.legal-content :deep(ol) {
  padding-left: 22px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 8px 0 0;
}
.legal-content :deep(a) {
  color: #4f46e5;
  text-decoration: none;
  border-bottom: 1px solid rgba(99,102,241,0.3);
  transition: color 0.15s, border-color 0.15s;
}
.legal-content :deep(a:hover) {
  color: #a855f7;
  border-color: rgba(168,85,247,0.4);
}
.legal-content :deep(code) {
  background: rgba(99,102,241,0.08);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.86em;
}

@media (max-width: 900px) {
  .legal-body {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .legal-toc {
    position: static;
  }
  .legal-content { padding: 26px 22px; }
  .legal-hero h1 { font-size: 2rem; }
}
</style>
