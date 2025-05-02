<template>
  <section class="container">
    <slot></slot>
  </section>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem 1rem;
  scroll-margin-top: 5rem;
  animation: fading 0.4s;
  gap: 1rem;
  margin: 0 auto;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 2rem;
    gap: 2rem;
  }

  @media (min-width: $desktop-screen) {
    padding: 4rem;
    gap: 2rem;
  }
  @media (min-width: $super-big-screen) {
    width: 100%;
    max-width: 2064px;
  }
}
</style>
