<script setup lang="ts">
useHead({
  title: "Qui sommes-nous ? Martinimmo, vente rapide de biens immobiliers",
  meta: [
    {
      name: "description",
      content:
        "Spécialiste de la vente immobilièe accélérée, estimez votre bien en ligne et vendez nous votre appartement ou maison en un temps reccord.",
    },
  ],
});
</script>
<template>
  <section class="contact">
    <h1 class="titles">Qui Sommes Nous ?</h1>
    <p class="subtitles">
      Vous avez une question, une suggestion ou un problème ? N'hésitez pas à
      nous le faire savoir.
    </p>
    <div class="contact__info">
      <span class="contact__info__title">Téléphone</span>
      <NuxtLink to="tel:0695155301" class="contact__info__text"
        >06 95 15 53 01</NuxtLink
      >
    </div>
    <div class="contact__info">
      <span class="contact__info__title">Email</span>
      <NuxtLink to="mailto:0695155301" class="contact__info__text"
        >tekilawebfactory@gmail.com</NuxtLink
      >
    </div>
    <div class="contact__info">
      <span class="contact__info__title">Siège</span>
      <span class="contact__info__text"
        >508 rue Pichat, 73800 <br />
        Sainte-Hélène-du-Lac, Savoie</span
      >
    </div>
    <div class="contact__info">
      <span class="contact__info__title">Informations juridiques</span>
      <NuxtLink
        to="https://www.pappers.fr/entreprise/twf-tekila-web-factory-952496099"
        class="contact__info__link"
        >Voir sur pappers.fr</NuxtLink
      >
    </div>
  </section>
</template>
<style lang="scss" scoped>
.contact {
  display: flex;
  flex-direction: column;
  min-height: calc(100svh - 4rem);
  gap: 2rem;
  padding: 2rem 1rem;
  height: fit-content;
  color: $text-color-alt;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 2rem;
    justify-content: center;
    min-height: calc(100vh - 4rem);
    margin-top: 4rem;
  }

  @media (min-width: $laptop-screen) {
    padding: 4rem;
  }

  .subtitles {
    max-width: 600px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &__title {
      font-weight: $regular;
      color: $primary-color-faded;
      font-size: 1rem;
    }

    &__link {
      font-weight: $regular;
      color: $primary-color;
      text-decoration: underline;
      font-size: 1rem;
    }

    &__text {
      font-size: 1rem;
      color: $text-color-alt;
    }
  }
}
</style>
