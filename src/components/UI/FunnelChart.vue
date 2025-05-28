<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
import { useResizeObserver } from "@vueuse/core";
import { colors } from "@/utils/colors";

const props = withDefaults(
  defineProps<{
    title: string;
    total: number;
    formCompleted: number;
    CTAClicked: number;
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
      textStyle: {
        color: colors["primary-color"],
        fontWeight: "600",
        fontSize: 24,
        fontFamily: "Figtree",
      },
    },

    tooltip: { formatter: "{b}<br/>{c} ({d} %)" },

    series: [
      {
        type: "funnel",
        left: "10%",
        width: "80%",
        minSize: 30,
        maxSize: "100%",
        sort: "descending",
        gap: 4,
        label: {
          show: true,
          position: "inside",
          formatter: "{b}\n{c} ({d}%)",
        },
        itemStyle: { borderColor: colors["accent-color"], borderWidth: 2 },
        data: [
          {
            name: "Total",
            value: props.total,
            itemStyle: { color: colors["accent-color-faded"] },
          },
          {
            name: "Formulaire complet ",
            value: props.formCompleted,
            itemStyle: { color: colors["accent-color"] },
          },
          {
            name: "Clic sur CTA",
            value: props.CTAClicked,
            itemStyle: { color: colors["primary-color"] },
          },
        ],
      },
    ],
  });
});

onBeforeUnmount(() => chart.value?.dispose());

watch(
  () => [props.total, props.formCompleted, props.CTAClicked],
  () => {
    chart.value?.setOption({
      series: [
        {
          data: [
            {
              name: "Total",
              value: props.total,
              itemStyle: { color: colors["accent-color-faded"] },
            },
            {
              name: "Formulaire complet ",
              value: props.formCompleted,
              itemStyle: { color: colors["accent-color"] },
            },
            {
              name: "Clic sur CTA",
              value: props.CTAClicked,
              itemStyle: { color: colors["primary-color"] },
            },
          ],
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
