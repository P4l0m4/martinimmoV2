<script setup lang="ts">
const claims = [
  {
    title: "Pas de (mauvaises) surprises",
    details:
      "Nous garantissons les délais affichés sur la plateforme et vous fournissons un prix de vente final directement en ligne sur la base des informations saisies sur notre site. Le prix sera ajusté si nous constatons des différences lors de la visite.",
  },
  {
    title: "Vendez à votre convenance",
    details:
      "Nous mettons tout en oeuvre pour vous arranger. Vous décidez du moment de la visite, vous déposez les documents à votre rythme, et on signe dès que vous êtes prêt.",
  },
  {
    title: "Spécialiste des ventes urgentes",
    details:
      "Avec nous, pas de perte de temps avec les visites, les négociations de prix, le notaire et les annonces en ligne. Nous achetons votre bien en un temps reccords et simplifions le processus de vente au maximum.",
  },
  {
    title: "On se charge de tout",
    details:
      "Tout se fait en ligne ! Choisissez un créneau pour la visite, déposez le minimum de documents en ligne, et dès que le compromis de vente est prêt, vous signez et recevez votre argent en 10 jours.",
  },
];
</script>
<template>
  <section class="why-sell-to-us">
    <h2 class="titles">Pourquoi nous vendre votre appartement ou maison ?</h2>
    <div class="why-sell-to-us__grid">
      <div
        class="why-sell-to-us__grid__element"
        v-for="claim in claims"
        :key="claim.title"
      >
        <h3 class="subtitles">{{ claim.title }}</h3>
        <p class="paragraphs">{{ claim.details }}</p>
      </div>
    </div>
    <div class="why-sell-to-us__cta">
      <NuxtLink to="/estimation-en-ligne"
        ><PrimaryButton variant="accent-color"
          >Découvrir combien vaut votre bien</PrimaryButton
        ></NuxtLink
      >
      <span>En environ 30 secondes ⚡</span>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.why-sell-to-us {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  color: $text-color-alt;

  @media (min-width: $big-tablet-screen) {
    gap: 4rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: $big-tablet-screen) {
      grid-template-columns: 2fr 2fr;
    }

    &__element {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .subtitles {
        color: $accent-color;
      }
    }
  }

  &__cta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}
</style>
