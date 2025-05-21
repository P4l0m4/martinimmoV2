import { resolve } from "pathe";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: true,
  nitro: {
    preset: "netlify",
  },

  srcDir: "src/",
  css: ["@/styles/global.scss"],
  modules: ["dayjs-nuxt", "@pinia/nuxt"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/_variables.scss";',
        },
      },
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: "fr" },
    },
  },
  runtimeConfig: {
    public: {
      STATIC_MAPS_API_KEY: process.env.STATIC_MAPS_API_KEY,
    },
  },
  dayjs: {
    locales: ["fr"],
  },
});
