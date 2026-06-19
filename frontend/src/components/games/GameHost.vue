<template>
  <component
    :is="comp"
    v-if="comp"
    :current-user-id="currentUserId"
    :current-user-name="currentUserName"
    :is-facilitator="isFacilitator"
  />
  <div v-else class="game-host-missing">Unknown game.</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DoodleGame from './DoodleGame.vue';
import TriviaGame from './TriviaGame.vue';
import EmojiTales from './EmojiTales.vue';
import TwoTruthsLie from './TwoTruthsLie.vue';
import MeetingRoulette from './MeetingRoulette.vue';

const props = defineProps<{
  gameId: string;
  currentUserId: string;
  currentUserName: string;
  isFacilitator: boolean;
}>();

const registry: Record<string, any> = {
  doodle: DoodleGame,
  trivia: TriviaGame,
  emoji: EmojiTales,
  two_truths: TwoTruthsLie,
  meeting_roulette: MeetingRoulette,
};

const comp = computed(() => registry[props.gameId]);
</script>

<style scoped>
.game-host-missing {
  text-align: center;
  color: #64748b;
  padding: 40px 0;
}
</style>
