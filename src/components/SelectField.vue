<script setup lang="ts">
import { ref } from "vue";
import { colors } from "@/utils/colors";
import { onClickOutside } from "@vueuse/core";

const target = ref();

defineProps({
  options: {
    type: Array as () => string[],
    required: true,
  },
  defaultLabel: {
    type: String,
    required: true,
  },
  error: String,
});

onClickOutside(target, () => {
  isDropdownOpen.value = false;
});

const emit = defineEmits(["optionSelected"]);

const optionSelected = ref("");
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const model = defineModel<string>({
  type: String,
});

function select(option: string) {
  model.value = option;
}

function selectOption(option: string) {
  if (optionSelected.value === option) {
    optionSelected.value = "";
    select("");
  } else {
    optionSelected.value = option;
    select(option);
  }
  isDropdownOpen.value = false;
}
</script>
<template>
  <div class="dropdown" ref="target">
    <span
      class="dropdown__selected"
      @click="toggleDropdown"
      :class="{ shake: error }"
    >
      <IconComponent
        icon="rows"
        size="1.5rem"
        :color="colors['secondary-color']" />

      {{ optionSelected.length > 0 ? optionSelected : defaultLabel }}
      <span style="opacity: 0.6; margin-left: auto">
        <IconComponent
          :icon="isDropdownOpen ? 'caret-up-bold' : 'caret-down-bold'"
          size="1.25rem"
          :color="colors['text-color']" /></span
    ></span>
    <div class="dropdown__content" v-if="isDropdownOpen">
      <span
        class="dropdown__content__option"
        v-for="option in options"
        :key="option"
        @click="selectOption(option)"
        :style="{
          opacity: optionSelected === option ? 0.6 : 1,
          backgroundColor:
            optionSelected === option ? colors['base-color'] : '',
        }"
        >{{ option }}</span
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.dropdown {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;

  &__selected {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    width: 100%;
    background-color: $base-color;
    color: $text-color;
    border-radius: calc($radius/2);
    cursor: pointer;
    white-space: nowrap;
    max-height: 50px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: -256px;
    background-color: $base-color;
    border-radius: calc($radius/2);
    width: 100%;
    overflow-y: scroll;
    max-height: 240px;
    border: 1px solid rgba($accent-color, 0.2);
    box-shadow: $shadow-black;

    @media (min-width: $big-tablet-screen) {
      max-height: 200px;
      top: -216px;
      overflow: hidden;
    }

    &__option {
      padding: 0.75rem 1rem;
      width: 100%;
      height: fit-content;
      min-height: 40px;
      cursor: pointer;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      color: $text-color;

      &:hover {
        background-color: $accent-color-faded;
      }
    }
  }
}
</style>
