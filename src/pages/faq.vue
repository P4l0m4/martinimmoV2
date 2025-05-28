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
    title: "A quoi sert MartinImmo ?",
    answer:
      "MartinImmo facilite la vente de biens immobiliers grâce à des fonctionnalités permettant une véritable simplicité documentaire et une liquidité particulièrement rapide. ",
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
];
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
    padding: 4rem;
  }
}
</style>
