<script setup lang="ts">
useHead({
  title: "Vente urgente de biens immobiliers",
  meta: [
    {
      name: "description",
      content:
        "Spécialiste de la vente urgente d'appartements et maisons, Martinimmo vous propose une offre d'achat instantanée et une transaction ultra rapide.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:title",
      content: "Vente urgente de biens immobiliers",
    },
    {
      property: "og:url",
      content:
        "https://opengraph.b-cdn.net/production/images/0d54207b-5b60-4086-9160-a5b7df6bf2c6.jpg?token=iHNWoqdZlZfJaFO_MRtDAX6VyogK9vW0tj-ShcS9QsQ&height=982&width=968&expires=33284606311",
    },
    {
      property: "og:image",
      content: "https://martinimmo.n/og-image.jpg",
    },
    {
      property: "og:description",
      content:
        "Spécialiste de la vente urgente d'appartements et maisons, Martinimmo vous propose une offre d'achat instantanée et une transaction ultra rapide.",
    },
  ],
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
          Vendez votre bien immobilier sans attendre
        </h1>
        <h2 class="headlines__text__subtitle">
          Offre instantanée, transaction la plus rapide du marché ⚡
        </h2>
      </div>
      <LocationForm />
      <UISteps />
    </Container>
  </div>
  <Container><WhySellToUs /></Container>
</template>
<style lang="scss" scoped>
.background {
  background-color: $secondary-color;
  width: 100vw;
  position: relative;
  z-index: 0;

  @media (min-width: $big-tablet-screen) {
    min-height: 100vh;
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
  }

  .blob {
    display: block;
    position: absolute;
    width: 40%;
    height: auto;
    object-fit: contain;

    &:nth-of-type(1) {
      top: -6%;
      left: -6%;
      transform: rotate(200deg);
    }
    &:nth-of-type(3) {
      top: 1rem;
      bottom: 0;
      right: -6%;
      margin: auto;
      transform: rotate(215deg);
    }

    @media (min-width: $big-tablet-screen) {
      &:nth-of-type(1) {
        top: -40%;
        left: -10%;
        transform: rotate(200deg);
      }
      &:nth-of-type(3) {
        top: initial;
        bottom: -40%;
        right: -5%;
        transform: rotate(220deg);
        margin: initial;
      }
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
  height: 100%;
  z-index: 2;
  padding: 2rem 1rem;

  @media (min-width: $big-tablet-screen) {
    position: absolute;
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
