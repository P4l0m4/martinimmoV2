<script setup lang="ts">
import { ref, watch } from "vue";
import { colors } from "@/utils/colors";
import { onClickOutside } from "@vueuse/core";
import { useTemplateRef } from "vue";
import { isMobile } from "@/utils/otherFunctions";
import { useAddressStore } from "@/stores/addressStore";

const store = useAddressStore();
const emit = defineEmits(["refresh"]);

const target = useTemplateRef<HTMLElement>("target");

const query = ref("");
const suggestions = ref<any[]>([]);
const isOpen = ref(false);
const loading = ref(false);

let timer: any;
watch(query, (q) => {
  clearTimeout(timer);
  if (!q) return (suggestions.value = []), (isOpen.value = false);
  timer = setTimeout(fetchSuggestions, 500);
});

async function fetchSuggestions() {
  loading.value = true;
  const res = await fetch(
    `https://api-adresse.data.gouv.fr/search?q=${encodeURIComponent(
      query.value
    )}&limit=3`
  );
  const data = await res.json();

  suggestions.value = (data.features ?? []).filter(
    (f: any) => f.properties.label !== query.value
  );
  if (isMobile()) suggestions.value.reverse();

  loading.value = false;
  isOpen.value = !!suggestions.value.length;
}

function select(feature: any) {
  query.value = feature.properties.label;
  suggestions.value = [];

  const payload = {
    formatted: feature.properties.label,
    latLng: {
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
    },
    components: feature.properties,
  };
  localStorage.setItem("address", JSON.stringify(payload));
  store.save(payload);
  isOpen.value = false;
}

onClickOutside(target, () => (isOpen.value = false), {});
</script>

<template>
  <form
    ref="target"
    class="location-form"
    @submit.prevent
    :class="{ open: isOpen }"
  >
    <div class="location-form__input-field">
      <input
        class="location-form__input-field__input"
        type="text"
        placeholder="10 rue de la tranquillité, 75140, Paris..."
        v-model="query"
        @focus="isOpen = !!suggestions.length"
      />
    </div>

    <NuxtLink
      to="/estimation-en-ligne-bien-immobilier"
      @click="emit('refresh')"
      class="button"
    >
      <PrimaryButton variant="accent-color">Obtenir une offre</PrimaryButton>
    </NuxtLink>
    <Transition>
      <ul v-if="isOpen" class="autocomplete">
        <Transition
          ><UICircularLoader
            v-if="loading"
            :color="colors['secondary-color-faded']"
        /></Transition>
        <li
          class="autocomplete__suggestion"
          v-for="suggestion in suggestions"
          :key="suggestion.properties.id"
        >
          <button @click="select(suggestion)">
            {{ suggestion.properties.label }}
          </button>
        </li>
      </ul></Transition
    >
  </form>
</template>

<style lang="scss" scoped>
.location-form {
  display: flex;
  background-color: $base-color;
  border-radius: $radius;
  padding: 0.25rem;
  width: 100%;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  position: relative;
  transition: border-radius 0.2s linear;

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

    @media (min-width: $big-tablet-screen) {
      width: 300px;
      max-width: 300px;
    }

    @media (min-width: $desktop-screen) {
      width: 350px;
      max-width: 350px;
    }

    &__input {
      display: inline-block;
      text-overflow: ellipsis;
      height: 100%;
      width: 100%;
      color: $text-color;
      font-family: "Figtree", sans-serif;
      font-size: 1rem;
      padding: 1rem;
      caret-color: $text-color;
      border: 2px solid $base-color;

      &::placeholder {
        color: $text-color-faded;
      }
    }
  }

  .button {
    width: 100%;
    max-width: 100%;

    @media (min-width: $big-tablet-screen) {
      width: fit-content;
    }
  }

  .autocomplete {
    display: flex;
    flex-direction: column;
    color: $text-color;
    width: 100%;
    height: fit-content;
    bottom: 7.7rem;
    left: 0;
    list-style: none;
    background-color: $base-color;
    border-radius: $radius $radius 0 0;
    position: absolute;
    overflow: hidden;

    @media (min-width: $big-tablet-screen) {
      flex-direction: column;
      top: 3.9rem;
      border-radius: 0 0 $radius $radius;
    }

    &__suggestion {
      padding: 1rem;
      height: fit-content;
      transition: background-color 0.2s linear;

      & button {
        color: $text-color;
        width: 100%;
        height: 100%;
        text-align: left;
      }

      &:hover {
        background-color: $accent-color-faded;
        cursor: pointer;
      }
    }
  }

  &.open {
    border-radius: 0 0 $radius $radius;

    @media (min-width: $big-tablet-screen) {
      border-radius: $radius $radius 0 0;
    }
  }
}
</style>
