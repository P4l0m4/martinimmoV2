<script lang="ts" setup>
import { computed } from "vue";
import { isDesktop } from "@/utils/otherFunctions";

const isDesktopScreen = computed(() => {
  return isDesktop();
});
</script>
<template>
  <div class="background">
    <Transition>
      <img src="@/assets/images/blob.webp" alt="blob" class="blob"
    /></Transition>
    <img src="@/assets/images/building.svg" alt="blob" class="building" />
    <Transition
      ><img src="@/assets/images/blob2.webp" alt="blob" class="blob"
    /></Transition>

    <Container class="headlines">
      <NuxtLink class="headlines__logo" to="/">
        <img
          class="headlines__logo__image"
          src="@/assets/images/immo-logo.svg"
          alt="logo"
        />
        <span class="headlines__logo__company">Martinimmo</span>
      </NuxtLink>

      <div class="headlines__text">
        <h1 class="headlines__text__title">
          Vendez votre bien immobillier sans attendre
        </h1>
        <h2 class="headlines__text__subtitle">
          Offre instantanée, transaction la plus rapide du marché ⚡
        </h2>
      </div>
      <LocationForm />
      <UISteps v-if="isDesktopScreen" />
    </Container>
  </div>
  <Container class="steps-wrapper" v-if="!isDesktopScreen">
    <UISteps />
  </Container>
</template>
<style lang="scss" scoped>
.background {
  background-color: $secondary-color;
  width: 100vw;
  min-height: 100vh;
  position: relative;
  z-index: 0;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(
      180deg,
      $secondary-color,
      transparent 30%
    );
    z-index: 1;
    width: 100%;
    height: 100px;
  }

  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(transparent 50%, $secondary-color);
    z-index: 1;
    width: 100%;
    height: 300px;
  }

  .blob {
    position: absolute;
    width: 40%;
    height: auto;
    object-fit: contain;

    &:nth-of-type(1) {
      top: -35%;
      left: -10%;
      transform: rotate(200deg);
    }
    &:nth-of-type(3) {
      bottom: -40%;
      right: -5%;
      transform: rotate(215deg);
    }
  }

  .building {
    display: none;

    @media (min-width: $big-tablet-screen) {
      display: block;
      position: absolute;
      bottom: -10%;
      left: 0;
      right: 0;
      margin: auto;
      width: 25%;
      height: 35%;
      opacity: 0.3;
      z-index: 1;
    }
  }
}

.headlines {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  position: absolute;
  height: 100%;
  z-index: 2;
  padding: 2rem 1rem;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 1rem;
    justify-content: space-between;
    gap: 1rem;
  }

  &__logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    &__image {
      width: 35px;
      height: auto;
    }

    &__company {
      color: $text-color-alt;
      font-size: 1.625rem;
    }
  }
  &__text {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__title {
      color: $text-color-alt;
      text-align: center;
      text-wrap: balance;
      font-size: 2.625rem;
      font-weight: $semi-bold;
    }

    &__subtitle {
      color: $text-color-alt;
      text-align: center;
      text-wrap: balance;
      font-size: 1.5rem;
      font-weight: $semi-bold;
    }
  }

  &__button {
    margin-top: 2rem;
    width: 100%;
    max-width: 375px;
  }
}

.small-text {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: $text-color-alt;
  font-size: $small-text;
  white-space: nowrap;
  text-align: center;
}

.steps-wrapper {
  background-color: $secondary-color;
}
</style>
