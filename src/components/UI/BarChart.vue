<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { colors } from "@/utils/colors";

const props = withDefaults(
  defineProps<{
    title: string;
    tooltip?: object;
    xAxisData: string[];
    barSeries: object[];
    width?: string;
    height?: string;
  }>(),
  {
    width: "100%",
    height: "400px",
  }
);

const chartContainerRef = ref<HTMLDivElement | null>(null);
const myChart = ref<echarts.ECharts | null>(null);

useResizeObserver(chartContainerRef, () => {
  myChart.value?.resize();
});

onMounted(() => {
  myChart.value = echarts.init(chartContainerRef.value);

  myChart.value.setOption({
    title: {
      text: props.title,
      left: "center",
      textStyle: {
        color: colors["primary-color"],
        fontWeight: "600",
        fontSize: 24,
        fontFamily: "Figtree",
      },
    },
    tooltip: {},
    xAxis: {
      data: props.xAxisData,
      axisLine: { lineStyle: { color: colors["primary-color"] } },
      axisLabel: { color: colors["primary-color"] },
    },
    yAxis: {
      axisLine: { lineStyle: { color: colors["primary-color"] } },
      axisLabel: { color: colors["primary-color"] },
      splitLine: { lineStyle: { color: colors["primary-color-faded"] } },
    },
    series: props.barSeries,
  });
});

onBeforeUnmount(() => {
  myChart.value?.dispose();
});
</script>
<template>
  <div
    ref="chartContainerRef"
    class="chart"
    :style="{ width: width, height: height }"
  ></div>
</template>
