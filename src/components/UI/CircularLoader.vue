<script setup lang="ts">
import { colors } from "@/utils/colors";
interface Props {
  color?: string;
  size?: string;
}

withDefaults(defineProps<Props>(), {
  color: colors["base-color"],
  size: "140px",
});
</script>
<template>
  <div class="ui-loader">
    <span
      class="ui-loader__spinner"
      :style="{
        border: `14px solid ${color}`,
        borderTopColor: 'transparent',
        width: size,
        height: size,
      }"
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
    border-radius: 50%;
    animation: spin 1.4s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
