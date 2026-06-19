<template>
  <div class="how-cards-root">
    <div class="how-cards-header">
      <h2 class="how-cards-title">How It <span class="highlight">Works</span></h2>
      <div class="how-cards-desc">
        Get started in four simple steps. Collaborate, customize, and generate insights with ease.
      </div>
    </div>
    <div class="how-cards-grid">
      <div class="how-card">
        <img :src="signinImage" alt="Sign in" class="how-card-img" />
        <div class="how-card-title">Sign in to your account</div>
        <div class="how-card-desc">
          Get started by signing in to your account.<br>
          Google account for seamless integration or anonymous access for quick collaboration.
        </div>
      </div>
      <div class="how-card">
        <img :src="prompt" alt="Give prompt" class="how-card-img" />
        <div class="how-card-title">Give a prompt</div>
        <div class="how-card-desc">
          Use our AI-powered prompt or select a template to generate a custom board for your team.
        </div>
      </div>
      <div class="how-card">
        <img :src="aiTemplate" alt="Customize board" class="how-card-img" />
        <div class="how-card-title">Customize your board</div>
        <div class="how-card-desc">
          Adjust columns, invite your team, and set board preferences. Make it fit your workflow and privacy needs.
        </div>
      </div>
      <div class="how-card">
        <img :src="summaryImage" alt="Generate insights" class="how-card-img" />
        <div class="how-card-title">Generate actionable insights</div>
        <div class="how-card-desc">
          Use our AI-powered summary to identify key themes, generate action items, and export a comprehensive report.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import signinImage from '@/assets/signin.png';
import prompt from '@/assets/prompt.png';
import aiTemplate from '@/assets/AI Template.png';
import summaryImage from '@/assets/summary.png';
</script>

<style scoped>
.how-cards-root {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1rem 3rem 1rem;
  background: #fff;
}
.how-cards-header {
  text-align: center;
  margin-bottom: 2.5rem;
}
.how-cards-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 0.7rem;
  letter-spacing: -0.01em;
}
.how-cards-title .highlight {
  color: #7c3aed;
}
.how-cards-desc {
  color: #4a4a4a;
  font-size: 1.08rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}
.how-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.2rem 2.2rem;
}
.how-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(124, 58, 237, 0.07);
  padding: 2.2rem 1.5rem 1.7rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: 320px;
}
.how-card-img {
  width: 200px;
  height: 160px;
  object-fit: contain;
  margin: 1.2rem 0 1.2rem 0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 24px 0 rgba(124, 58, 237, 0.13);
  transition: box-shadow 0.2s, transform 0.2s;
}
.how-card-title {
  font-size: 1.13rem;
  font-weight: 700;
  color: #7c3aed;
  margin-bottom: 0.7rem;
  text-align: center;
}
.how-card-desc {
  color: #444;
  font-size: 1.01rem;
  line-height: 1.7;
  font-weight: 400;
  text-align: center;
}
@media (max-width: 900px) {
  .how-cards-grid {
    gap: 1.2rem 1.2rem;
  }
  .how-card {
    padding: 1.2rem 0.7rem 1rem 0.7rem;
    min-height: 220px;
  }
  .how-card-img {
    width: 120px;
    height: 90px;
    margin: 1.2rem 0 0.7rem 0;
    border-radius: 12px;
  }
}
@media (max-width: 700px) {
  .how-cards-root {
    padding: 1.5rem 0.2rem 2rem 0.2rem;
  }
  .how-cards-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  .how-card {
    min-height: 0;
  }
  .how-card-img {
    width: 90vw;
    max-width: 260px;
    height: auto;
    margin: 1.2rem 0 0.7rem 0;
  }
}
</style> 