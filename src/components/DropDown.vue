<script setup lang="ts">
import { ref } from "vue";
import { colors } from "@/utils/colors";

interface Props {
  label: string;
  number?: number;
  icon?: string;
}

defineProps<Props>();

const isDropdownOpen = ref(false);
</script>
<template>
  <span class="dropdown" @click="isDropdownOpen = !isDropdownOpen"
    ><IconComponent v-if="icon" :icon :color="colors['primary-color']" />{{
      label
    }}
    <template v-if="number">({{ number }})</template
    ><IconComponent
      style="margin-left: auto"
      :icon="isDropdownOpen ? 'caret_down_bold' : 'caret_right_bold'" /></span
  ><Transition>
    <div class="estimation-form__checkboxes" v-if="isDropdownOpen">
      <slot /></div
  ></Transition>
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
