// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
   modules: [
    '@unocss/nuxt',
    '@element-plus/nuxt',
  ],
   css: [
    '@/assets/scss/all.scss'
  ],
   vite: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ]
  },
   nitro: {
    plugins: [
      '@/server/index'
    ]
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true }
})
