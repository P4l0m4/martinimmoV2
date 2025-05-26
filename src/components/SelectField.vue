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
  icon: {
    type: String,
    required: false,
  },
});

onClickOutside(target, () => {
  isSelectOpen.value = false;
});

const emit = defineEmits(["optionSelected"]);

const optionSelected = ref("");
const isSelectOpen = ref(false);

const toggleDropdown = () => {
  isSelectOpen.value = !isSelectOpen.value;
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
  isSelectOpen.value = false;
}
</script>
<template>
  <div class="select-field" ref="target">
    <span
      class="select-field__selected"
      @click="toggleDropdown"
      @keydown.enter="toggleDropdown"
      @keydown.space="toggleDropdown"
      :class="{ shake: error, 'select-field__selected--open': isSelectOpen }"
      tabindex="0"
      role="button"
      :aria-label="defaultLabel"
    >
      <IconComponent
        v-if="icon"
        :icon
        size="1.25rem"
        :color="colors['primary-color']" />

      {{ optionSelected.length > 0 ? optionSelected : defaultLabel }}
      <span style="margin-left: auto">
        <IconComponent
          :icon="isSelectOpen ? 'caret_up_bold' : 'caret_down_bold'"
          size="1.25rem"
          :color="colors['primary-color']" /></span
    ></span>
    <div class="select-field__content" v-if="isSelectOpen">
      <span
        class="select-field__content__option"
        v-for="option in options"
        :key="option"
        @click="selectOption(option)"
        @keydown.enter="selectOption(option)"
        @keydown.space="selectOption(option)"
        tabindex="0"
        :aria-label="defaultLabel"
        :style="{
          backgroundColor:
            optionSelected === option
              ? colors['accent-color-faded']
              : undefined,
        }"
        >{{ option }}</span
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.select-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;

  &__selected {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    width: 100%;
    background-color: $accent-color-faded;
    color: $text-color-alt;
    border: 2px solid $accent-color-faded;
    border-radius: calc($radius/2);
    cursor: pointer;
    white-space: nowrap;
    max-height: 50px;

    &--open {
      border: 2px solid $accent-color;
    }
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
