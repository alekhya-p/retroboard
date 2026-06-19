<template>
  <AppPage variant="marketing" class="legal-page">
    <section class="legal-hero">
      <div class="legal-hero-inner">
        <span class="legal-eyebrow">Legal · Terms</span>
        <h1>Terms of Service</h1>
        <p class="legal-lede">
          These terms govern your use of reAItro. We have written them in plain English wherever
          possible - but they are binding, so please read them carefully.
        </p>
        <div class="legal-meta">
          <span>Effective: <strong>May 12, 2026</strong></span>
          <span>Last updated: <strong>June 19, 2026</strong></span>
        </div>
      </div>
    </section>

    <article class="legal-body">
      <nav class="legal-toc" aria-label="Terms table of contents">
        <p class="legal-toc-title">On this page</p>
        <ol>
          <li v-for="item in toc" :key="item.id">
            <a :href="`#${item.id}`">{{ item.label }}</a>
          </li>
        </ol>
      </nav>

      <div class="legal-content">
        <section id="agreement">
          <h2>1. Agreement</h2>
          <p>
            These Terms of Service ("Terms") are a binding contract between you and Regpro Consultancy,
            the operator of <strong>reAItro</strong> ("reAItro", "we", "us", or "our"),
            governing your use of the website at <a href="https://reaitro.com">reaitro.com</a>, the
            web application, and any related services (collectively, the "Service").
          </p>
          <p>
            By creating an account, joining a board, or otherwise using the Service, you agree to these
            Terms and to our <router-link to="/privacy">Privacy Policy</router-link>. If you do not agree,
            do not use the Service.
          </p>
        </section>

        <section id="eligibility">
          <h2>2. Eligibility</h2>
          <p>
            You must be at least 16 years old to create an account. If you use the Service on behalf of
            a company or organisation, you confirm that you have the authority to bind it to these Terms.
          </p>
        </section>

        <section id="account">
          <h2>3. Your account</h2>
          <h3>3.1 Authentication</h3>
          <p>
            You can create an account with an email address and password, sign in with Google or Microsoft,
            or join as a guest (display name only, no email). You are responsible for keeping your password
            and any underlying identity-provider account secure, and for choosing a strong, unique password.
            We store passwords only as a salted one-way hash and can never see them - so keep yours safe, as
            we can only help you reset it, not recover it.
          </p>
          <h3>3.2 Accuracy</h3>
          <p>
            You agree to provide accurate, current, and complete information when you register and to
            keep that information up to date.
          </p>
          <h3>3.3 Account security</h3>
          <p>
            You are responsible for all activity that occurs under your account. Notify us immediately at
            <a href="mailto:support@reaitro.com">support@reaitro.com</a> if you suspect
            unauthorised use.
          </p>
        </section>

        <section id="acceptable-use">
          <h2>4. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose.</li>
            <li>Upload content that is illegal, infringing, harassing, defamatory, or hateful.</li>
            <li>Reverse engineer, decompile, or otherwise attempt to derive source code from the Service.</li>
            <li>Attempt to gain unauthorised access to any system, account, or data.</li>
            <li>Use automated means (scrapers, bots) to access the Service without our written permission.</li>
            <li>Probe, scan, or test the vulnerability of any system or network connected to the Service
              without prior written authorisation (responsible disclosure to
              <a href="mailto:support@reaitro.com">support@reaitro.com</a> is welcome).</li>
            <li>Resell, sublicense, or commercially redistribute access to the Service without written
              permission.</li>
          </ul>
        </section>

        <section id="your-content">
          <h2>5. Your content</h2>
          <h3>5.1 Ownership</h3>
          <p>
            You retain all rights to the content you and your collaborators submit (boards, columns,
            stickies, comments, votes, summaries, action items). We do not claim ownership.
          </p>
          <h3>5.2 Licence to operate the Service</h3>
          <p>
            You grant us a worldwide, non-exclusive, royalty-free licence to host, store, transmit,
            display, and process your content <em>solely</em> for the purpose of providing the Service
            to you and your collaborators. This licence ends when you delete the content.
          </p>
          <h3>5.3 Responsibility</h3>
          <p>
            You are responsible for the content you submit and for ensuring you have the rights necessary
            to submit it.
          </p>
        </section>

        <section id="ai-features">
          <h2>6. AI features</h2>
          <p>
            reAItro offers optional AI features (summaries, action items, template generation,
            icebreakers) powered by Google Cloud Vertex AI.
          </p>
          <ul>
            <li>AI features are triggered only when you actively click the corresponding button.</li>
            <li>AI output is generated probabilistically and may be inaccurate or incomplete. <strong>You
              are responsible for reviewing AI output before relying on it or sharing it.</strong></li>
            <li>Under Google's Vertex AI terms, customer prompts and responses are not used to train
              Google's foundation models.</li>
            <li>We may rate-limit AI features to protect Service availability.</li>
          </ul>
        </section>

        <section id="availability">
          <h2>7. Service availability</h2>
          <p>
            We aim to keep the Service available 24/7 and target a 99.5% monthly uptime, but we do not
            guarantee uninterrupted access. We may suspend or interrupt the Service for maintenance,
            upgrades, security incidents, or factors beyond our control.
          </p>
        </section>

        <section id="pricing">
          <h2>8. Pricing and billing</h2>
          <p>
            reAItro is currently offered free of charge. We may introduce paid tiers in the future;
            in that case, existing users will be notified in advance and free-tier limits (if any) will
            be clearly published.
          </p>
        </section>

        <section id="termination">
          <h2>9. Termination</h2>
          <p>
            You may close your account at any time by emailing
            <a href="mailto:support@reaitro.com">support@reaitro.com</a>. We may suspend or
            terminate your access if you violate these Terms or the Acceptable Use policy, with or
            without notice for serious violations. Upon termination your right to use the Service
            immediately ceases, and we will delete your account data subject to the retention windows in
            our Privacy Policy.
          </p>
        </section>

        <section id="warranties">
          <h2>10. Disclaimer of warranties</h2>
          <p>
            The Service is provided <strong>"as is" and "as available"</strong> without warranties of any
            kind, express or implied, including merchantability, fitness for a particular purpose, and
            non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or
            fully secure. AI-generated content is not warranted to be accurate or fit for any particular
            decision.
          </p>
        </section>

        <section id="liability">
          <h2>11. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, our aggregate liability arising out of or relating to
            these Terms or the Service shall not exceed <strong>EUR 100</strong> or the amount you paid us
            for the Service in the 12 months preceding the claim, whichever is greater. We are not liable
            for indirect, consequential, incidental, special, or punitive damages.
          </p>
        </section>

        <section id="indemnity">
          <h2>12. Indemnity</h2>
          <p>
            You agree to indemnify and hold us harmless from any claim, loss, or damage arising from your
            use of the Service in violation of these Terms or applicable law.
          </p>
        </section>

        <section id="changes">
          <h2>13. Changes to the Service or Terms</h2>
          <p>
            We may modify the Service or these Terms at any time. Material changes to these Terms will be
            communicated by email or in-app notice at least 30 days before they take effect. Continued
            use after the effective date constitutes acceptance.
          </p>
        </section>

        <section id="governing-law">
          <h2>14. Governing law and disputes</h2>
          <p>
            These Terms are governed by the laws of the Netherlands, without regard to conflict-of-laws
            principles. Any dispute will be subject to the exclusive jurisdiction of the competent courts
            in the Netherlands. Consumers may also have recourse to their local courts under applicable
            mandatory law.
          </p>
        </section>

        <section id="miscellaneous">
          <h2>15. Miscellaneous</h2>
          <ul>
            <li><strong>Entire agreement.</strong> These Terms and the Privacy Policy form the entire
              agreement between you and us regarding the Service.</li>
            <li><strong>Severability.</strong> If any provision is found unenforceable, the rest remains
              in full force.</li>
            <li><strong>No waiver.</strong> Our failure to enforce any right is not a waiver of that right.</li>
            <li><strong>Assignment.</strong> You may not assign these Terms; we may assign them in
              connection with a corporate transaction.</li>
            <li><strong>Force majeure.</strong> We are not liable for delay or failure caused by events
              beyond our reasonable control.</li>
          </ul>
        </section>

        <section id="contact">
          <h2>16. Contact</h2>
          <p>
            Questions about these Terms? Email
            <a href="mailto:support@reaitro.com">support@reaitro.com</a>.
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
  { id: 'agreement', label: '1. Agreement' },
  { id: 'eligibility', label: '2. Eligibility' },
  { id: 'account', label: '3. Your account' },
  { id: 'acceptable-use', label: '4. Acceptable use' },
  { id: 'your-content', label: '5. Your content' },
  { id: 'ai-features', label: '6. AI features' },
  { id: 'availability', label: '7. Service availability' },
  { id: 'pricing', label: '8. Pricing and billing' },
  { id: 'termination', label: '9. Termination' },
  { id: 'warranties', label: '10. Disclaimer of warranties' },
  { id: 'liability', label: '11. Limitation of liability' },
  { id: 'indemnity', label: '12. Indemnity' },
  { id: 'changes', label: '13. Changes' },
  { id: 'governing-law', label: '14. Governing law' },
  { id: 'miscellaneous', label: '15. Miscellaneous' },
  { id: 'contact', label: '16. Contact' }
];

onMounted(() => {
  applyHead({
    title: 'Terms of Service · reAItro',
    description:
      'Read the reAItro Terms of Service: account rules, acceptable use, AI feature terms, liability, governing law and how to contact us.',
    keywords: 'retroboard terms of service, agile retrospective terms, AI retrospective terms of use, retro saas terms',
    canonical: `${SITE_URL}/terms`,
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Terms of Service', path: '/terms' }
      ])
    ]
  });
});
</script>

<style scoped>
.legal-hero {
  background:
    radial-gradient(900px 360px at 100% 0%, rgba(236,72,153,0.22), transparent 60%),
    radial-gradient(700px 320px at 0% 100%, rgba(168,85,247,0.22), transparent 60%),
    linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#7c3aed 100%);
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
  margin-bottom: 16px;
}
.legal-hero h1 { font-size: 2.6rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 14px; }
.legal-lede { font-size: 1.05rem; color: rgba(241,245,249,0.86); max-width: 640px; line-height: 1.6; }
.legal-meta { margin-top: 22px; display: flex; gap: 18px; color: rgba(241,245,249,0.7); font-size: 0.9rem; flex-wrap: wrap; }
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
}
.legal-toc-title {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin: 0 0 12px;
}
.legal-toc ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.legal-toc a {
  text-decoration: none;
  color: #334155;
  font-size: 0.9rem;
  display: block;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
}
.legal-toc a:hover { background: rgba(99,102,241,0.1); color: #4f46e5; }
.legal-content {
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 20px;
  padding: 36px 40px;
  box-shadow: 0 18px 50px -28px rgba(15,23,42,0.18);
}
.legal-content :deep(section) { margin-bottom: 32px; scroll-margin-top: 96px; }
.legal-content :deep(h2) { font-size: 1.45rem; font-weight: 700; margin: 0 0 12px; color: #0f172a; }
.legal-content :deep(h3) { font-size: 1.05rem; font-weight: 600; margin: 18px 0 8px; color: #1e293b; }
.legal-content :deep(p), .legal-content :deep(li) { color: #334155; line-height: 1.7; font-size: 0.98rem; }
.legal-content :deep(ul), .legal-content :deep(ol) { padding-left: 22px; display: flex; flex-direction: column; gap: 6px; margin: 8px 0 0; }
.legal-content :deep(a) {
  color: #4f46e5;
  text-decoration: none;
  border-bottom: 1px solid rgba(99,102,241,0.3);
}
.legal-content :deep(a:hover) { color: #a855f7; border-color: rgba(168,85,247,0.4); }

@media (max-width: 900px) {
  .legal-body { grid-template-columns: 1fr; gap: 24px; }
  .legal-toc { position: static; }
  .legal-content { padding: 26px 22px; }
  .legal-hero h1 { font-size: 2rem; }
}
</style>
