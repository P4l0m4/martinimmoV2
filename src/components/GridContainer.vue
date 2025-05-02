<template>
  <section class="grid-container"><slot /></section>
</template>
<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  width: 100%;
  padding: 1rem;
  scroll-margin-top: 5rem;
  animation: fading 0.4s;
  gap: 1rem;
  margin: 0 auto;

  @media (min-width: $big-tablet-screen) {
    padding: 2rem;
    gap: 2rem;
  }
  @media (min-width: $super-big-screen) {
    width: 100%;
    max-width: 2064px;
  }
}
</style>
