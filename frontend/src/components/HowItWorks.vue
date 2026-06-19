<template>
  <div class="how-it-works-stepper">
    <div class="how-header">
      <div class="how-title-stepper">How it works</div>
      <div class="how-subtitle-stepper">
        Get started in minutes! Sign in, create your board, collaborate, and generate insights instantly.
      </div>
    </div>
    <div class="stepper-container">
      <svg class="stepper-line" viewBox="0 0 1000 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 60 40 Q 250 0 440 40 T 820 40" stroke="#B5E1FF" stroke-width="3" stroke-dasharray="8 8" fill="none"/>
      </svg>
      <div class="stepper-steps">
        <div class="stepper-step">
          <img :src="signinImage" alt="Sign in" class="stepper-img" />
          <div class="stepper-title">Sign in</div>
        </div>
        <div class="stepper-step">
          <img :src="prompt" alt="Choose template" class="stepper-img" />
          <div class="stepper-title">Give Prompt</div>
        </div>
        <div class="stepper-step">
          <img :src="aiTemplate" alt="Customize board" class="stepper-img" />
          <div class="stepper-title">Customize</div>
        </div>
        <div class="stepper-step">
          <img :src="boardImage" alt="Collaborate" class="stepper-img" />
          <div class="stepper-title">Collaborate</div>
        </div>
        <div class="stepper-step">
          <img :src="summaryImage" alt="Insights" class="stepper-img" />
          <div class="stepper-title">Insights</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import signinImage from '@/assets/signin.png';
import selectTemplate from '@/assets/select-template.png';
import prompt from '@/assets/prompt.png';
import aiTemplate from '@/assets/AI Template.png';
import boardImage from '@/assets/board.png';
import summaryImage from '@/assets/summary.png';
</script>

<style scoped>
.how-it-works-stepper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1rem 3rem 1rem;
  background: #fff;
}
.how-header {
  text-align: center;
  margin-bottom: 2.5rem;
}
.how-title-stepper {
  font-size: 2.1rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 0.7rem;
  letter-spacing: -0.01em;
}
.how-subtitle-stepper {
  color: #4a4a4a;
  font-size: 1.08rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}
.stepper-container {
  position: relative;
  width: 100%;
  min-height: 180px;
  margin-top: 2.5rem;
}
.stepper-line {
  position: absolute;
  top: 38px;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 0;
  pointer-events: none;
  display: block;
}
.stepper-steps {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 1;
  width: 100%;
  gap: 0;
}
.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0;
  min-width: 0;
  background: transparent;
}
.stepper-img {
  width: 160px;
  height: 130px;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 4px 16px 0 rgba(60, 80, 255, 0.10);
  background: #fff;
  margin-bottom: 1.1rem;
}
.stepper-title {
  font-size: 1.08rem;
  font-weight: 700;
  margin-top: 0.2rem;
  letter-spacing: -0.01em;
}
@media (max-width: 900px) {
  .stepper-img {
    width: 70px;
    height: 50px;
  }
  .how-title-stepper {
    font-size: 1.3rem;
  }
}
@media (max-width: 700px) {
  .stepper-container {
    min-height: unset;
    margin-top: 1.2rem;
  }
  .stepper-line {
    display: none;
  }
  .stepper-steps {
    flex-direction: column;
    align-items: center;
    gap: 2.2rem;
  }
  .stepper-step {
    margin-bottom: 0.5rem;
  }
  .stepper-img {
    width: 90vw;
    max-width: 220px;
    height: auto;
    margin-bottom: 0.7rem;
  }
}
</style> 