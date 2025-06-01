<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
import { useResizeObserver } from "@vueuse/core";
import { colors } from "@/utils/colors";

const props = withDefaults(
  defineProps<{
    title: string;
    data: { name: string; value: number }[];
    width?: string;
    height?: string;
  }>(),
  {
    width: "100%",
    height: "400px",
  }
);

const container = ref<HTMLDivElement | null>(null);
const chart = ref<echarts.ECharts | null>(null);

useResizeObserver(container, () => chart.value?.resize());

onMounted(() => {
  chart.value = echarts.init(container.value!);
  chart.value.setOption({
    title: {
      text: props.title,
      left: "center",
      top: "10",
      textStyle: {
        color: colors["primary-color"],
        fontWeight: "600",
        fontSize: 24,
        fontFamily: "Figtree",
      },
    },
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: {
      bottom: 0,
      textStyle: {
        color: colors["primary-color"],
        fontWeight: "400",
        fontSize: 16,
        fontFamily: "Figtree",
      },
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontWeight: "bold",
            color: colors["primary-color"],
          },
        },
        itemStyle: {
          borderRadius: 6,
          borderColor: colors["accent-color"],
          borderWidth: 2,
        },
        data: props.data.map((d, i) => ({
          ...d,
          itemStyle: {
            color: [
              colors["base-color"],
              colors["accent-color"],
              colors["gold-color"],
              colors["warning-color"],
            ][i],
          },
        })),
      },
    ],
  });
});

onBeforeUnmount(() => chart.value?.dispose());

watch(
  () => props.data,
  () => {
    chart.value?.setOption({
      series: [
        {
          data: props.data.map((d, i) => ({
            ...d,
            itemStyle: {
              color: [colors["accent-color"], colors["accent-color-faded"]][i],
            },
          })),
        },
      ],
    });
  },
  { immediate: true }
);
</script>

<template>
  <div ref="container" :style="{ width: props.width, height: props.height }" />
</template>
