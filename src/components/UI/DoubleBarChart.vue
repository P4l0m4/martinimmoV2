<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { colors } from "@/utils/colors";

const props = withDefaults(
  defineProps<{
    title: string;
    tooltip?: object;
    xAxisData: string[];
    data1: number[];
    data2: number[];
    width?: string;
    height?: string;
  }>(),
  {
    width: "100%",
    height: "400px",
  }
);

const chartContainerRef = ref<HTMLDivElement | null>(null);
const chart = ref<echarts.ECharts | null>(null);

useResizeObserver(chartContainerRef, () => {
  chart.value?.resize();
});

onMounted(() => {
  chart.value = echarts.init(chartContainerRef.value);

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
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: {
      bottom: 0,
      textStyle: {
        color: colors["primary-color"],
        fontWeight: "400",
        fontSize: 16,
        fontFamily: "Figtree",
      },
    },
    xAxis: {
      data: props.xAxisData,
      axisLine: { lineStyle: { color: colors["primary-color"] } },
      axisLabel: {
        color: colors["primary-color"],
        formatter: (value: string) =>
          new Date(value).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }), // ⟶ 27/05/2025
      },
    },
    yAxis: {
      axisLine: { lineStyle: { color: colors["primary-color"] } },
      axisLabel: { color: colors["primary-color"] },
      splitLine: { lineStyle: { color: colors["primary-color-faded"] } },
    },
    series: [
      {
        name: "Avec offre",
        type: "bar",
        data: props.data1,
        itemStyle: { color: colors["accent-color"] },
      },
      {
        name: "Sans offre",
        type: "bar",
        stack: "total",
        data: props.data2,
        itemStyle: { color: colors["accent-color-faded"] },
      },
    ],
  });
});

onBeforeUnmount(() => {
  chart.value?.dispose();
});

watch(
  () => [props.xAxisData, props.data1, props.data2],
  () => {
    chart.value?.setOption({
      xAxis: { data: props.xAxisData },
      series: [{ data: props.data1 }, { data: props.data2 }],
    });
  },
  { immediate: true }
);
</script>
<template>
  <div
    ref="chartContainerRef"
    class="chart"
    :style="{ width: width, height: height }"
  ></div>
</template>
