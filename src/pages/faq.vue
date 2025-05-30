<script setup lang="ts">
import { ref } from "vue";

const searchQuery = ref("");

const questions = [
  {
    title: "Comment fonctionne le simulateur ?",
    answer:
      "Nous nous basons sur les données DVF (Demandes de Valeurs Foncières) pour estimer la valeur des biens immobiliers. Le simulateur fait ensuite une estimation basée sur les transactions récentes dans la région. Il applique une décote ou une surcote en fonction de l'état du bien, de sa localisation et d'autres facteurs.",
  },
  {
    title: "Le simulateur est-il fiable ?",
    answer:
      "Oui, le simulateur utilise des données officielles régulièrement actualisées et prend en compte un maximum de critères pour fournir une estimation la plus précise possible.",
  },
  {
    title: "L'offre obtenue est-elle définitive ?",
    answer:
      "Aucune offre n'est définitive tant que le bien n'a pas été visité par un professionnel. L'estimation est indicative et peut varier en fonction de l'état et la situation réels du bien.",
  },
  {
    title: "A quoi sert Martinimmo ?",
    answer:
      "Nous avons conçu Martinimmo pour simplifier la vente de biens immobiliers. C'est une solution digitale qui fluidifie au maximum le processus de vente pour que vous récupériez votre argent ultra rapidement.",
  },

  {
    title: "Quels types de biens puis-je estimer ?",
    answer:
      "Vous pouvez estimer tout type d'appartements ou de maisons. Le simulateur n'est en revanche pas adapté pour les terrains, les locaux commerciaux, les garages et les lots.",
  },
  {
    title: "J'ai un problème sur le site, que faire ?",
    answer:
      "Vous pouvez nous contacter par mail à l'adresse tekilawebfactory@gmail.com.",
  },
  {
    title: "Comment ça marche ?",
    answer:
      "Vous pouvez estimer votre bien en ligne, obtenir une offre d'achat instantanément et finaliser la vente en toute simplicité et très rapidement.",
  },
  {
    title: "A qui s'adresse Martinimmo ?",
    answer:
      "Martinimmo s'adresse à tous les propriétaires de biens immobiliers qui souhaitent vendre rapidement et facilement, sans les tracas des méthodes traditionnelles.",
  },
];

useHead({
  title: "Foire aux questions - Vente accélérée de biens immobiliers",
  meta: [
    {
      name: "description",
      content:
        "Découvrez les réponses aux questions fréquentes sur la vente de biens immobiliers avec Martinimmo. Estimez votre bien, obtenez une offre d'achat et vendez rapidement.",
    },
  ],
});
</script>
<template>
  <section class="faq">
    <h1 class="titles">Foire aux questions</h1>

    <FAQComponent :questions />
  </section>
</template>

<style lang="scss" scoped>
.faq {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100svh - 4rem);
  gap: 2rem;
  padding: 2rem 1rem;
  height: fit-content;

  @media (min-width: $big-tablet-screen) {
    justify-content: center;
    align-items: center;
    gap: 4rem;
    padding: 4rem 2rem;
    min-height: initial;
  }

  @media (min-width: $laptop-screen) {
    gap: 8rem;
    padding: 4rem;
  }
}
</style>
