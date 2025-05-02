<script setup lang="ts">
import { computed, onMounted } from "vue";

interface Option {
  label: string;
  icon?: string;
}

const props = defineProps<{
  options: Option[]; // tableau [{ label, icon }]
}>();

const model = defineModel<string>({
  type: String,
});

function select(label: string) {
  model.value = label;
}

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
</script>

<template>
  <div class="switch">
    <button
      v-for="(opt, i) in props.options"
      :key="i"
      type="button"
      class="switch__btn"
      :class="{ active: opt.label === model }"
      @click="select(opt.label)"
    >
      <IconComponent v-if="opt.icon" :icon="opt.icon" class="switch__icon" />
      <span>{{ opt.label }}</span>
    </button>

    <div class="switch__indicator" :style="indicatorStyle" />
  </div>
</template>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: flex;
  background: $base-color;
  border-radius: $radius;
  overflow: hidden;
  padding: 0.25rem;
  height: 44px;
  align-items: center;
  justify-content: center;

  &__btn {
    flex: 1 1 0;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    z-index: 1;
    transition: color 0.3s;

    &.active {
      color: $base-color;
    }
  }

  &__indicator {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background: $secondary-color;
    transition: transform 0.3s;
    border-radius: inherit;
    height: 44px;
  }
}
</style>
