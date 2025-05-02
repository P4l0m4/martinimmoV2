<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { formattedValue } from "@/utils/otherFunctions";

interface Props {
  postalCode?: string;
  year?: string;
  surface?: number;
  pieces?: number;
  limit?: number;
  typeLocal?: string;
  travaux?: number;
  DPE?: string;
  isDownTown?: boolean;
  equipments?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  year: "2024",
  limit: 40,
});

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

function buildUrl(year?: string) {
  const base =
    "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/" +
    "buildingref-france-demande-de-valeurs-foncieres-geolocalisee-millesime/records";

  const p = new URLSearchParams();
  p.set("limit", String(props.limit));

  if (props.postalCode) p.append("refine", `code_postal:"${props.postalCode}"`);
  if (year) p.append("refine", `date_mutation:"${year}"`); // ← ici
  if (props.surface) p.append("refine", `surface_reelle_bati:${props.surface}`);
  if (props.typeLocal) p.append("refine", `type_local:"${props.typeLocal}"`);
  if (props.pieces)
    p.append("refine", `nombre_pieces_principales:${props.pieces}`);

  return `${base}?${p.toString()}`;
}

const apiUrl = computed(() => buildUrl(props.year));

async function fetchData() {
  loading.value = true;
  error.value = null;
  records.value = [];
  try {
    const r1 = await fetch(apiUrl.value);
    if (!r1.ok) throw new Error(r1.statusText);
    const d1 = await r1.json();
    records.value = d1.results as DvfRecord[];
    if (records.value.length <= 20 && props.year) {
      const prevYear = String(Number(props.year) - 1);
      const r2 = await fetch(buildUrl(prevYear));
      if (r2.ok) {
        const d2 = await r2.json();
        records.value = records.value.concat(d2.results as DvfRecord[]);
      }
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
    props.travaux,
    props.DPE,
  ],
  fetchData,
  { immediate: true }
);

const averageValue = computed(() => {
  if (records.value.length === 0) return null;
  const total = records.value.reduce((acc, rec) => {
    if (rec.valeur_fonciere) acc += rec.valeur_fonciere;
    return acc;
  }, 0);
  return total / records.value.length;
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

const estimatedValue = computed(() => {
  if (!averageValue.value) return null;

  const marginPct = 15; // %
  const afterRenovation = averageValue.value - (props.travaux ?? 0);
  const afterDpe = afterRenovation * (1 + dpePct.value / 100); // +/- DPE
  const afterDownTown = afterDpe * (props.isDownTown ? 1.2 : 1); // +20 % si centre ville
  const afterMargin = afterDownTown * (1 - marginPct / 100);

  return Math.round(afterMargin);
});
</script>
<template>
  <section class="dvf-results">
    {{ props }}
    <span v-if="averageValue"
      >Valeur fonctière moyenne {{ formattedValue(averageValue) }}</span
    >
    <span v-if="estimatedValue">
      Estimation finale
      {{ formattedValue(estimatedValue) }}
    </span>
    <div v-if="loading" class="loading">Chargement…</div>
    <div v-else-if="error" class="error">Erreur : {{ error }}</div>
  </section>
</template>

<style scoped lang="scss">
.dvf-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.loading,
.error {
  padding: 1rem;
  text-align: center;
}
</style>
