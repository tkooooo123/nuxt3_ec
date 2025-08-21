// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@element-plus/nuxt',
    '@nuxtjs/ngrok',
    '@pinia/nuxt',
    '@nuxtjs/sitemap',
    '@radya/nuxt-dompurify',
    '@nuxt/image',
    'nuxt-security'
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
  css: ['@/assets/scss/all.scss', 'vue3-toastify/dist/index.css'],
  image: {
    cloudinary: {
      baseURL: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`
    }
  },
  vite: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    server: {
      allowedHosts: ['.ngrok-free.app'] // 允許所有 ngrok 子網域
    },
    build: {
      minify: 'esbuild' // JS/CSS 自動壓縮
    }
  },
  nitro: {
    plugins: ['@/server/index'],
    compressPublicAssets: true
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
    production: false
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
  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'img-src': ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          ...(isDev ? ['https://*.ngrok-free.app'] : []) // 只在開發環境添加
        ],
        'script-src-attr': ["'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'connect-src': [
          "'self'",
          'https://api.cloudinary.com', 
          ...(isDev ? ['https://*.ngrok-free.app'] : []) // 只在開發環境添加
        ],
        'font-src': ["'self'", 'data:'],
        'frame-ancestors': ["'self'"],
        'form-action': ["'self'", "https://payment-stage.ecpay.com.tw"],
        
      }
    }
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true }
})
