<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function closePopUp() {
  emit("close");
}
</script>

<template>
  <div
    class="pop-up-wrapper"
    @click="closePopUp"
    @keydown.esc="closePopUp"
    @keydown.enter="closePopUp"
    @keydown.space="closePopUp"
    tabindex="0"
    aria-label="fermer la fenêtre"
  >
    <UIFlexCard
      @click.stop
      @keydown.esc.stop
      @keydown.enter.stop
      @keydown.space.stop
      ><span v-if="title" class="titles">{{ title }}</span>
      <p v-if="subtitle" class="paragraphs">{{ subtitle }}</p>
      <slot
    /></UIFlexCard>
  </div>
</template>

<style lang="scss" scoped>
.pop-up-wrapper {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 100vw;
  height: 100dvh;
  inset: 0;
  background-color: $secondary-color-faded;
  backdrop-filter: blur(2px);
  z-index: 2;
  color: $text-color-alt;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
  }

  .paragraphs {
    text-wrap: balance;
  }
}
</style>
