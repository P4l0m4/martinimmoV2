<template>
  <HeaderComponent />
  <main>
    <slot />
  </main>
  <FooterComponent />
</template>
<style lang="scss">
main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: transform 0.4s ease, border-radius 0.4s ease;
}

.expand-enter-from,
.expand-leave-to {
  transform: scale(0);
  border-radius: 50%;
}
</style>
