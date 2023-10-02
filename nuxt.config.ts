// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@element-plus/nuxt', '@nuxtjs/i18n'],
  i18n: {
    vueI18n: './local/index.ts',
  }
})
