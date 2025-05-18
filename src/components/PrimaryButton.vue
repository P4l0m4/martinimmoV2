<script setup lang="ts">
import { computed } from "vue";
import { colors } from "@/utils/colors";

interface Props {
  variant?:
    | "secondary-color"
    | "accent-color"
    | "base-color"
    | "text-color"
    | "primary-color"
    | "transparent-dark"
    | "transparent-light";
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  icon?: string;
  iconSize?: string;
  fontSize?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary-color",
  direction: "row",
  fontSize: "1rem",
  iconSize: "1.25rem",
  radius: "",
});

const iconColor = computed(() => {
  switch (props.variant) {
    case "base-color":
      return colors["secondary-color-faded"];
    case "primary-color":
      return colors["accent-color"];
    case "secondary-color":
      return colors["primary-color"];
    case "text-color":
      return colors["accent-color-faded"];
    case "accent-color":
      return colors["primary-color"];
    case "transparent-light":
      return colors["transparent-light"];
    case "transparent-dark":
      return colors["transparent-dark"];
    default:
      return colors["base-color-faded"];
  }
});
</script>
<template>
  <button
    type="button"
    class="button noselect"
    :class="variant"
    :style="{ flexDirection: direction, fontSize }"
  >
    <slot />

    <IconComponent
      v-if="icon"
      :icon
      :size="iconSize || undefined"
      :color="iconColor"
    />
  </button>
</template>
<style scoped lang="scss">
.button {
  width: 100%;
  max-width: 375px;
  padding: 1rem 1.5rem;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
}

.icon-wrapper {
  display: flex;
  padding: 0.75rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.transparent-light {
  background-color: $transparent-light;
  color: $primary-color;
  border: 1px solid $primary-color;
  backdrop-filter: blur(2px);
}
.transparent-dark {
  background-color: $transparent-dark;
  color: $primary-color;
  border: 1px solid $primary-color-faded;
}

.secondary-color {
  background-color: $secondary-color;
  color: $base-color;
  border: 2px solid $secondary-color;
}

.accent-color {
  background-color: $accent-color;
  color: $primary-color;
  border: 2px solid $accent-color;
}

.base-color {
  background-color: $base-color;
  color: $secondary-color;
  border: 2px solid $base-color;
}

.text-color {
  background-color: $text-color;
  color: $primary-color;
  border: 2px solid $text-color;
}

.primary-color {
  background-color: $primary-color;
  color: $accent-color;
  border: 2px solid $primary-color;
}

//hover animation that will make buttons shiny
</style>
