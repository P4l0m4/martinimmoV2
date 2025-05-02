<script setup lang="ts">
interface Props {
  color?: string;
}

withDefaults(defineProps<Props>(), {
  color: "#fffdfa",
});
</script>
<template>
  <div class="ui-loader">
    <span
      class="ui-loader__spinner"
      :style="{ border: `14px solid ${color}`, borderTopColor: 'transparent' }"
    ></span>
  </div>
</template>
<style lang="scss" scoped>
.ui-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  &__spinner {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    animation: spinner 1.4s linear infinite;
  }
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
