<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useAddressStore } from "@/stores/addressStore";
import { formattedValue } from "@/utils/otherFunctions";
import {
  updateOffer,
  updateEstimate,
  updateClickedOnVisit,
  updateClickedOnAgent,
  updateRating,
} from "@/utils/supabaseFunctions";
import { colors } from "@/utils/colors";

interface Props {
  postalCode: string;
  year?: string;
  surface: number;
  surfaceHabitable: number;
  rooms: number;
  limit?: number;
  typeLocal: string;
  expectedRenovationDiscount: number;
  DPE: string;
  localAge: string;
  isDownTown: boolean;
  equipments?: string[];
  discalifications: string[];
  groundFloor: boolean;
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

const store = useAddressStore();
const address = store.readFromLocalStorage();

const clickedOnVisit = ref(false);
const clickedOnAgent = ref(false);

const isPopUpOpen = ref(false);
const shareButtonLabel = ref("Partager l'outil");

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
  if (props.rooms)
    p.append("refine", `nombre_pieces_principales:${props.rooms}`);

  return `${base}?${p.toString()}`;
}

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

function triggerPopUp(type: "visit" | "agent") {
  if (type === "visit") {
    clickedOnVisit.value = true;
    updateClickedOnVisit(address, true);
  } else if (type === "agent") {
    clickedOnAgent.value = true;
    updateClickedOnAgent(address, true);
  }
  isPopUpOpen.value = true;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    shareButtonLabel.value = "Lien copié dans le presse-papiers :)";

    setTimeout(() => {
      shareButtonLabel.value = "Partager l'outil";
    }, 2000);
  });
}

function sendRatingToDB(rating: number) {
  updateRating(address, rating);
}

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

const groundFloorFactor = computed(() => {
  if (!props.groundFloor) return 1; // pas de décote
  if (props.typeLocal === "Appartement") return 0.92; // -8%
  return 1; // Maison = pas de décote appliquée
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
  return avgPricePerSqm.value * props.surface;
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
      groundFloorFactor.value
  );
});

const offeredValue = computed(() => {
  if (!estimatedValue.value) return null;
  return Math.round(estimatedValue.value * marginFactor.value);
});

const discalified = computed(() => {
  if (!offeredValue.value) return null;

  return (
    props.DPE === "F" ||
    props.DPE === "G" ||
    props.expectedRenovationDiscount === 20 ||
    props.discalifications.length > 0 ||
    offeredValue.value > 400000
  );
});

watch(
  () => [
    props.postalCode,
    props.year,
    props.surface,
    props.surfaceHabitable,
    props.rooms,
    props.limit,
    props.typeLocal,
    props.discalifications,
    props.groundFloor,
  ],
  () => {
    fetchData();
  },
  { immediate: true }
);

watch(
  estimatedValue,
  (val) => {
    if (val == null) return;

    updateEstimate(address, val);
  },
  { immediate: false }
);

watch(
  offeredValue,
  (val) => {
    if (val == null) return;

    updateOffer(address, val);
  },
  { immediate: false }
);
</script>
<template>
  <section class="dvf-results">
    <template v-if="!discalified">
      <h1 class="titles">Félicitations !</h1>
      <h2 class="subtitles">
        Votre {{ typeLocal.toLowerCase() }} nous a tapé dans l’oeil 👀
      </h2>
      <div class="dvf-results__offer">
        <div class="dvf-results__offer__wrapper">
          <span class="dvf-results__offer__wrapper__title"
            >Notre proposition</span
          >
          <span
            class="dvf-results__offer__wrapper__amount"
            v-if="offeredValue && !loading"
          >
            <IconComponent
              icon="star_four_fill"
              :color="colors['primary-color']"
              size="2rem"
            />{{ formattedValue(offeredValue) }}
            <IconComponent
              icon="star_four_fill"
              :color="colors['primary-color']"
              size="2rem"
            />
          </span>
          <PrimaryButton
            variant="accent-color"
            icon="calendar_dots_fill"
            @click="triggerPopUp('visit')"
            @keydown.enter="triggerPopUp('visit')"
            @keydown.space="triggerPopUp('visit')"
            >Programmer une visite</PrimaryButton
          >
          <button
            class="dvf-results__offer__wrapper__button"
            @click="$emit('redoEstimate')"
            @keydown.enter="$emit('redoEstimate')"
            @keydown.space="$emit('redoEstimate')"
          >
            Refaire une estimation
          </button>
          <DropDown label="Détails">
            <div class="dvf-results__offer__wrapper__details">
              <span v-if="averageValue">
                Valeur fonctière moyenne dans ce secteur:
                {{ formattedValue(averageValue) }}.</span
              >
              <span>
                Estimation basée sur {{ records.length }} transactions
                précédentes dans ce secteur.</span
              >
            </div>
          </DropDown>
          <UIPopUp
            v-if="isPopUpOpen"
            @close="isPopUpOpen = false"
            title=" Merci !"
            subtitle="MartinImmo est encore en développement. Plus vous êtes nombreux à l'utiliser, plus nous augmentons nos chances de voir le jour!"
          >
            <UIStarsRating @rating="sendRatingToDB" />
            <PrimaryButton
              icon="copy"
              @click.prevent.stop="
                copyToClipboard('https://martinimmov2.netlify.app/')
              "
              @keydown.enter.prevent.stop="
                copyToClipboard('https://martinimmov2.netlify.app/')
              "
              @keydown.space.prevent.stop="
                copyToClipboard('https://martinimmov2.netlify.app/')
              "
            >
              {{ shareButtonLabel }}
            </PrimaryButton>
          </UIPopUp>
        </div>
        <UIStepsVertical /></div
    ></template>
    <div class="dvf-results__estimate" v-else>
      <div class="dvf-results__estimate__wrapper">
        <span class="dvf-results__estimate__wrapper__title"
          >Résultat de l'estimation</span
        >
        <span
          class="dvf-results__estimate__wrapper__amount"
          v-if="estimatedValue && !loading"
        >
          <IconComponent
            icon="star_four_fill"
            :color="colors['primary-color']"
            size="2rem"
          />{{ formattedValue(estimatedValue) }}
          <IconComponent
            icon="star_four_fill"
            :color="colors['primary-color']"
            size="2rem"
          />
        </span>
        <button
          class="dvf-results__estimate__wrapper__button"
          @click="$emit('redoEstimate')"
          @keydown.enter="$emit('redoEstimate')"
          @keydown.space="$emit('redoEstimate')"
        >
          Refaire une estimation
        </button>
        <DropDown label="Détails">
          <div class="dvf-results__estimate__wrapper__details">
            <span v-if="averageValue">
              Valeur fonctière moyenne dans ce secteur:
              {{ formattedValue(averageValue) }}.</span
            >
            <span>
              Estimation basée sur {{ records.length }} transactions précédentes
              dans ce secteur.</span
            >
          </div>
        </DropDown>
      </div>
      <div class="dvf-results__estimate__external-contact">
        <span class="dvf-results__estimate__external-contact__title"
          >Nous ne pouvons pas vous faire une offre pour ce bien</span
        >
        <p class="dvf-results__estimate__external-contact__subtitle">
          Mais nous pouvons confier votre projet à l’un de nos agents
          immobiliers partenaires
        </p>
        <PrimaryButton
          variant="accent-color"
          icon="phone_fill"
          @click="triggerPopUp('agent')"
          @keydown.enter="triggerPopUp('agent')"
          @keydown.space="triggerPopUp('agent')"
          >Être recontacté par un agent</PrimaryButton
        >
        <NuxtLink
          to="/faq"
          class="dvf-results__estimate__external-contact__button"
        >
          Politique d'achat
        </NuxtLink>
      </div>
    </div>

    <UICircularLoader v-if="loading" />
    <div v-else-if="error" class="error">Erreur : {{ error }}</div>
  </section>
</template>

<style scoped lang="scss">
.dvf-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
  width: 100%;

  @media (min-width: $big-tablet-screen) {
    width: fit-content;
  }

  &__estimate {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    @media (min-width: $big-tablet-screen) {
      width: fit-content;
      flex-direction: row;
    }

    @media (min-width: $big-tablet-screen) {
      gap: 4rem;
    }

    &__wrapper {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      justify-content: center;
      align-items: center;

      @media (min-width: $big-tablet-screen) {
        min-width: 450px;
        max-width: 450px;
      }

      &__title {
        font-size: $subtitles;
        font-weight: $medium;
      }

      &__amount {
        display: flex;
        font-size: $titles;
        justify-content: center;
        align-items: center;
        gap: 1.33rem;

        @media (min-width: $big-tablet-screen) {
          font-weight: $semi-bold;
        }
      }

      &__button {
        text-decoration: underline;
        font-size: $small-text;
        color: $text-color-alt;
        margin-top: -1.5rem;
      }

      &__details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        margin-top: -2rem;
        text-align: left;
      }
    }

    &__external-contact {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      padding: 1.5rem;
      background-color: $accent-color-faded;
      border-radius: $radius;
      align-items: center;
      max-width: 550px;

      &__title {
        font-size: $subtitles;
        font-weight: $medium;
        text-align: center;
      }

      &__subtitle {
        font-size: 1rem;
        color: $text-color-alt;
        text-align: center;
      }

      &__button {
        text-decoration: underline;
        font-size: $small-text;
        color: $text-color-alt;
        margin-top: -1.5rem;
      }
    }

    &__button {
      text-decoration: underline;
      font-size: $small-text;
      color: $text-color-alt;
    }
  }

  &__offer {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    @media (min-width: $tablet-screen) {
      width: fit-content;
      flex-direction: row;
      align-items: center;
    }

    @media (min-width: $big-tablet-screen) {
      gap: 4rem;
    }

    &__wrapper {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      justify-content: center;
      align-items: center;
      height: fit-content;
      padding: 1rem;
      background-color: $accent-color-faded;
      border-radius: $radius;

      @media (min-width: $big-tablet-screen) {
        padding: 1.5rem;
        min-width: 450px;
        max-width: 450px;
      }

      &__title {
        font-size: $subtitles;
        font-weight: $medium;
      }

      &__amount {
        display: flex;
        font-size: $titles;
        justify-content: center;
        align-items: center;
        gap: 1.33rem;

        @media (min-width: $big-tablet-screen) {
          font-weight: $semi-bold;
        }
      }

      &__button {
        text-decoration: underline;
        font-size: $small-text;
        color: $text-color-alt;
        margin-top: -1.5rem;
      }

      &__details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        margin-top: -2rem;
        text-align: left;
      }
    }
  }
}

.error {
  background-color: $error-color;
  color: $text-color-alt;
  padding: 1rem;
  text-align: center;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
    width: fit-content;
    flex-direction: row;
  }
}

.subtitles {
  margin-top: -2rem;
}
</style>
