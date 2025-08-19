<script setup lang="ts">
import type { ApiResponse } from '~/types/api'
import type { Product, ProductsResponse } from '~/types/product'
import { FetchError } from 'ofetch'
import { toast } from 'vue3-toastify'

const loadingStore = useLoadingStore()

const products = ref<Product[]>([])
const newestProduct = ref<Product>()
const hottestProduct = ref<Product>()
const newestProductImages = ref<string[]>([])
const hottestProductImages = ref<string[]>([])
const selectedNewestImageIndex = ref(0)
const selectedHottestImageIndex = ref(0)

const getProducts = async () => {
  loadingStore.show()
  try {
    const res = await $fetch<ApiResponse<ProductsResponse>>('/api/product/all')
    if (res.data) {
      products.value = res.data.products
      newestProduct.value = res.data.products[0]
      hottestProduct.value = res.data.products.filter(
        (product) => product.is_hottest
      )[0]
      newestProductImages.value = [
        res.data.products[0].image,
        ...res.data.products[0].imagesUrl
      ]
      hottestProductImages.value = [
        res.data.products.filter((product) => product.is_hottest)[0].image,
        ...res.data.products.filter((product) => product.is_hottest)[0]
          .imagesUrl
      ]
    }
  } catch (err: unknown) {
    if (err instanceof FetchError) toast.error('取得商品失敗，請稍後再試')
  } finally {
    loadingStore.hide()
  }
}

const scrollToSection = (id: string) => {
  const target = document.querySelector(`#${id}`)
  if (target) {
    const yOffset = -84 // 上方偏移量（例如固定 header 高度）
    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  getProducts()
})
</script>

<template>
  <div class="pt-17">
    <div class="banner relative">
      <NuxtImg
  src="/images/home_banner.jpg"
  alt="banner"
  width="100%"     
  height="600"
  format="webp"    
  class="w-full h-150 block object-cover"
/>
      <!-- Banner 文案內容 -->
      <div
        class="absolute inset-0 bg-black bg-opacity-15 flex items-center justify-center"
      >
        <div class="text-center text-white px-4">
          <h1 class="text-8 md:text-12 lg:text-16 font-bold mb-4">
            精選烘焙商品
          </h1>
          <p
            class="text-4 md:text-6 lg:text-8 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            嚴選優質原料，手工製作的美味烘焙，為您的生活增添甜蜜滋味
          </p>
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              @click="navigateTo('/products')"
              class="flex items-center gap-2 h-12 px-8 font-600 bg-primary hover:bg-primary_dark transition-all duration-200 cursor-pointer text-white rounded-30px text-4 md:text-5"
            >
              <span>前去逛逛</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- 向下滾動箭頭 -->
      <div class="absolute bottom-2 left-1/2 -translate-x-1/2">
        <svg
          @click="scrollToSection('hottest-product')"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.0"
          stroke="currentColor"
          class="size-9 text-white moving cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
          />
        </svg>
      </div>
    </div>

    <div
      class="px-[clamp(20px,10vw,80px)] md:px-[clamp(40px,5vw,120px)] max-w-1320px mx-auto pt-10 pb-30"
    >
      <h2
        class="mt-30 mb-10 text-7 md:text-10 text-center relative after:content-[''] after:absolute after:z-[0] after:bottom-[-6px] after:left-0 after:w-32 md:after:w-44 after:h-3 after:bg-yellow-200 after:rounded-full after:left-1/2 after:-translate-x-1/2"
        id="hottest-product"
      >
        熱門商品
      </h2>
      <div
        class="flex flex-col-reverse md:grid md:grid-cols-2 gap-6 max-w-516px md:max-w-full mx-auto"
      >
        <div class="xl:flex xl:gap-4">
          <ImgSwiper
            :images="hottestProductImages"
          />
        </div>
        <div>
          <h2 class="text-primary my-3 text-7 md:text-8 font-bold">
            {{ hottestProduct?.name }}
          </h2>
          <p class="text-6 md:text-8 font-600 m-0">
            {{ hottestProduct?.description }}
          </p>
          <p
            class="text-3.5 sm:text-4.5 md:text-5 font-500 mt-8 lh-6 md:lh-9"
            v-sanitize-html="hottestProduct?.content"
          ></p>
          <div class="mt-6 flex justify-end">
            <button
              @click="navigateTo('/products?topic=is_hottest')"
              class="flex items-center gap-2 h-11 px-6 font-600 bg-white hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer border-1 border-solid border-primary text-primary rounded-30px"
            >
              <span>更多熱門 </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <h2
        class="mt-30 mb-10 text-7 md:text-10 text-center relative after:content-[''] after:absolute after:z-[0] after:bottom-[-6px] after:left-0 after:w-32 md:after:w-44 after:h-3 after:bg-yellow-200 after:rounded-full after:left-1/2 after:-translate-x-1/2"
      >
        最新商品
      </h2>
      <div
        class="flex flex-col-reverse md:grid md:grid-cols-2 gap-6 max-w-516px md:max-w-full mx-auto"
      >
        <div>
          <h2 class="text-primary my-3 text-6 md:text-8 font-bold">
            {{ newestProduct?.name }}
          </h2>
          <p class="text-6 md:text-8 font-600 m-0">
            {{ newestProduct?.description }}
          </p>
          <p
            class="text-3.5 sm:text-4.5 md:text-5 font-500 mt-8 lh-6 md:lh-9"
            v-sanitize-html="newestProduct?.content"
          ></p>
          <div class="mt-6 flex justify-end">
            <button
              @click="navigateTo('/products?topic=is_newest')"
              class="flex items-center gap-2 h-11 px-6 font-600 bg-white hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer border-1 border-solid border-primary text-primary rounded-30px"
            >
              <span>更多新品 </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="xl:flex xl:gap-4">
          <ImgSwiper
            :images="newestProductImages"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
//上下移動動畫
.moving {
  animation: upDown 1.5s ease-in-out infinite;
}

@keyframes upDown {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
