<script setup lang="ts">
import { computed, onMounted, nextTick } from "vue";

interface Option {
  label: string;
  icon?: string;
}

const props = defineProps<{
  options: Option[];
}>();

const model = defineModel<string>({
  type: String,
});

const selectedIndex = computed(() =>
  props.options.findIndex((o) => o.label === model.value)
);

const indicatorStyle = computed(() => ({
  width: `${100 / props.options.length}%`,
  transform: `translateX(${selectedIndex.value * 100}%)`,
}));

onMounted(() => {
  if (!model.value && props.options.length > 0) {
    model.value = props.options[0].label;
  }
});

function select(label: string) {
  model.value = label;
  nextTick(() => {
    const active = document.querySelector<HTMLInputElement>(
      `input[value="${label}"]`
    );
    active?.focus();
  });
}
</script>

<template>
  <fieldset class="segmented-control" role="radiogroup">
    <template v-for="(opt, i) in props.options" :key="i">
      <input
        class="segmented-control__input"
        type="radio"
        :id="`seg-${i}`"
        :value="opt.label"
        v-model="model"
      />
      <label
        class="segmented-control__btn"
        :for="`seg-${i}`"
        tabindex="0"
        :aria-label="opt.label"
        role="button"
        @keydown.enter.prevent="select(opt.label)"
        @keydown.space.prevent="select(opt.label)"
      >
        <IconComponent
          v-if="opt.icon"
          :icon="opt.icon"
          class="segmented-control__icon"
        />
        <span>{{ opt.label }}</span>
      </label>
    </template>
    <span class="segmented-control__indicator" :style="indicatorStyle" />
  </fieldset>
</template>
<style lang="scss" scoped>
.segmented-control {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $accent-color-faded;
  border-radius: calc($radius/2);
  overflow: hidden;
  height: 44px;
  border: 2px solid transparent;

  &__input {
    display: none;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.75rem;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    z-index: 1;
    color: $text-color-alt;
    transition: color 0.3s;
    font-size: 0.85rem;

    @media (min-width: $big-tablet-screen) {
      padding: 1rem;
      font-size: 1rem;
    }
  }

  &__input:checked + &__btn {
    color: $base-color;
  }

  &__indicator {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background: $accent-color;
    transition: transform 0.3s;
    border-radius: inherit;
    height: 42px;
  }
}
</style>
