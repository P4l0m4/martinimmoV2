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
  variant: "secondary-color",
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
      return colors["accent-color-faded"];
    case "secondary-color":
      return colors["accent-color-faded"];
    case "text-color":
      return colors["accent-color-faded"];
    case "accent-color":
      return colors["accent-color"];
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
  <span
    role="button"
    tabindex="0"
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
  </span>
</template>
<style scoped lang="scss">
.button {
  width: 100%;
  max-width: 375px;
  padding: 1rem 1.75rem;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border-radius: $radius;
  font-weight: $regular;
}

.icon-wrapper {
  display: flex;
  padding: 0.75rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.secondary-color {
  color: $secondary-color;
  border: 2px solid $secondary-color;
}

.accent-color {
  color: $primary-color;
  border: 2px solid $accent-color;
}

.base-color {
  color: $secondary-color;
  border: 2px solid $base-color;
}

.text-color {
  color: $primary-color;
  border: 2px solid $text-color;
}

.primary-color {
  color: $text-color;
  border: 2px solid $primary-color;
}
</style>
