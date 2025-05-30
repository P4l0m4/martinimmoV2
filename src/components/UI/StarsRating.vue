<script setup lang="ts">
import { computed, ref } from "vue";
import { colors } from "@/utils/colors";

const emits = defineEmits<{
  (e: "rating", value: number): void;
}>();

const rating = ref(0);

const hoverValue = ref<number | null>(null);

const totalStars = 5;
const stars = computed(() =>
  Array.from({ length: totalStars }, (_, i) => i + 1)
);

function setRating(value: number) {
  rating.value = value;
  emits("rating", value);
}
</script>

<template>
  <div class="stars-rating" role="radiogroup" aria-label="Notation">
    <span
      v-for="star in stars"
      :key="star"
      class="stars-rating__star"
      role="radio"
      :aria-checked="star === rating"
      :aria-label="`Étoile ${star}`"
      tabindex="0"
      @click.prevent.stop="setRating(star)"
      @keydown.enter.prevent.stop="setRating(star)"
      @keydown.space.prevent.stop="setRating(star)"
      @mouseover="hoverValue = star"
      @mouseleave="hoverValue = null"
    >
      <IconComponent
        :icon="star <= (hoverValue ?? rating) ? 'star_four_fill' : 'star_four'"
        :color="
          star <= (hoverValue ?? rating)
            ? colors['gold-color']
            : colors['primary-color-faded']
        "
        size="2.25rem"
      />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.stars-rating {
  display: flex;

  &__star {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    cursor: pointer;
  }
}
</style>
