<script setup lang="ts">
defineProps<{
  title: string;
  count: number;
}>();
</script>
<template>
  <div class="counter">
    <span class="counter__count">{{ count }}</span>
    <span class="counter__title">{{ title }}</span>
  </div>
</template>
<style lang="scss" scoped>
.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: $text-color-alt;

  @media (min-width: $big-tablet-screen) {
    gap: 1.5rem;
  }

  &__count {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: $titles;
    font-weight: $extra-bold;
    background-color: $accent-color;
    border-radius: 50%;
    min-width: 100px;
    width: 100px;
    min-height: 100px;
    height: 100px;
  }

  &__title {
    font-size: $subtitles;
    font-weight: $semi-bold;
    text-align: center;
  }
}
</style>
