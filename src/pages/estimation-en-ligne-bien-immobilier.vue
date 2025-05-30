<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAddressStore } from "@/stores/addressStore";
import {
  updateEstimationFormInfo,
  incrementAmountOfTrials,
} from "@/utils/supabaseFunctions";
import { isMobile } from "@/utils/otherFunctions";
import { colors } from "@/utils/colors";

const cfg = useRuntimeConfig();
const store = useAddressStore();
const address = ref();

const surface = ref();
const surfaceHabitable = ref();
const rooms = ref();
const typeLocal = ref();
const expectedRenovationDiscount = ref(0);
const DPE = ref();
const localAge = ref();
const isAdressInDowntown = ref(false);
const equipments = ref<string[]>([]);
const discalifications = ref<string[]>([]);
const groundFloor = ref(false);

const mapLoaded = ref(false);

const mapSrc = computed(() => {
  if (!address.value?.geometry.coordinates) return null;

  const [w, h] = (isMobile() ? "500x500" : "600x600").split("x");

  const color = "%23ff0000"; // rouge
  const marker =
    `lonlat:${address.value.geometry.coordinates[0]},${address.value.geometry.coordinates[1]}` +
    `;type:material` +
    `;size:large` +
    `;color:${color}` +
    `;icon:home`;

  return (
    "https://maps.geoapify.com/v1/staticmap" +
    `?style=osm-bright-smooth` +
    `&width=${w}&height=${h}` +
    `&center=lonlat:${address.value.geometry.coordinates[0]},${address.value.geometry.coordinates[1]}` +
    `&zoom=17` +
    `&marker=${marker}` +
    `&scaleFactor=2` +
    `&apiKey=${cfg.public.STATIC_MAPS_API_KEY}`
  );
});

async function findCityCenter() {
  const city = address.value?.properties?.city;
  if (!city) return null;

  const res = await fetch(
    `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
      city
    )}&fields=centre&format=json`
  );

  const data = await res.json();
  if (!data?.[0]?.centre) return null;

  const { coordinates } = data[0].centre;
  return { lng: coordinates[0], lat: coordinates[1] };
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
  mapLoaded.value = false;
}

const postalCode = computed(() => {
  if (!address.value) return null;

  const match = address.value.properties.label.match(/\b\d{5}\b/); // 5 chiffres consécutifs
  const postalCode = match ? match[0] : null;
  return postalCode;
});

const showDVFResults = ref(false);

const showForm = computed(() => {
  return !!(mapSrc.value && !showDVFResults.value);
});

async function dataFromEstimationForm(data: {
  surface?: number;
  surfaceHabitable?: number;
  rooms?: number;
  expectedRenovationDiscount: number;
  typeLocal?: string;
  DPE?: string;
  localAge?: string;
  equipments: string[];
  discalifications: string[];
  groundFloor: boolean;
}) {
  surface.value = data.surface;
  surfaceHabitable.value = data.surface;
  rooms.value = data.rooms;
  typeLocal.value = data.typeLocal;
  expectedRenovationDiscount.value = data.expectedRenovationDiscount;
  DPE.value = data.DPE;
  localAge.value = data.localAge;
  equipments.value = [...data.equipments];
  discalifications.value = [...(data.discalifications ?? [])];
  groundFloor.value = data.groundFloor;
  showDVFResults.value = true;

  await updateEstimationFormInfo(address.value, {
    surface_batie: data.surface,
    surface_habitable: data.surfaceHabitable,
    rooms: data.rooms,
    type_local: data.typeLocal,
    renovation_discount: data.expectedRenovationDiscount,
    DPE: data.DPE,
    local_age: data.localAge,
    equipments: data.equipments,
    discalifications: data.discalifications,
    ground_floor: data.groundFloor,
  });

  await incrementAmountOfTrials(address.value);
}

watch(address, async () => {
  if (address.value) {
    await checkDowntown();
  }
});

onMounted(() => {
  window.scrollTo(0, 0);

  address.value = store.readFromLocalStorage();
});

useHead({
  title: "Estimation en ligne de votre bien immobilier",
  meta: [
    {
      name: "description",
      content:
        "Vous souhaitez savoir combien vaut votre appartement ou maison ? En seulement 30s, découvrez combien vaut votre Bien Immo. Gratuit et Sans engagement.",
    },
  ],
});
</script>
<template>
  <Container>
    <div class="estimation-en-ligne">
      <div
        class="estimation-en-ligne__map-container"
        v-show="!showDVFResults && address"
      >
        <img class="map" v-if="mapSrc" :src="mapSrc" @load="mapLoaded = true" />

        <div class="map-loader" v-if="!mapLoaded">
          <UICircularLoader :color="colors['accent-color']" />
        </div>
        <p
          v-if="address"
          class="estimation-en-ligne__map-container__address"
          @click="clearLocalStorageAndRefresh"
          @keydown.enter="clearLocalStorageAndRefresh"
          @keydown.space="clearLocalStorageAndRefresh"
          tabindex="0"
          aria-label="Cliquez pour changer l'adresse"
          role="button"
        >
          {{ address.properties.label }}

          <IconComponent class="address__icon" icon="x_bold" size="1.15rem" />
        </p>
        <span
          v-if="isAdressInDowntown"
          class="estimation-en-ligne__map-container__centre-ville"
        >
          <IconComponent
            icon="map_pin_fill"
            size="1rem"
            :color="colors['primary-color']"
          />
          Votre bien est en centre ville
        </span>
        <span v-else class="estimation-en-ligne__map-container__centre-ville">
          <IconComponent
            icon="map_pin_fill"
            size="1rem"
            :color="colors['primary-color']"
          />
          Votre bien est à proximité du centre ville
        </span>
      </div>

      <div v-if="!address" class="estimation-en-ligne__wrapper">
        <h1 class="titles">Estimez votre bien en un clic</h1>
        <h2 class="subtitles">
          Entrez l'adresse de votre bien pour obtenir une offre instantanée ⚡
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
          :rooms="rooms"
          :expectedRenovationDiscount="expectedRenovationDiscount"
          :DPE="DPE"
          :localAge="localAge"
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
  justify-content: center;
  min-height: calc(100svh - 4rem);
  gap: 2rem;
  height: fit-content;

  @media (min-width: $big-tablet-screen) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 4rem;
    padding: 4rem 0;
    min-height: initial;
    height: calc(100vh - 4rem);
  }

  &__map-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: $accent-color-faded;
    border: 1px solid $accent-color-faded;
    border-radius: $radius;
    width: 100%;
    max-width: 550px;
    height: 420px;
    min-height: 0;
    position: relative;

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
      gap: 1.5rem;
      height: 100%;
      max-height: 700px;
    }

    &__address {
      font-size: 1rem;
      font-weight: $semi-bold;
      color: $text-color-alt;
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
      color: $text-color-alt;
      margin-top: -0.75rem;
      height: fit-content;
    }

    .map {
      width: 100%;
      flex: 1 1 auto;
      min-height: 0;
      object-fit: cover;
      object-position: center;
      border-radius: 1.5rem;
      z-index: 1;
    }

    .map-loader {
      position: absolute;
      left: 1rem;
      top: 1rem;
      right: 1rem;
      bottom: 4.31rem;
      margin: auto;

      @media (min-width: $big-tablet-screen) {
        left: 1.5rem;
        top: 1.5rem;
        right: 1.5rem;
        bottom: 5.31rem;
      }
    }
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    text-align: center;

    .subtitles {
      margin-top: -1rem;

      @media (min-width: $big-tablet-screen) {
        margin-top: -2rem;
      }
    }
  }
}
</style>
