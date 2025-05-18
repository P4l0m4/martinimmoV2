<script setup lang="ts">
import { steps } from "@/utils/data";
</script>
<template>
  <div class="steps">
    <div class="steps__step" v-for="(step, i) in steps" :key="i">
      <span class="steps__step__number">{{ i + 1 }}</span>
      <div class="steps__step__details">
        <h3 class="steps__step__details__name">{{ step.name }}</h3>
        <h4 class="steps__step__details__description">
          {{ step.description }}
        </h4>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.steps {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  flex-direction: column;

  @media (min-width: $big-tablet-screen) {
    flex-direction: row;
  }

  &__step {
    display: flex;
    gap: 1rem;
    align-items: center;

    @media (min-width: $tablet-screen) {
      flex-direction: column;
      text-align: center;
    }

    @media (min-width: $big-tablet-screen) {
      flex-direction: row;
      text-align: left;
    }

    &__number {
      font-size: 4rem;
      font-weight: $extra-bold;
      color: $accent-color;
    }

    &__details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      &__name {
        font-size: 1.5rem;
        font-weight: $semi-bold;
        color: $text-color-alt;
      }

      &__description {
        font-size: 1rem;
        color: $primary-color;
        font-weight: $regular;
      }
    }
  }
}
</style>
