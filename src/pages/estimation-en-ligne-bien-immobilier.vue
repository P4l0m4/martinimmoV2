<script setup lang="ts">
import { computed } from "vue";
import { useRuntimeConfig } from "#app";
import { useAddressStore } from "@/stores/addressStore";
import { isMobile } from "@/utils/otherFunctions";
import { colors } from "@/utils/colors";

const cfg = useRuntimeConfig();
const store = useAddressStore();
const address = ref(store.readFromLocalStorage());

const surface = ref();
const surfaceHabitable = ref();
const pieces = ref();
const typeLocal = ref();
const expectedRenovationDiscount = ref(0);
const DPE = ref();
const isAdressInDowntown = ref(false);
const equipments = ref<string[]>([]);
const discalifications = ref<string[]>([]);
const groundFloor = ref(false);

const mapSrc = computed(() => {
  if (!address.value?.latLng) return null;
  const { lat, lng } = address.value.latLng;
  const size = isMobile() ? "400x400" : "700x700";
  return (
    "https://maps.googleapis.com/maps/api/staticmap" +
    `?key=${cfg.public.MAPS_PLACES_API_KEY}` +
    `&center=${lat},${lng}` +
    "&zoom=18" +
    `&size=${size}&scale=2` +
    `&markers=color:red|${lat},${lng}`
  );
});

async function findCityCenter(): Promise<{ lat: number; lng: number } | null> {
  if (!address.value) return null;

  const matchCity = address.value.formatted.match(/\b\d{5}\s+([^,]+)/);
  const cityName = matchCity ? matchCity[1].trim() : "";

  if (!cityName) return null;

  const url =
    "https://maps.googleapis.com/maps/api/geocode/json" +
    `?address=${encodeURIComponent(cityName + ", France")}` +
    `&key=${cfg.public.MAPS_PLACES_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();

  const loc = data.results?.[0]?.geometry?.location;

  return loc ? { lat: loc.lat, lng: loc.lng } : null;
}

async function checkDowntown() {
  if (!address.value?.latLng) {
    isAdressInDowntown.value = false;
    return;
  }
  const center = await findCityCenter();
  if (!center) {
    isAdressInDowntown.value = false;
    return;
  }

  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(center.lat - address.value.latLng.lat!);
  const dLng = toRad(center.lng - address.value.latLng.lng!);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(address.value.latLng.lat!)) *
      Math.cos(toRad(center.lat)) *
      Math.sin(dLng / 2) ** 2;
  const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // en mètres

  isAdressInDowntown.value = distance <= 1500; // centre-ville si ≤ 1,5 km
}

function clearLocalStorageAndRefresh() {
  store.clearLocalStorage();
  address.value = store.readFromLocalStorage();
}

const postalCode = computed(() => {
  if (!address.value) return null;

  const match = address.value.formatted.match(/\b\d{5}\b/); // 5 chiffres consécutifs
  const postalCode = match ? match[0] : null;
  return postalCode;
});

const showDVFResults = ref(false);

const showForm = computed(() => {
  return !!(mapSrc.value && !showDVFResults.value);
});

function dataFromEstimationForm(data: {
  surface: number;
  surfaceHabitable: number;
  pieces: number;
  expectedRenovationDiscount: number;
  typeLocal: string;
  DPE: string;
  equipments: string[];
  discalifications: string[];
  groundFloor: boolean;
}) {
  surface.value = data.surface;
  surfaceHabitable.value = data.surface;
  pieces.value = data.pieces;
  typeLocal.value = data.typeLocal;
  expectedRenovationDiscount.value = data.expectedRenovationDiscount;
  DPE.value = data.DPE;
  equipments.value = [...data.equipments];
  discalifications.value = [...data.discalifications];
  groundFloor.value = data.groundFloor;
  showDVFResults.value = true;
}

watch(address, async () => {
  if (address.value) {
    await checkDowntown();
  }
});
</script>
<template>
  <Container>
    <div class="estimation-en-ligne">
      <div
        class="estimation-en-ligne__map-container"
        v-show="!showDVFResults && address"
      >
        <img
          class="map"
          v-if="mapSrc"
          :src="mapSrc"
          alt="Carte de l'adresse sélectionnée"
        />
        <p
          v-if="address"
          class="estimation-en-ligne__map-container__address"
          @click="clearLocalStorageAndRefresh"
        >
          {{ address.formatted }}

          <IconComponent class="address__icon" icon="x_bold" size="1.15rem" />
        </p>
        <span
          v-if="isAdressInDowntown"
          class="estimation-en-ligne__map-container__centre-ville"
        >
          <IconComponent
            icon="map_pin_fill"
            size="1rem"
            :color="colors['text-color']"
          />
          Votre bien est en centre ville
        </span>
      </div>

      <div v-if="!address" class="estimation-en-ligne__wrapper">
        <h1 class="titles">Estimez votre bien en un clic</h1>
        <h2 class="subtitles">
          Entrez l'adresse de votre bien pour obtenir une offre instantanée
        </h2>
        <Transition
          ><LocationForm
            @refresh="
              (address = store.readFromLocalStorage()), (showDVFResults = false)
            "
        /></Transition>
      </div>

      <Transition
        ><EstimationForm v-if="showForm" @submit="dataFromEstimationForm"
      /></Transition>
      <Transition
        ><DVFResults
          v-if="showDVFResults"
          :postalCode="postalCode"
          :typeLocal="typeLocal"
          :surface="surface"
          :surfaceHabitable="surfaceHabitable"
          :pieces="pieces"
          :expectedRenovationDiscount="expectedRenovationDiscount"
          :DPE="DPE"
          :equipments="equipments"
          :isDownTown="isAdressInDowntown"
          :discalifications="discalifications"
          :groundFloor="groundFloor"
          @redoEstimate="showDVFResults = false"
      /></Transition>
    </div>
  </Container>
</template>
<style lang="scss" scoped>
.estimation-en-ligne {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  height: fit-content;

  @media (min-width: $big-tablet-screen) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 4rem;
    height: calc(100vh - 4rem);
  }

  &__map-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background-color: $base-color;
    border-radius: $radius;
    width: 100%;
    max-width: 550px;

    @media (min-width: $big-tablet-screen) {
      gap: 1.5rem;
      height: 100%;
      max-height: 500px;
    }

    &__address {
      font-size: 1rem;
      font-weight: $semi-bold;
      color: $text-color;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      height: fit-content;
      width: fit-content;
      max-width: 100%;

      @media (min-width: $big-tablet-screen) {
        &:hover > .icon {
          display: block;
          justify-content: center;
        }

        &__icon {
          display: none;
        }
      }
    }

    &__centre-ville {
      display: flex;
      align-items: center;
      font-size: 1rem;
      gap: 0.5rem;
      color: $text-color;
      margin-top: -0.75rem;
    }

    .map {
      width: 100%;
      height: 100%;
      max-height: 400px;
      object-fit: cover;
      object-position: center;
      border-radius: 1.5rem;
    }
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;

    .subtitles {
      margin-top: -2rem;
    }
  }
}
</style>
