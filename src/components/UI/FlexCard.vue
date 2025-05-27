<template>
  <div class="flex-card"><slot /></div>
</template>
<style lang="scss" scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-radius: $radius;
  background-color: $accent-color-faded;
  border: 1px solid $accent-color-faded;
  width: 100%;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
    gap: 1.5rem;
    max-width: 800px;
  }
}
</style>
