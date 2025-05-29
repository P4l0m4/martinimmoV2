<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts/core";
import { GeoComponent } from "echarts/components";
import { ScatterChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { colors } from "@/utils/colors";
import { useResizeObserver, onClickOutside } from "@vueuse/core";

export interface Point {
  name: string;
  coords: [number, number];
}

const props = withDefaults(
  defineProps<{
    points: Point[]; // liste de { name, coords:[lng,lat] }
    width?: string;
    height?: string;
  }>(),
  {
    width: "100%",
    height: "400px",
  }
);

echarts.use([GeoComponent, ScatterChart, CanvasRenderer]);

const container = ref<HTMLDivElement | null>(null);
let chart: echarts.ECharts;

useResizeObserver(container, () => chart.resize());

onClickOutside(container, () => {
  chart?.dispatchAction({
    type: "restore",
  });
});

onMounted(async () => {
  const res = await fetch("/maps/france.geojson");
  const franceGeoJson = await res.json();
  echarts.registerMap("France", franceGeoJson);

  chart = echarts.init(container.value!);
  chart.setOption({
    title: {
      text: "Adresses collectées",
      left: "center",
      textStyle: {
        color: colors["primary-color"],
        fontWeight: "600",
        fontSize: 24,
        fontFamily: "Figtree",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: (p: any) => {
        if (p.seriesType === "scatter" && p.data) {
          return p.data.name;
        }

        return "";
      },
    },
    geo: {
      map: "France",
      roam: true,
      itemStyle: {
        areaColor: colors["accent-color-faded"],
        borderColor: colors["accent-color"],
      },
      emphasis: {
        itemStyle: { areaColor: colors["accent-color-faded"] },
      },
    },
    series: [
      {
        name: "Adresses",
        type: "scatter",
        coordinateSystem: "geo",
        data: props.points.map((p) => ({
          name: p.name,
          value: [...p.coords, 1], // [lng, lat, taille du symbole]
        })),
        symbolSize: 8,
        itemStyle: { color: colors["primary-color"] },
      },
    ],
  });
});

onBeforeUnmount(() => {
  chart?.dispose();
});

watch(
  () => [props.points],
  () => {
    chart?.setOption({
      series: [
        {
          name: "Adresses",
          type: "scatter",
          coordinateSystem: "geo",
          data: props.points.map((p) => ({
            name: p.name,
            value: [...p.coords, 1],
          })),
          symbolSize: 8,
          itemStyle: { color: colors["primary-color"] },
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
