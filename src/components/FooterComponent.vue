<template>
  <footer class="footer">
    <div class="footer__links-container">
      <div class="footer__links-container__special-box">
        <NuxtLink
          class="footer__links-container__special-box__title-section"
          to="/"
        >
          <img
            class="footer__links-container__special-box__title-section__logo"
            src="@/assets/images/immo-logo.svg"
            alt="logo martinimmo"
          />
          <h4
            class="footer__links-container__special-box__title-section__title"
          >
            Martinimmo
          </h4>
        </NuxtLink>
        <p class="paragraphs">
          Vendez votre appartement ou maison sans attendre.
        </p>

        <NuxtLink
          class="footer__links-container__special-box__link"
          to="/estimation-en-ligne-bien-immobilier"
          >Voir nos dernières acquisitions</NuxtLink
        >
      </div>
      <ul class="footer__links-container__links">
        <h5 class="footer__links-container__links__title">Liens utiles</h5>
        <li class="footer__links-container__links__li">
          <NuxtLink
            to="/estimation-en-ligne-bien-immobilier"
            style="text-decoration: underline"
            >Espace client</NuxtLink
          >
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/estimation-en-ligne-bien-immobilier"
            >Obtenir un prêt</NuxtLink
          >
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/estimation-en-ligne-bien-immobilier"
            >Estimation en ligne</NuxtLink
          >
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/estimation-en-ligne-bien-immobilier"
            >Leasing immobilier</NuxtLink
          >
        </li>
      </ul>
      <ul class="footer__links-container__links">
        <h5 class="footer__links-container__links__title">Partenaires</h5>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/estimation-en-ligne-bien-immobilier">Experts</NuxtLink>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/estimation-en-ligne-bien-immobilier"
            >Notaires</NuxtLink
          >
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/estimation-en-ligne-bien-immobilier">Banques</NuxtLink>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/estimation-en-ligne-bien-immobilier"
            >Apport d'affaires</NuxtLink
          >
        </li>
      </ul>
      <ul class="footer__links-container__links">
        <h5 class="footer__links-container__links__title">Vos questions</h5>

        <li class="footer__links-container__links__li">
          <NuxtLink to="/faq">F.A.Q.</NuxtLink>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/faq">Qui sommes nous ?</NuxtLink>
        </li>
        <li class="footer__links-container__links__li">
          <NuxtLink to="/faq">Comment ça marche ?</NuxtLink>
        </li>
      </ul>
      <div class="footer__links-container__special-box">
        <div class="footer__links-container__special-box__title-section">
          <h4
            class="footer__links-container__special-box__title-section__title"
          >
            Estimez votre bien
          </h4>
        </div>
        <p class="paragraphs">Estimation 100% en ligne, rapide et gratuite.</p>
        <NuxtLink to="/estimation-en-ligne-bien-immobilier"
          ><PrimaryButton variant="accent-color" icon="arrow_right"
            >Obtenir une offre</PrimaryButton
          ></NuxtLink
        >
      </div>
    </div>

    <div class="footer__bottom-links">
      <NuxtLink
        to="https://docs.google.com/document/d/e/2PACX-1vQW80YJ6C8B_FY9LEPW6j4pEz3IfThZ-StWlcqUTakTnIUuAxn7CcheVopddu5dpgjlal_Amibhh2GF/pub"
        target="_blank"
        >CGV</NuxtLink
      ><NuxtLink
        to="https://docs.google.com/document/d/e/2PACX-1vTOGTdv866qLzIX4H8alMu0WlN-CeYjKNgtsEIJiimH1npT3ypGF3KCcu3eN0h9zmYpVWgK8wzcQqyi/pub"
        target="_blank"
        >CGU</NuxtLink
      ><NuxtLink
        to="https://docs.google.com/document/d/e/2PACX-1vRl0b5T5OmciZCyENe13NQgpoZH2g7YlzJUzgwiQwjbwLoOAvtbgrQDE-xVRqncwj8pHzeM8XxDEvMF/pub"
        target="_blank"
        >RGPD</NuxtLink
      >
      <NuxtLink to="https://tekilawebfactory.com" target="_blank"
        >Mentions légales</NuxtLink
      >
      <NuxtLink to="https://tekilawebfactory.com" target="_blank"
        >©Tekila Web Factory 2025</NuxtLink
      >
    </div>
  </footer>
</template>
<style lang="scss" scoped>
.footer {
  background-color: $secondary-color;
  padding: 1rem;
  gap: 2rem;
  display: flex;
  flex-direction: column;
  border-top: 1px solid $accent-color-faded;

  &__links-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;
    padding: 1rem;

    @media (min-width: $big-tablet-screen) {
      padding: 2rem;
      max-width: 2064px;
    }

    &__special-box {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: $text-color-alt;

      @media (min-width: $tablet-screen) {
        max-width: 300px;
      }

      &__title-section {
        display: flex;
        gap: 0.5rem;
        height: fit-content;
        align-items: center;

        &__logo {
          width: 35px;
          height: 35px;
        }

        &__title {
          color: $text-color-alt;
          font-size: 1.625rem;
          font-weight: $semi-bold;
        }
      }

      &__link {
        text-decoration: underline;
        color: $text-color-alt;
      }
    }

    &__links {
      display: flex;
      gap: 1rem;
      list-style: none;
      flex-direction: column;
      margin-top: 0.5rem;

      &__title {
        color: $text-color-alt;
        font-size: 1.05rem;
      }

      &__li {
        color: $text-color-alt;

        a {
          color: $text-color-alt;
        }
      }
    }
  }

  &__bottom-links {
    display: flex;
    gap: 1rem;
    color: $accent-color;
    font-size: $small-text;
    width: 100%;
    flex-wrap: wrap;

    @media (min-width: $big-tablet-screen) {
      flex-direction: row;
      max-width: calc(100vw - 6rem);
      margin: 0 auto;
    }

    & a {
      color: $accent-color;
      white-space: nowrap;
    }
  }
}
</style>
