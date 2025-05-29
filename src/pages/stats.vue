<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getAllDataFromDB } from "@/utils/supabaseFunctions";

const data = ref<any[]>([]);

const addressesPerDayXAxisData = ref<string[]>([]);
const addressesPerDaySeriesCounts = ref<number[]>([]);

const localTypeData = ref<{ name: string; value: number }[]>([]);

const total = ref();
const formCompleted = ref();
const addressOnly = ref();
const CTAClicked = ref();

const trialsData = ref<{ name: string; value: number }[]>([]);

const offersXAxisData = ref<string[]>([]);
const offersPerDay = ref<number[]>([]);
const noOffersPerDay = ref<number[]>([]);

const averageOffer = ref();

const ageRepartitionData = ref<{ name: string; value: number }[]>([]);

onMounted(async () => {
  data.value = await getAllDataFromDB();
  console.log(data.value);
});

watch(
  data,
  () => {
    const map = new Map<string, number>();
    data.value.forEach((r) => {
      const day = (r.created_at as string).slice(0, 10);
      map.set(day, (map.get(day) ?? 0) + 1);
    });

    const sorted = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    addressesPerDayXAxisData.value = sorted.map(([d]) => d);
    const counts = sorted.map(([, n]) => n);

    addressesPerDaySeriesCounts.value = counts;
  },
  { immediate: true }
);

watch(
  data,
  () => {
    const counts = { Appartements: 0, Maisons: 0 };

    data.value.forEach((r) => {
      if (r.type_local === "Appartement") counts.Appartements++;
      else if (r.type_local === "Maison") counts.Maisons++;
    });

    localTypeData.value = Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  },
  { immediate: true }
);

watch(
  data,
  () => {
    total.value = data.value.length;
    formCompleted.value = data.value.filter((r) => r.DPE !== null).length;
    CTAClicked.value = data.value.filter(
      (r) => r.clicked_on_agent || r.clicked_on_visit
    ).length;
  },
  { immediate: true }
);

watch(
  data,
  () => {
    const singleTrial = data.value.filter(
      (r) => r.amount_of_trials === 1
    ).length;
    const multiTrial = data.value.filter((r) => r.amount_of_trials > 1).length;

    trialsData.value = [
      { name: "1 essai", value: singleTrial },
      { name: "Plusieurs essais", value: multiTrial },
    ];
  },
  { immediate: true }
);

watch(
  data,
  () => {
    const mapWith = new Map<string, number>(); // offer ≠ null
    const mapWithout = new Map<string, number>(); // offer == null

    data.value.forEach((r) => {
      const day = (r.created_at as string).slice(0, 10);
      if (r.offer !== null && r.offer !== undefined) {
        mapWith.set(day, (mapWith.get(day) ?? 0) + 1);
      } else {
        mapWithout.set(day, (mapWithout.get(day) ?? 0) + 1);
      }
    });

    /* union des dates puis tri */
    const allDays = Array.from(
      new Set([...mapWith.keys(), ...mapWithout.keys()])
    ).sort();

    offersXAxisData.value = allDays;
    offersPerDay.value = allDays.map((d) => mapWith.get(d) ?? 0);
    noOffersPerDay.value = allDays.map((d) => mapWithout.get(d) ?? 0);
  },
  { immediate: true }
);

watch(
  data,
  () => {
    averageOffer.value = Math.round(
      data.value.reduce((sum, r) => {
        if (r.offer !== null && r.offer !== undefined) {
          return sum + r.offer;
        }
        return sum;
      }, 0) / data.value.filter((r) => r.offer !== null).length
    );
  },
  { immediate: true }
);

watch(
  data,
  () => {
    const ageCounts = {
      Neuf: 0,
      "1 à 5 ans": 0,
      "5 à 10 ans": 0,
      "10 à 20 ans": 0,
      "Plus de 20 ans": 0,
    };

    data.value.forEach((r) => {
      if (r.local_age === "Neuf") ageCounts.Neuf++;
      else if (r.local_age === "1 à 5 ans") ageCounts["1 à 5 ans"]++;
      else if (r.local_age === "5 à 10 ans") ageCounts["5 à 10 ans"]++;
      else if (r.local_age === "10 à 20 ans") ageCounts["10 à 20 ans"]++;
      else if (r.local_age === "Plus de 20 ans") ageCounts["Plus de 20 ans"]++;
    });

    ageRepartitionData.value = Object.entries(ageCounts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
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
        title="Adresses / jour"
        :series-counts="addressesPerDaySeriesCounts"
        :x-axis-data="addressesPerDayXAxisData"
      />
    </UIFlexCard>
    <UIFlexCard>
      <UIFunnelChart
        title="Tunnel de conversion"
        :total
        :form-completed
        :address-only
        :CTAClicked
      />
    </UIFlexCard>
    <UIFlexCard>
      <UIDonutChart title="Types de biens" :data="localTypeData" />
    </UIFlexCard>
    <UIFlexCard>
      <UIDonutChart title="Essais" :data="trialsData" />
    </UIFlexCard>
    <UIFlexCard>
      <UIDoubleBarChart
        title="Offres VS Estimations / jour"
        :x-axis-data="offersXAxisData"
        :data-1="offersPerDay"
        :data-2="noOffersPerDay"
      />
    </UIFlexCard>
    <UIFlexCard
      ><UIGaugeChart title="Offre moyenne" :value="averageOffer"
    /></UIFlexCard>
    <UIFlexCard>
      <UIDonutChart title="Ancienneté" :data="ageRepartitionData" />
    </UIFlexCard>
  </GridContainer>
</template>
