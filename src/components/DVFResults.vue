<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { formattedValue } from "@/utils/otherFunctions";
import CircularLoader from "./UI/CircularLoader.vue";

interface Props {
  postalCode: string;
  year?: string;
  surface: number;
  pieces: number;
  limit?: number;
  typeLocal: string;
  expectedRenovationDiscount: number;
  DPE: string;
  isDownTown: boolean;
  equipments?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  year: "2024",
  limit: 60,
  expectedRenovationDiscount: 0,
});

const emit = defineEmits(["redoEstimate"]);

interface DvfRecord {
  id: string;
  date_mutation: string;
  adresse_numero: string;
  adresse_nom_voie: string;
  surface_reelle_bati: number | null;
  nombre_pieces_principales: number | null;
  valeur_fonciere: number | null;
}

const loading = ref(false);
const error = ref<string | null>(null);
const records = ref<DvfRecord[]>([]);

function buildUrl(year?: string, limit = props.limit) {
  const base =
    "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/" +
    "buildingref-france-demande-de-valeurs-foncieres-geolocalisee-millesime/records";

  const p = new URLSearchParams();
  p.set("limit", String(limit));

  if (props.postalCode) p.append("refine", `code_postal:"${props.postalCode}"`);
  if (year) p.append("refine", `date_mutation:"${year}"`);
  // if (props.surface) p.append("refine", `surface_reelle_bati:${props.surface}`);
  if (props.typeLocal) p.append("refine", `type_local:"${props.typeLocal}"`);
  if (props.pieces)
    p.append("refine", `nombre_pieces_principales:${props.pieces}`);

  return `${base}?${p.toString()}`;
}

// const apiUrl = computed(() => buildUrl(props.year));

const FIRST_YEAR = 2014;
async function fetchData() {
  loading.value = true;
  error.value = null;
  records.value = [];

  try {
    let year = Number(props.year);
    if (Number.isNaN(year)) year = new Date().getFullYear();

    while (records.value.length < props.limit && year >= FIRST_YEAR) {
      const remaining = props.limit - records.value.length;
      const res = await fetch(buildUrl(String(year), remaining));
      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      if (Array.isArray(data.results)) {
        records.value.push(...(data.results as DvfRecord[]));
      }

      year--;
    }
  } catch (e: any) {
    error.value = e.message ?? "Erreur inconnue";
  } finally {
    loading.value = false;
  }
}

watch(
  () => [
    props.postalCode,
    props.year,
    props.surface,
    props.pieces,
    props.limit,
    props.typeLocal,
  ],
  () => {
    fetchData();
  },
  { immediate: true }
);

const averageValue = computed(() => {
  if (records.value.length === 0) return null;

  const values = records.value
    .map((r) => Number(String(r.valeur_fonciere).replace(/\s+/g, "")))
    .filter((v) => Number.isFinite(v) && v > 0);

  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
});

const equipmentBonus: Record<
  string,
  { Appartement?: number; Maison?: number }
> = {
  terrasse: { Appartement: 4, Maison: 3 },
  balcon: { Appartement: 3 },
  jardin: { Maison: 6 },
  cave: { Appartement: 1, Maison: 1 },
  garage: { Appartement: 2, Maison: 4 },
  parking: { Appartement: 2, Maison: 4 },
  piscine: { Appartement: 5, Maison: 10 },
  ascenseur: { Appartement: 4 },
  interphone: { Appartement: 1 },
  alarme: { Maison: 1 },
  climatisation: { Appartement: 2, Maison: 2 },
  exposition: { Appartement: 2, Maison: 2 },
  tennis: { Appartement: 3, Maison: 6 },
};

const equipmentsFactor = computed(() => {
  if (!props.equipments?.length) return 1; // rien de coché → neutre

  // Somme des bonus applicables
  const totalPct = props.equipments.reduce((sum, key) => {
    const bonus =
      equipmentBonus[key]?.[props.typeLocal as "Appartement" | "Maison"];
    return bonus ? sum + bonus : sum;
  }, 0);

  return 1 + totalPct / 100; // facteur multiplicatif
});

const dpePct = computed(() => {
  switch (props.DPE) {
    case "A":
      return 4;
    case "B":
      return 2;
    case "C":
      return 1;
    case "D":
      return -1;
    case "E":
      return -2;
    case "F":
      return -4;
    case "G":
      return -10;
    default:
      return 0;
  }
});

const avgPricePerSqm = computed(() => {
  if (records.value.length === 0) return null;

  const pricePerSqmList = records.value
    .map((r) => {
      const price = Number(String(r.valeur_fonciere).replace(/\s+/g, ""));
      const sqm = Number(r.surface_reelle_bati);
      return sqm > 0 && Number.isFinite(price) ? price / sqm : null;
    })
    .filter((v): v is number => v !== null);

  if (pricePerSqmList.length === 0) return null;

  const total = pricePerSqmList.reduce((sum, v) => sum + v, 0);
  return total / pricePerSqmList.length; // €/m²
});

const marketValue = computed(() => {
  if (!avgPricePerSqm.value) return null;
  return avgPricePerSqm.value * props.surface; // € avant ajustements
});

const renovationFactor = computed(
  () => 1 - props.expectedRenovationDiscount / 100
);
const dpeFactor = computed(() => 1 + dpePct.value / 100);
const downtownFactor = computed(() => (props.isDownTown ? 1.2 : 1));
const marginFactor = computed(() => 1 - 15 / 100);

const estimatedValue = computed(() => {
  if (!marketValue.value) return null;

  return Math.round(
    marketValue.value *
      renovationFactor.value *
      dpeFactor.value *
      downtownFactor.value *
      equipmentsFactor.value *
      marginFactor.value
  );
});
</script>
<template>
  <section class="dvf-results">
    <span class="dvf-results__estimation" v-if="estimatedValue && !loading">
      {{ formattedValue(estimatedValue) }}
    </span>
    <CircularLoader v-if="loading" />
    <div v-else-if="error" class="error">Erreur : {{ error }}</div>
    <PrimaryButton variant="accent-color">Programmer une visite</PrimaryButton>
    <button class="dvf-results__button" @click="$emit('redoEstimate')">
      Refaire une estimation
    </button>

    <DropDown label="Détails">
      <div class="dvf-results__details">
        <span v-if="averageValue">
          Valeur fonctière moyenne {{ formattedValue(averageValue) }}</span
        >
        <span>
          Estimation basée sur {{ records.length }} transactions
          précédentes.</span
        >

        <span v-if="avgPricePerSqm">
          Prix d'achat max au mètre carré :
          {{ formattedValue(avgPricePerSqm) }} ({{
            formattedValue(avgPricePerSqm * surface)
          }})</span
        >
        <pre>{{ props }}</pre>
      </div>
    </DropDown>
  </section>
</template>

<style scoped lang="scss">
.dvf-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: $accent-color-faded;
  padding: 1rem;
  border-radius: $radius;
  max-width: 350px;
  width: 100%;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
  }

  &__estimation {
    display: flex;
    background-color: $accent-color-faded;
    padding: 1rem;
    border-radius: $radius;
    font-size: $titles;
    justify-content: center;

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
      font-weight: $semi-bold;
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  &__button {
    text-decoration: underline;
    font-size: $small-text;
    color: $text-color-alt;
  }
}

.error {
  background-color: $error-color;
  color: $text-color-alt;
  padding: 1rem;
  text-align: center;
}
</style>
