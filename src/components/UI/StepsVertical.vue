<script setup lang="ts">
import { steps } from "@/utils/data";
import { colors } from "@/utils/colors";
</script>
<template>
  <div class="steps-vertical">
    <div
      class="steps-vertical__step"
      :class="{ 'steps-vertical__step--checked': i === 0 }"
      v-for="(step, i) in steps"
      :key="i"
    >
      <span class="steps-vertical__step__number" v-if="i !== 0">{{
        i + 1
      }}</span>
      <span v-else class="steps-vertical__step__check"
        ><IconComponent
          :color="colors['accent-color']"
          size="2rem"
          icon="check_fat_fill"
      /></span>
      <div class="steps-vertical__step__details">
        <h3 class="steps-vertical__step__details__name">{{ step.name }}</h3>
        <h4 class="steps-vertical__step__details__description">
          {{ step.description }}
        </h4>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.steps-vertical {
  display: flex;
  gap: 2rem;
  flex-direction: column;

  &__step {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    width: 100%;
    text-align: left;

    @media (min-width: $tablet-screen) {
      max-width: 300px;
      flex-direction: column;
      text-align: center;
    }

    @media (min-width: $big-tablet-screen) {
      flex-direction: row;
      text-align: left;
    }

    &--checked {
      background-color: $accent-color;
      padding: 1.5rem;
      padding-left: 0;
      background: linear-gradient(
        to right,
        transparent 0%,
        $accent-color-faded 100%
      );
    }

    &__number {
      font-size: 4rem;
      font-weight: $extra-bold;
      color: $accent-color;
    }

    &__check {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 3.125rem;
      min-width: 3.125rem;
      height: 3.125rem;
      min-height: 3.125rem;
      background-color: $base-color;
      border-radius: 50%;
    }

    &__details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      &__name {
        font-size: 1.5rem;
        font-weight: $medium;
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
