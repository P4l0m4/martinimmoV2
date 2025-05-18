<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { colors } from "@/utils/colors";

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

const filledPct = computed(() => `${(level.value / 3) * 100}%`);
</script>

<template>
  <div class="renovation-difficulty">
    <label
      for="renovation-difficulty-range"
      class="renovation-difficulty__label"
      ><IconComponent
        icon="hammer_fill"
        :color="colors['primary-color']"
      />Travaux</label
    >

    <input
      id="renovation-difficulty-range"
      type="range"
      min="0"
      max="3"
      step="1"
      v-model="level"
      :style="{ '--filled': filledPct }"
    />

    <span class="renovation-difficulty__legend">{{ legends[level] }}</span>
  </div>
</template>

<style lang="scss" scoped>
.renovation-difficulty {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__legend {
    font-size: $small-text;
  }
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 17px;
  border-radius: $radius;
  border: none !important;
  background: transparent;
  cursor: pointer;

  /* Chrome / Edge / Safari */
  &::-webkit-slider-runnable-track,
  &::-moz-range-track {
    background: transparent;
    height: 16px;
    border-radius: $radius;
  }

  // gradient appliqué en inline (use fallback for browsers)
  background: linear-gradient(
    to right,
    $accent-color 0,
    $accent-color var(--filled),
    $accent-color-faded var(--filled),
    $accent-color-faded 100%
  );
}

/* IE / Edge Legacy */
input[type="range"]::-ms-track {
  height: 16px;
  border-radius: $radius;
  background: $accent-color-faded;
  border: none;
  color: transparent; /* sinon la piste est rayée sur IE */
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 34px;
  border-radius: $radius;
  background: $base-color;
  border: 2px solid $accent-color;
}
input[type="range"]::-moz-range-thumb {
  width: 24px;
  height: 32px;
  border-radius: 50%;
  background: $base-color;
  border: 2px solid $accent-color;
}
input[type="range"]::-ms-thumb {
  width: 24px;
  height: 32px;
  border-radius: 50%;
  background: $base-color;
  border: 2px solid $accent-color;
}

input[type="range"]:focus {
  outline: none;
}
input[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px rgba($secondary-color, 0.25);
}
input[type="range"]:focus::-moz-range-thumb {
  box-shadow: 0 0 0 4px rgba($secondary-color, 0.25);
}
</style>
