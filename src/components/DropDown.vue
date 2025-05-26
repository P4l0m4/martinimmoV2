<script setup lang="ts">
import { ref } from "vue";
import { colors } from "@/utils/colors";
import { onClickOutside } from "@vueuse/core";
import { useTemplateRef } from "vue";

interface Props {
  label: string;
  number?: number;
  icon?: string;
}

defineProps<Props>();

const isDropdownOpen = ref(false);

const target = useTemplateRef<HTMLElement>("target");
const contentEl = ref<HTMLElement | null>(null);

onClickOutside(target, () => (isDropdownOpen.value = false), {
  ignore: [contentEl],
});
</script>
<template>
  <span
    class="dropdown"
    ref="target"
    @click="isDropdownOpen = !isDropdownOpen"
    @keydown.enter.prevent="isDropdownOpen = !isDropdownOpen"
    @keydown.space.prevent="isDropdownOpen = !isDropdownOpen"
    tabindex="0"
    role="button"
    :aria-label="label"
  >
    <IconComponent v-if="icon" :icon :color="colors['primary-color']" />{{
      label
    }}
    <template v-if="number">({{ number }})</template
    ><IconComponent
      style="margin-left: auto"
      :icon="isDropdownOpen ? 'caret_down_bold' : 'caret_right_bold'"
  /></span>
  <div ref="contentEl" v-if="isDropdownOpen">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.dropdown {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  height: 40px;
  align-items: center;
  cursor: pointer;
}
</style>
