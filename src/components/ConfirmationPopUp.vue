<script setup lang="ts">
import { ref } from "vue";
const target = ref<HTMLElement | null>(null);

const emit = defineEmits(["closeConfirmation"]);
</script>

<template>
  <section class="pop-up" @click="emit('closeConfirmation')">
    <div class="pop-up__content" ref="target">
      <span class="paragraphs"><slot /></span>
      <slot name="button" />
    </div>
  </section>
</template>
<style lang="scss" scoped>
.pop-up {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  width: 100vw;
  background-color: $secondary-color-faded;
  backdrop-filter: blur(4px);
  padding: 1rem;
  z-index: 1;

  &__content {
    background-color: $primary-color;
    border-radius: $radius;
    padding: 1rem;
    width: 100%;
    max-width: 400px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    text-align: center;
    white-space: pre-wrap;

    & :deep(a) {
      color: $secondary-color !important;
      text-decoration: underline !important;
    }
  }
}
</style>
