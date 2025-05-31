<script setup lang="ts">
defineProps<{
  height?: number;
  maxWidth?: number;
}>();
</script>

<template>
  <Transition>
    <span
      class="skeleton"
      :style="{ height: `${height}px`, maxWidth: `${maxWidth}px` }"
    ></span
  ></Transition>
</template>

<style scoped lang="scss">
.skeleton {
  display: flex;
  border-radius: calc($radius/2);
  width: 100%;
  height: 100%;
  min-height: 40px;
  background: linear-gradient(
    135deg,
    rgba($accent-color, 0.1) 50%,
    $primary-color-faded,
    rgba($accent-color, 0.1) 55%
  );
  background-size: 400%;
  animation: moveBackground 2s ease-in infinite;
}

@keyframes moveBackground {
  0% {
    background-position: 100%;
  }
  100% {
    background-position: 0%;
  }
}
</style>
