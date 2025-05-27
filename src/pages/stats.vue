<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getAllDataFromDB } from "@/utils/supabaseFunctions";

const data = ref<any[]>([]);

const rows = ref<any[]>([]);
const xAxisData = ref<string[]>([]);
const barSeries = ref<object[]>([]);

onMounted(async () => {
  data.value = await getAllDataFromDB();
  rows.value = await getAllDataFromDB();
  console.log(data.value);
});

watch(
  rows,
  () => {
    const map = new Map<string, number>();
    rows.value.forEach((r) => {
      const day = (r.created_at as string).slice(0, 10);
      map.set(day, (map.get(day) ?? 0) + 1);
    });

    const sorted = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    xAxisData.value = sorted.map(([d]) => d);
    const counts = sorted.map(([, n]) => n);

    barSeries.value = [
      {
        name: "Adresses",
        type: "bar",
        data: counts,
        itemStyle: { color: colors["accent-color"] },
      },
    ];
  },
  { immediate: true }
);
</script>
<template>
  <GridContainer>
    <UIFlexCard>
      <UICounter title="Adresses récupérées" :count="data.length" />
    </UIFlexCard>
    <UIFlexCard>
      <UIBarChart
        title="Adresses récupérées par jour"
        :bar-series
        :x-axis-data
      /> </UIFlexCard
  ></GridContainer>
</template>
