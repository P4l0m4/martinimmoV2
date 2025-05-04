<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import { useAddressStore } from "@/stores/addressStore";

const store = useAddressStore();
const config = useRuntimeConfig();

const root = ref<HTMLElement | null>(null);

const emit = defineEmits(["refresh"]);

onMounted(async () => {
  const loader = new Loader({
    apiKey: config.public.MAPS_PLACES_API_KEY,
    version: "weekly",
    libraries: ["places"],
    language: "fr",
  });

  await loader.load();
  await customElements.whenDefined("gmp-place-autocomplete");

  const { PlaceAutocompleteElement } = await google.maps.importLibrary(
    "places"
  );

  if (!PlaceAutocompleteElement || !root.value) return;

  const pac = new PlaceAutocompleteElement({
    types: ["address"],
    includedRegionCodes: ["fr"],
  });

  root.value.appendChild(pac);

  (root.value as HTMLElement).addEventListener(
    "click",
    () => {
      pac.focus();
    },
    {
      passive: true,
    }
  );

  pac.addEventListener("gmp-select", async (ev: any) => {
    const prediction = ev.placePrediction;
    const place = await prediction.toPlace();

    await place.fetchFields({
      fields: ["formattedAddress", "addressComponents", "location"],
    });

    const payload = {
      formatted: place.formattedAddress,
      latLng: {
        lat: place.location?.lat(),
        lng: place.location?.lng(),
      },
      components: place.addressComponents?.toJSON?.(),
    };

    localStorage.setItem("address", JSON.stringify(payload));
    store.save(payload);
  });
});
</script>

<template>
  <form class="location-form">
    <div
      ref="root"
      class="location-form__input-field"
      data-placeholder="Adresse du bien"
    ></div>
    <NuxtLink
      to="/estimation-en-ligne-bien-immobilier"
      @click="emit('refresh')"
      class="button"
      ><PrimaryButton variant="accent-color"
        >Obtenir une offre</PrimaryButton
      ></NuxtLink
    >
  </form>
</template>

<style lang="scss" scoped>
.location-form {
  display: flex;
  background-color: $primary-color;
  border-radius: $radius;
  padding: 1rem 0.25rem 0.25rem 0.25rem;
  width: 100%;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;

  @media (min-width: $big-tablet-screen) {
    padding: 0.25rem;
    max-height: 68.4px;
    width: 500px;
    flex-direction: row;
    gap: 0;
  }

  &__input-field {
    width: 100%;
    max-width: 100%;
    padding: 0 0.75rem;
    position: relative;

    @media (min-width: $big-tablet-screen) {
      width: 300px;
      max-width: 300px;
    }

    @media (min-width: $desktop-screen) {
      width: 350px;
      max-width: 350px;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0rem;
      left: 0.75rem;
      z-index: 1000003; // forgive me, Google gives me no choice
      width: calc(100% - 1.5rem);
      height: 38px;
      pointer-events: none;
      border: $primary-color solid 6px;
    }
  }

  .button {
    width: 100%;
    max-width: 100%;

    @media (min-width: $big-tablet-screen) {
      width: fit-content;
    }
  }
}
</style>
