<template>
  <div class="about-root">
    <section class="about-hero">
      <div class="about-hero-content">
        <h1 class="about-title">About <span>reAItro</span></h1>
        <p class="about-intro">
          reAItro is an innovative, next-generation platform designed to supercharge agile retrospectives by
          leveraging the power of artificial intelligence. Our mission is to streamline the retrospective process, making it
          more efficient, insightful, and enjoyable for teams of all sizes and industries.
        </p>
      </div>
    </section>

    <AppPage variant="marketing">
    <section class="about-section card">
      <div class="about-section-header">
        <span class="about-section-icon">🌟</span>
        <h2>Our Vision</h2>
      </div>
      <p>
        We aim to empower teams to reflect effectively on their workflows, identify areas of improvement, and foster a
        culture of continuous growth and collaboration. By harnessing AI, we help teams unlock deeper insights and drive
        meaningful change.
      </p>
    </section>

    <section class="about-section about-offer">
      <div class="about-section-header">
        <span class="about-section-icon">🚀</span>
        <h2>What We Offer</h2>
      </div>
      <div class="offer-grid">
        <div class="offer-feature">
          <div class="offer-icon"><span>✨</span></div>
          <div class="offer-title">AI-Powered Insights</div>
          <div class="offer-desc">Our advanced AI analyzes team feedback, detects patterns, and highlights key themes, helping you focus on what matters most.</div>
        </div>
        <div class="offer-feature">
          <div class="offer-icon"><span>📋</span></div>
          <div class="offer-title">Customizable Templates</div>
          <div class="offer-desc">Access a rich library of templates tailored to different team needs, or generate new templates using a prompt in any language to suit your unique workflow.</div>
        </div>
        <div class="offer-feature">
          <div class="offer-icon"><span>🤝</span></div>
          <div class="offer-title">Real-Time Collaboration</div>
          <div class="offer-desc">Collaborate with your team live, add comments and make decisions together-no matter where you are.</div>
        </div>
        <div class="offer-feature">
          <div class="offer-icon"><span>🔒</span></div>
          <div class="offer-title">Privacy & Security</div>
          <div class="offer-desc">Your data is encrypted and protected. We are committed to maintaining the highest standards of privacy and security for all users.</div>
        </div>
      </div>
    </section>

    <section class="about-section enterprise-section">
      <div class="enterprise-header">
        <span class="enterprise-icon">🏢</span>
        <h2>Enterprise & Custom Deployments</h2>
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

    <section class="about-section card about-how">
      <div class="about-section-header">
        <span class="about-section-icon">🔎</span>
        <h2>How It Works</h2>
      </div>
      <div class="how-grid">
        <div class="how-step">
          <div class="how-icon">📄</div>
          <div class="how-content">
            <div class="how-title">Choose or Create a Template</div>
            <div class="how-desc">Start with a ready-made template or generate your own using a simple prompt.</div>
          </div>
        </div>
        <div class="how-step">
          <div class="how-icon">👥</div>
          <div class="how-content">
            <div class="how-title">Invite Your Team</div>
            <div class="how-desc">Share a link and bring everyone together, whether remote or in-person.</div>
          </div>
        </div>
        <div class="how-step">
          <div class="how-icon">💬</div>
          <div class="how-content">
            <div class="how-title">Reflect & Collaborate</div>
            <div class="how-desc">Add feedback and discuss ideas on the most important topics in real time.</div>
          </div>
        </div>
        <div class="how-step">
          <div class="how-icon">🤖</div>
          <div class="how-content">
            <div class="how-title">Get AI Insights</div>
            <div class="how-desc">Let our AI summarize feedback and suggest actionable next steps.</div>
          </div>
        </div>
      </div>
    </section>

    <section class="about-section card">
      <div class="about-section-header">
        <span class="about-section-icon">🔐</span>
        <h2>Login & Privacy</h2>
      </div>
      <p>
        You can sign in securely using Gmail. We support standard sign-in as well as Single Sign-On (SSO) with Microsoft for enterprise users. <br>
        <strong>Privacy First:</strong> We do <u>not</u> store any personal user information. Only Boards and Messages details are stored, and all data is securely hosted in the Europe Region to comply with strict data protection standards.
      </p>
    </section>

    <section class="about-section card">
      <div class="about-section-header">
        <span class="about-section-icon">💡</span>
        <h2>Why Choose Us?</h2>
      </div>
      <ul class="about-benefits">
        <li>Supports global teams with multi-language capabilities.</li>
        <li>Continuous updates and new features based on user feedback.</li>
      </ul>
    </section>

    <section class="about-section card">
      <div class="about-section-header">
        <span class="about-section-icon">🤝</span>
        <h2>Our Commitment</h2>
      </div>
      <p>
        We are dedicated to providing a user-friendly, secure, and innovative platform that respects your privacy and
        enhances your team's productivity. Your feedback drives our evolution-together, we can build better teams and
        better products.
      </p>
    </section>

    <section class="about-section about-cta">
      <div class="about-closing">
        <strong>Ready to transform your retrospectives?</strong> <br />
        Try reAItro today and experience the future of agile teamwork!
      </div>
    </section>
    </AppPage>

    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue';
import AppPage from '@/components/ui/AppPage.vue';
// No script needed for static content
</script>

<style scoped>
.about-root {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%);
  padding-bottom: 0;
}

.about-hero {
  background: linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%);
  padding: 3.5rem 0 2.5rem 0;
  text-align: center;
}

.about-title {
  font-size: 2.6rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 1.2rem;
  letter-spacing: -0.01em;
}
.about-title span {
  color: #2563eb;
}

.about-intro {
  font-size: 1.18rem;
  color: #444;
  max-width: 700px;
  margin: 0 auto;
  margin-bottom: 0.5rem;
}

.about-section {
  max-width: 700px;
  margin: 2.5rem auto 0 auto;
  padding: 2.2rem 2rem 2rem 2rem;
  position: relative;
}

@media (max-width: 768px){
  .about-root p {
    padding-left: 10px;
  }
}

.card {
  border: 0px solid #e0e7ff;
}

.about-section-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.1rem;
}

.about-section-icon {
  font-size: 1.5rem;
  color: #2563eb;
  flex-shrink: 0;
}

.about-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
  margin: 0;
}

.about-features,
.about-benefits {
  list-style: disc inside;
  margin: 0 0 10px 0;
  padding-left: 1.2em;
}

.about-features li,
.about-benefits li {
  margin-bottom: 8px;
  color: #333;
  font-size: 1.07rem;
}

.about-features strong,
.about-steps strong {
  color: #2563eb;
}

.about-steps {
  list-style: decimal inside;
  margin: 0 0 10px 0;
  padding-left: 1.2em;
}

.about-steps li {
  margin-bottom: 8px;
  color: #444;
  font-size: 1.06rem;
}

.about-how {
  /* background: linear-gradient(90deg, #f8fafc 60%, #e0e7ff 100%); */
}
.how-grid {
  display: grid;
  grid-template-columns:1fr 1fr;
  gap: 2.2rem 2.5rem;
  margin-top: 2.2rem;
}
.how-step {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(80, 80, 180, 0.07);
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
  min-height: 150px;
  transition: box-shadow 0.2s;
}
.how-step:hover {
  box-shadow: 0 8px 32px 0 rgba(80, 80, 180, 0.13);
}
.how-icon {
  width: 44px;
  height: 44px;
  background: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #2563eb;
  flex-shrink: 0;
}
.how-title {
  font-weight: 700;
  font-size: 1.13rem;
  margin-bottom: 0.5rem;
  color: #222;
}
.how-desc {
  color: #444;
  font-size: 1.01rem;
  line-height: 1.6;
}
@media (max-width: 1200px) {
  .how-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
}
@media (max-width: 800px) {
  .how-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
}
.about-closing {
  margin-top: 16px;
  font-size: 1.08rem;
  text-align: center;
  font-weight: 500;
  padding: 2.5rem 0 1.5rem 0;
}

@media (max-width: 900px) {
  .about-section {
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    max-width: 98vw;
  }
  .about-hero {
    padding: 2.2rem 0 1.2rem 0;
  }
  .about-title {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .about-section {
    padding: 1rem 0.2rem 1rem 0.2rem;
    max-width: 100vw;
  }
  .about-hero {
    padding: 1.2rem 0 0.7rem 0;
  }
  .about-title {
    font-size: 1.3rem;
  }
  .about-intro {
    font-size: 1rem;
  }
}

.about-offer {
  /* background: linear-gradient(270deg, #f8fafc 60%, #f3e8ff 100%); */
}
.offer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.2rem 2.5rem;
  margin-top: 2.2rem;
}
.offer-feature {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(80, 80, 180, 0.07);
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 170px;
  transition: box-shadow 0.2s;
}
.offer-feature:hover {
  box-shadow: 0 8px 32px 0 rgba(80, 80, 180, 0.13);
}
.offer-icon {
  width: 44px;
  height: 44px;
  background: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-bottom: 1.1rem;
  color: #2563eb;
}
.offer-title {
  font-weight: 700;
  font-size: 1.13rem;
  margin-bottom: 0.5rem;
  color: #222;
}
.offer-desc {
  color: #444;
  font-size: 1.01rem;
  line-height: 1.6;
}
@media (max-width: 900px) {
  .offer-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.enterprise-section {
  padding: 2.5rem 2rem 2.2rem 2rem;
  margin: 2.5rem auto 0 auto;
  max-width: 700px;
  border: none;
}
.enterprise-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.1rem;
}
.enterprise-icon {
  font-size: 1.7rem;
  color: #2563eb;
  flex-shrink: 0;
}
.enterprise-section h2 {
  font-size: 1.35rem;
  font-weight: 800;
  color: #222;
  margin: 0;
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
  gap: 0.85rem;
}
.enterprise-feature {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 6px 0 rgba(80, 80, 180, 0.06);
  padding: 0.85rem 1.1rem;
  font-size: 1.05rem;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.feature-check {
  color: #2563eb;
  font-size: 1.2rem;
}
@media (max-width: 700px) {
  .enterprise-section {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    max-width: 98vw;
  }
}
</style>