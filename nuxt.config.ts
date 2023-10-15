// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt', '@nuxtjs/i18n'],
  i18n: {
    vueI18n: './local/index.ts',
  },
  components: [
    {
      path: '~/components/',
      pathPrefix: false,
    },
  ],
  ssr: false,
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
})
