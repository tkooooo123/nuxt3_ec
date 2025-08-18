// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
   modules: [
     '@unocss/nuxt',
     '@element-plus/nuxt',
     '@nuxtjs/ngrok',
     '@pinia/nuxt',
     '@nuxtjs/sitemap',
     '@radya/nuxt-dompurify',
     '@nuxt/image'
   ],
   app: {
    head: {
      htmlAttrs: {
        lang: 'zh-TW' // 設定為繁體中文
      },
      title: 'Bakery',
      link: [
        // 添加其他格式的 favicon 圖標
        { rel: 'icon', type: 'image/png', href: '/images/logo.png' }
      ]
    }
  },
   css: [
    '@/assets/scss/all.scss',
    'vue3-toastify/dist/index.css'
  ],
  image: {
    cloudinary: {
      baseURL: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`
    }
  },
   vite: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    server: {
      allowedHosts: ['.ngrok-free.app'] // 允許所有 ngrok 子網域
    },
  },
   nitro: {
    plugins: [
      '@/server/index'
    ]
  },
  runtimeConfig: {
    public: {
      cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadReset: process.env.CLOUDINARY_UPLOAD_PRESET 
    }
    }
  },
  ngrok: {
    authtoken: process.env.NGROK_AUTHTOKEN,
    production: false,
  },
  site: {
    url: process.env.SITE_URL
  },
  sitemap: {
   
    defaults: {
      changefreq: 'daily',
      priority: 1.0
    },
      exclude: ['/admin/**']
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true }
})