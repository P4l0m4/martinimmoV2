<script setup lang="ts">
// import { useRoute } from "vue-router";
// import { computed } from "vue";

// const route = useRoute();

// const checkIfRouteContainsExpiredEmailLink = computed(() => {
//   return route.fullPath.includes("Email+link+is+invalid+or+has+expired");
// });
defineProps(["error"]);
</script>

<template>
  <HeaderComponent />
  <div class="error">
    <div class="error__message">
      <h1 class="subtitles">Oooops... error {{ error.statusCode }}</h1>
      <template v-if="error === 404">
        <h2 class="paragraphs">
          We didn't find the page you where looking for.
        </h2>
        <NuxtLink to="/" class="button primary--dark"
          >Retour à la page d'accueil</NuxtLink
        >
      </template>
      <template v-else-if="error === 403">
        <h2 class="paragraphs">
          Le lien de confirmation de votre email a expiré.
        </h2>
        <NuxtLink to="/" class="button primary--dark"
          >Retour à la page d'accueil</NuxtLink
        >
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.error {
  &__message {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
    padding: 4rem 1rem;
    height: 100vh;
    text-align: center;

    & h2 {
      font-weight: $regular;
      font-size: 1rem;
    }

    & button {
      padding: 1rem 1.75rem;
    }
  }
}
</style>
