<template>
  <header class="header">
    <nav class="header__nav">
      <ul class="header__nav__ul">
        <li class="header__nav__ul__li">
          <NuxtLink to="/" exact-active>Accueil</NuxtLink>
        </li>
        <li class="header__nav__ul__li">
          <NuxtLink to="/estimation-en-ligne-bien-immobilier" exact
            >Obtenir une offre d'achat</NuxtLink
          >
        </li>
      </ul>
    </nav>
  </header>
</template>
<style lang="scss" scoped>
.router-link-exact-active {
  border-bottom: 2px solid $accent-color;
}

.header {
  display: none;
  padding: 1rem;
  box-shadow: $shadow-black;
  height: 72px;
  z-index: 2;
  position: fixed;
  top: 0;
  width: 100%;

  @media (min-width: $big-tablet-screen) {
    display: flex;
    padding: 1rem 4rem;
  }

  &__nav {
    width: 100%;
    display: flex;
    align-items: center;

    &__ul {
      list-style: none;
      display: flex;
      gap: 1rem;
      align-items: center;
      width: 100%;

      &__li a {
        font-weight: $semi-bold;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        color: $text-color-alt;
        font-size: 1rem;
      }

      &--dark {
        a {
          color: $base-color;
        }
      }
    }
  }
}
</style>
