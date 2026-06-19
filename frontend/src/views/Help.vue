<template>
  <div class="help-root">
    <section class="help-hero">
      <h1 class="help-title">Help & Support</h1>
      <p class="help-intro">
        Welcome to the reAItro Help Center - your guide to getting the most out of our platform for agile retrospectives.
      </p>
    </section>

    <AppPage variant="marketing">
    <section class="help-section card">
      <h2>🔒 Privacy & Data Security</h2>
      <ul class="help-list">
        <li><strong>No Personal Data Collected:</strong> We do not store any personal user information emails, or identifiable data.</li>
        <li><strong>Data Storage Location:</strong> Only Board and Message content is stored, and it is securely hosted in the Europe region to comply with GDPR and EU data regulations.</li>
        <li><strong>Anonymous by Design:</strong> Interactions are kept private and anonymous to encourage open and honest feedback.</li>
      </ul>
    </section>

    <section class="help-section enterprise-section">
      <div class="enterprise-header">
        <span class="enterprise-icon">🏢</span>
        <span class="enterprise-title">Enterprise & Custom Deployments</span>
      </div>
      <div class="enterprise-intro">
        Deploy reAItro securely in your own environment, with full flexibility and enterprise-grade features.
      </div>
      <div class="enterprise-features">
        <div class="enterprise-feature"><span class="feature-check">✔️</span> Package version for private, on-premise deployment</div>
        <div class="enterprise-feature"><span class="feature-check">✔️</span> SSO with Microsoft for seamless integration</div>
        <div class="enterprise-feature"><span class="feature-check">✔️</span> Bring Your Own LLM: use your in-house or our hosted AI</div>
        <div class="enterprise-feature"><span class="feature-check">✔️</span> Flexible options to meet security and compliance needs</div>
      </div>
    </section>

    <section class="help-section faq-section">
      <div class="faq-header-row">
        <h2 class="faq-title">Frequently asked questions</h2>
        <div class="faq-controls">
          <button
            class="btn btn--outline btn--sm"
            :disabled="openFaqs.every(open => open)"
            @click="expandAll"
          >
            Expand all
          </button>
          <button
            class="btn btn--outline btn--sm"
            :disabled="openFaqs.every(open => !open)"
            @click="collapseAll"
          >
            Collapse all
          </button>
        </div>
      </div>
      <div class="faq-list">
        <template v-for="(faq, idx) in faqs" :key="idx">
          <div class="faq-item">
            <div class="faq-num">{{ String(idx + 1).padStart(2, '0') }}/</div>
            <div class="faq-content">
              <div class="faq-q">{{ faq.question }}</div>
              <div class="faq-a" v-if="openFaqs[idx]">{{ faq.answer }}</div>
            </div>
            <button class="faq-toggle" @click="toggleFaq(idx)">
              {{ openFaqs[idx] ? '−' : '+' }}
            </button>
          </div>
          <div class="faq-divider" v-if="idx < faqs.length - 1"></div>
        </template>
      </div>
    </section>

    <section class="help-section card help-contact-section">
      <h2>📧 Need Assistance?</h2>
      <p class="help-contact">
        If you have questions, encounter issues, or need help with enterprise setup, reach out to us at
        <a href="mailto:support@reaitro.com">support@reaitro.com</a> - we're here to help.
      </p>
    </section>
    </AppPage>
    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue';
import AppPage from '@/components/ui/AppPage.vue';
import { ref } from 'vue';

const faqs = [
  {
    "question": "How can I contact support?",
    "answer": "You can reach our support team by emailing support@reaitro.com. We're here to assist you with any questions or technical issues."
  },
  {
    "question": "Is reAItro available for enterprise use?",
    "answer": "Yes, reAItro offers enterprise-grade solutions including on-premise deployment, Microsoft SSO, private LLM integration, and custom compliance options."
  },
  {
    "question": "Do you collect any personal user data?",
    "answer": "No, we do not store any personal user information such as emails or identifiable data. Only board and message content is stored securely."
  },
  {
    "question": "Where is the data stored?",
    "answer": "All data is securely hosted in the Europe region, in compliance with GDPR and EU data protection regulations."
  },
  {
    "question": "Is user activity anonymous?",
    "answer": "Yes, the platform is designed to ensure interactions are private and anonymous, encouraging open and honest feedback."
  },
  {
    "question": "Can we deploy reAItro in our own environment?",
    "answer": "Yes, we provide a package version that supports private, on-premise deployment with enterprise-grade features."
  },
  {
    "question": "Does reAItro support Single Sign-On (SSO)?",
    "answer": "Yes, we offer seamless SSO integration with Microsoft for enterprise users."
  },
  {
    "question": "Can we use our own AI models?",
    "answer": "Absolutely. You can use your in-house LLMs or choose to use our hosted AI models depending on your preferences and requirements."
  },
  {
    "question": "What kind of templates are available?",
    "answer": "We offer a rich library of customizable templates and the ability to generate new ones using prompts in any language."
  },
  {
    "question": "How does AI help in retrospectives?",
    "answer": "Our AI analyzes feedback, detects patterns, and highlights key themes to help teams focus on what matters most and generate actionable insights."
  },
  {
    "question": "Can we collaborate in real time?",
    "answer": "Yes, the platform supports real-time collaboration, enabling teams to reflect and make decisions together no matter where they are."
  },
  {
    "question": "How do I sign in?",
    "answer": "You can securely sign in using Gmail or use Single Sign-On (SSO) if you're part of an enterprise setup."
  }
];

const openFaqs = ref(faqs.map(() => true));

function toggleFaq(idx) {
  openFaqs.value[idx] = !openFaqs.value[idx];
}

function expandAll() {
  openFaqs.value = faqs.map(() => true);
}

function collapseAll() {
  openFaqs.value = faqs.map(() => false);
}
</script>

<style scoped>
.help-root {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%);
  padding-bottom: 0;
}
.help-hero {
  background: linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%);
  padding: 3.5rem 0 2.5rem 0;
  text-align: center;
}
.help-title {
  font-size: 2.3rem;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 1.2rem;
  letter-spacing: -0.01em;
}
.help-intro {
  font-size: 1.18rem;
  color: #444;
  max-width: 700px;
  margin: 0 auto;
  margin-bottom: 0.5rem;
}
.help-section {
  max-width: 700px;
  margin: 2.5rem auto 0 auto;
  padding: 2.2rem 2rem 2rem 2rem;
  position: relative;
}
.card {
  border: 0px solid #e0e7ff;
}
.help-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 1.1rem 0;
}
.help-list {
  list-style: disc inside;
  margin: 0 0 10px 0;
  padding-left: 1.2em;
}
.help-list li {
  margin-bottom: 8px;
  color: #333;
  font-size: 1.07rem;
}
.faq-section {
  background: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  margin: 2.5rem auto 0 auto;
  max-width: 1100px;
  border: none;
}
.faq-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.2rem;
  flex-wrap: wrap;
}
.faq-title {
  font-size: 2.7rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.faq-controls {
  display: flex;
  gap: 1rem;
}
.faq-list {
  width: 100%;
}
.faq-item {
  display: flex;
  align-items: flex-start;
  gap: 2.2rem;
  padding: 1.5rem 0 1.5rem 0;
  background: none;
  position: relative;
}
.faq-num {
  font-size: 1.2rem;
  font-weight: 600;
  color: #64748b;
  min-width: 48px;
  text-align: right;
  margin-top: 0.2rem;
}
.faq-content {
  flex: 1 1 0;
}
.faq-q {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.7rem;
}
.faq-a {
  color: #374151;
  font-size: 1.07rem;
  line-height: 1.7;
}
.faq-toggle {
  background: #51aeda;
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 1.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1.2rem;
  margin-top: 0.2rem;
  cursor: pointer;
  transition: background 0.15s;
}
.faq-toggle:hover {
  background: #51aeda;
}
.faq-divider {
  width: 100%;
  height: 1px;
  background: #e5e7eb;
  margin: 0 auto;
}
.help-contact-section {
  text-align: center;
}
.help-contact {
  font-size: 1.08rem;
  margin-top: 10px;
}
.help-contact a {
  color: #3a0be4;
  text-decoration: underline;
}
.enterprise-section {
  background: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  margin: 2.5rem auto 0 auto;
  max-width: 700px;
  border: none;
}
.enterprise-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
}
.enterprise-icon {
  font-size: 1.7rem;
  color: #51aeda;
  flex-shrink: 0;
}
.enterprise-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #222;
}
.enterprise-intro {
  font-size: 1.08rem;
  color: #444;
  margin-bottom: 1.3rem;
  margin-top: 0.2rem;
}
.enterprise-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.enterprise-feature {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 6px 0 rgba(80, 80, 180, 0.06);
  padding: 1rem 1.2rem;
  font-size: 1.05rem;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.feature-check {
  color: #51aeda;
  font-size: 1.3rem;
}
@media (max-width: 900px) {
  .help-section {
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    max-width: 98vw;
  }
  .help-hero {
    padding: 2.2rem 0 1.2rem 0;
  }
  .help-title {
    font-size: 2rem;
  }
  .faq-section {
    max-width: 98vw;
    padding: 0 0.5rem;
  }
  .faq-title {
    font-size: 2rem;
  }
  .faq-item {
    flex-direction: column;
    gap: 0.7rem;
    padding: 1.2rem 0 1.2rem 0;
  }
  .faq-num {
    text-align: left;
    margin-bottom: 0.2rem;
  }
  .faq-toggle {
    margin-left: 0;
    margin-top: 0.7rem;
    align-self: flex-end;
  }
}
@media (max-width: 600px) {
  .help-section {
    padding: 1rem 0.2rem 1rem 0.2rem;
    max-width: 100vw;
  }
  .help-hero {
    padding: 1.2rem 0 0.7rem 0;
  }
  .help-title {
    font-size: 1.3rem;
  }
  .help-intro {
    font-size: 1rem;
  }
  .faq-section {
    padding: 0 0.1rem;
    margin-top: 1.2rem;
  }
  .faq-header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 1.1rem;
  }
  .faq-title {
    font-size: 1.2rem;
    margin-bottom: 0.2rem;
  }
  .faq-list {
    gap: 0.2rem;
  }
  .faq-item {
    padding: 0.6rem 0 0.6rem 0;
    gap: 0.3rem;
  }
  .faq-num {
    font-size: 1rem;
    min-width: 36px;
    margin-bottom: 0.1rem;
  }
  .faq-q {
    font-size: 1.05rem;
    margin-bottom: 0.2rem;
  }
  .faq-a {
    font-size: 0.97rem;
    line-height: 1.5;
  }
  .faq-toggle {
    width: 32px;
    height: 32px;
    font-size: 1.2rem;
    margin-top: 0.3rem;
  }
  .faq-divider {
    margin: 0.2rem 0;
  }
}
@media (max-width: 700px) {
  .enterprise-section {
    padding: 0 0.5rem;
    max-width: 98vw;
  }
}
</style> 