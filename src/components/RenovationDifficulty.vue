<script setup lang="ts">
import { ref, computed, watch } from "vue";

const discount = defineModel<number>({ default: 0 });

const level = ref<0 | 1 | 2 | 3>(0);

const discountTable: Record<0 | 1 | 2 | 3, number> = {
  0: 0,
  1: 0.5, // rafraîchissement léger : ~ coût réel, quasi pas de décote
  2: 12.5, // rénovation partielle : milieu de 10–15 %
  3: 20, // grosse rénovation     : milieu de 15–25 %
};

const discountPct = computed(() => discountTable[level.value]);

const legends = [
  "",
  "Rafraîchissement léger (peintures, sols…)",
  "Rénovation partielle (cuisine / SDB, électricité partielle…)",
  "Grosse rénovation (restructuration, copro travaux…)",
];

watch(
  discountPct,
  (pct) => {
    discount.value = pct;
  },
  { immediate: true }
);
</script>

<template>
  <div class="renovation-difficulty">
    <label for="renovation-difficulty__label">Travaux</label>

    <input
      id="renovation-difficulty__range"
      type="range"
      min="0"
      max="3"
      step="1"
      v-model="level"
    />

    <span class="renovation-difficulty__legend">{{ legends[level] }}</span>
  </div>
</template>

<style lang="scss" scoped>
.renovation-difficulty {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__legend {
    font-size: $small-text;
  }
}

input[type="range"] {
  width: 100%;
}
</style>
