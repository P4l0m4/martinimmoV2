<script setup lang="ts">
import { computed } from "vue";
import { useRuntimeConfig } from "#app";
import { useAddressStore } from "@/stores/addressStore";
import { isMobile } from "@/utils/otherFunctions";

const cfg = useRuntimeConfig();
const store = useAddressStore();
const address = ref(store.readFromLocalStorage());

const surface = ref(0);
const pieces = ref(0);
const typeLocal = ref("");
const travaux = ref(0);
const DPE = ref("");
const isAdressInDowntown = ref(false);
const equipments = ref<string[]>([]);

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

function dataFromEstimationForm(data: {
  surface: number;
  pieces: number;
  travaux: number;
  typeLocal: string;
  DPE: string;
  equipements: string[];
}) {
  surface.value = data.surface;
  pieces.value = data.pieces;
  typeLocal.value = data.typeLocal;
  travaux.value = data.travaux;
  DPE.value = data.DPE;
  equipments.value = data.equipements;
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
      <div class="estimation-en-ligne__map-container">
        <p
          v-if="address"
          class="estimation-en-ligne__map-container__address"
          @click="clearLocalStorageAndRefresh"
        >
          {{ address.formatted }}

          <IconComponent
            class="address__icon"
            v-if="address"
            icon="xx"
            size="1.5rem"
          />
        </p>

        <img
          class="map"
          v-if="address && mapSrc"
          :src="mapSrc"
          alt="Carte de l'adresse sélectionnée"
        />
        <LocationForm
          v-else
          @refresh="address = store.readFromLocalStorage()"
        />
      </div>

      <EstimationForm @submit="dataFromEstimationForm" />

      <DVFResults
        :postalCode
        :typeLocal
        :surface
        :pieces
        :travaux
        :DPE
        :equipments
        :isDownTown="isAdressInDowntown"
      />
    </div>
  </Container>
</template>
<style lang="scss" scoped>
.estimation-en-ligne {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 0;

  @media (min-width: $big-tablet-screen) {
    flex-direction: row;
    justify-content: space-between;
    padding: 4rem 0;
    gap: 4rem;
  }

  &__map-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    @media (min-width: $big-tablet-screen) {
      gap: 2rem;
    }

    &__address {
      font-size: 1rem;
      color: $primary-color;
      text-align: center;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;

      @media (min-width: $big-tablet-screen) {
        font-size: $subtitles;
        &:hover > .icon {
          display: block;
          justify-content: center;
        }

        &__icon {
          display: none;
        }
      }
    }
    .map {
      width: 100%;
      height: auto;
      max-width: 350px;
      max-height: 350px;
    }
  }
}
</style>
