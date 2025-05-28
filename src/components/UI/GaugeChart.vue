<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { colors } from "@/utils/colors";

const props = withDefaults(
  defineProps<{
    title: string;
    value: number;
    min?: number;
    max?: number;
    width?: string;
    height?: string;
  }>(),
  {
    min: 0,
    max: 1_000_000,
    width: "100%",
    height: "300px",
  }
);

const container = ref<HTMLDivElement | null>(null);
const chart = ref<echarts.ECharts | null>(null);

useResizeObserver(container, () => chart.value?.resize());

onMounted(() => {
  chart.value = echarts.init(container.value!);

  chart.value.setOption(
    {
      title: {
        text: props.title,
        left: "center",
        bottom: 0,
        textStyle: {
          color: colors["primary-color"],
          fontWeight: "600",
          fontSize: 24,
          fontFamily: "Figtree",
        },
      },
      series: [
        {
          type: "gauge",
          progress: {
            show: true,
          },
          min: props.min,
          max: props.max,
          splitNumber: 4,
          radius: "90%",
          axisLine: {
            lineStyle: {
              width: 10,
              color: [[1, colors["accent-color-faded"]]],
            },
          },
          axisLabel: {
            color: colors["primary-color"],
            distance: 20,
            fontSize: 12,
            formatter: (v: number) => (v >= 1_000 ? v / 1_000 : v),
          },
          axisTick: {
            length: 8,
            lineStyle: { color: colors["primary-color"] },
          },
          splitLine: {
            length: 12,
            lineStyle: {
              color: colors["primary-color"],
              width: 3,
            },
          },
          pointer: { width: 4 },
          detail: {
            valueAnimation: true,
            formatter: (v: number) => v.toLocaleString("fr-FR") + " €",
            color: colors["primary-color"],
            fontSize: 16,
            fontWeight: 600,
          },
          data: [{ value: props.value }],
        },
      ],
    },
    { notMerge: true }
  );
});

onBeforeUnmount(() => chart.value?.dispose());

watch(
  () => props.value,
  (value) => {
    if (chart.value) {
      chart.value.setOption({
        series: [{ data: [{ value }] }],
      });
    }
  }
);
</script>

<template>
  <div
    ref="container"
    :style="{ width: props.width, height: props.height }"
  ></div>
</template>
