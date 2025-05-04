<script setup lang="ts">
import { ref } from "vue";

interface Props {
  label: string;
  number?: number;
}

defineProps<Props>();

const isDropdownOpen = ref(false);
</script>
<template>
  <span class="dropdown" @click="isDropdownOpen = !isDropdownOpen"
    >{{ label }} <template v-if="number">({{ number }})</template
    ><IconComponent
      :icon="isDropdownOpen ? 'caret-down-bold' : 'caret-right-bold'" /></span
  ><Transition>
    <div class="estimation-form__checkboxes" v-if="isDropdownOpen">
      <slot /></div
  ></Transition>
</template>
<style lang="scss" scoped>
.dropdown {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  height: 40px;
  align-items: center;
  cursor: pointer;
}
</style>
