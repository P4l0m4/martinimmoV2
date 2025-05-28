<template>
  <section class="grid-container"><slot /></section>
</template>
<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(288px, 1fr));
  width: 100%;
  padding: 2rem 1rem;
  scroll-margin-top: 5rem;
  animation: fading 0.4s;
  gap: 1rem;
  margin: 0 auto;

  @media (min-width: $big-tablet-screen) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    padding: 4rem 2rem;
    gap: 2rem;
  }

  @media (min-width: $desktop-screen) {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }

  @media (min-width: $super-big-screen) {
    padding: 4rem;
    width: 100%;
    max-width: 2064px;
  }
}
</style>
