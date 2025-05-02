<template>
  <div class="wrapper">
    <svg class="donut-chart" viewBox="0 0 100 100">
      <circle class="segment" cx="50" cy="50" r="40" />
      <circle
        v-for="(segment, index) in computedSegments"
        :key="index"
        :class="segment.color"
        :stroke-dasharray="`${segment.percent} ${
          circumference - segment.percent
        }`"
        :stroke-dashoffset="segment.offset"
        class="segment"
        cx="50"
        cy="50"
        r="40"
      />
    </svg>
    <span class="valid-segments-count" v-if="validSegments !== undefined">
      {{ validSegments }}/{{ maxValue }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Segment = {
  value: number;
  color: "green" | "blue" | "purple" | "red" | "orange" | "yellow";
};

type ComputedSegment = {
  color: "green" | "blue" | "purple" | "red" | "orange" | "yellow";
  percent: number;
  offset: number;
};

const props = defineProps<{
  segments: Segment[];
  maxValue?: number;
  validSegments?: number;
}>();

const circumference = Math.PI * 80;

const totalValue = computed(() => {
  const sumOfValues = props.segments.reduce(
    (acc, segment) => acc + segment.value,
    0
  );
  return Math.max(props.maxValue ?? 0, sumOfValues);
});

const computedSegments = computed<ComputedSegment[]>(() => {
  let nextOffset = circumference / 4;
  return props.segments.map((segment) => {
    const percent = (segment.value / totalValue.value) * circumference;
    const currentSegment = {
      color: segment.color,
      percent,
      offset: nextOffset,
    };
    nextOffset -= percent;
    return currentSegment;
  });
});
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
  transform: scale(1.5);
}

.donut-chart {
  width: 100px;
  height: 100px;
}

.segment {
  stroke: $primary-color;
  stroke-width: 10;
  fill: transparent;

  &.green {
    stroke: $success-color;
  }
  &.blue {
    stroke: $success-color;
  }
  &.purple {
    stroke: $loading-color;
  }
  &.red {
    stroke: $error-color;
  }
  &.orange {
    stroke: orange;
  }
  &.yellow {
    stroke: yellow;
  }
}

.valid-segments-count {
  font-size: 1.5rem;
  font-weight: $semi-bold;
  position: absolute;
  inset: 0;
  margin: auto;
  height: fit-content;
  width: fit-content;
}
</style>
