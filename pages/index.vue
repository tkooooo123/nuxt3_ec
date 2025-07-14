<script setup lang="ts">
interface Product {
  id: string
  name: string
  image: string
  imagesUrl: string[]
  description: string
  content: string
  quantity: number
  price: number
  origin_price: number
  unit: string
  is_hottest: boolean
  is_newest: boolean
  notice: string
  material: string
  size: string
  style: string
  category: {
    id: string
    name: string
    description: string
  } | null
  createdAt: string
}

interface ApiResponse {
  message: string
  data: {
    products: Product[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

const products = ref<Product[]>([])
const newestProduct = ref<Product>()
const hottestProduct = ref<Product>()
const newestProductImages = ref<string[]>([])
const hottestProductImages = ref<string[]>([])
const selectedNewestImageIndex = ref(0)
const selectedHottestImageIndex = ref(0)

// 選擇圖片
const selectNewestImage = (index: number) => {
  selectedNewestImageIndex.value = index
}
const selectHottestImage = (index: number) => {
  selectedHottestImageIndex.value = index
}

const getProducts = async () => {
  try {
    const res: ApiResponse = await $fetch('/api/product/all')
    products.value = res.data.products
    newestProduct.value = res.data.products[0]
    hottestProduct.value = res.data.products.filter((product) => product.is_hottest)[0]
    newestProductImages.value = [res.data.products[0].image, ...res.data.products[0].imagesUrl]
    hottestProductImages.value = [res.data.products.filter((product) => product.is_hottest)[0].image, ...res.data.products.filter((product) => product.is_hottest)[0].imagesUrl]
  } catch (err: any) {
    console.error('取得商品失敗:', err)
  }
}

onMounted(() => {
  getProducts()
})
</script>

<template>
  <div class="pt-17">
    <div class="banner">
      <img class="w-full h-150 block object-cover" src="/images/home_banner.jpg" alt="banner">
    </div>

    <div class="px-[clamp(20px,10vw,80px)] md:px-[clamp(40px,5vw,120px)] max-w-1320px mx-auto pt-10 pb-30">
      <h2
        class="mt-30 mb-10 text-7 md:text-10 text-center relative after:content-[''] after:absolute after:z-[0] after:bottom-[-6px] after:left-0 after:w-32 md:after:w-44 after:h-3 after:bg-yellow-200 after:rounded-full after:left-1/2 after:-translate-x-1/2">
        熱門商品</h2>
      <div class="flex flex-col-reverse md:grid md:grid-cols-2 gap-6">
        <div class="xl:flex xl:gap-4">
         <div class="xl:flex-1">
          <img :src="hottestProductImages[selectedHottestImageIndex]" alt="newestProduct" class="w-full max-h-408px block rounded-4 object-cover">
         </div>
          <HomeImgSwiper :images="hottestProductImages" v-model:selectedImageIndex="selectedHottestImageIndex"/>
        </div>
        <div>
          <h2 class="text-primary my-3 text-7 md:text-10 font-bold">{{ hottestProduct?.name }}</h2>
          <p class="text-6 md:text-10 font-600 m-0"> {{ hottestProduct?.description }}</p>
          <p class="text-3.5 md:text-5 md:text-6 font-500 mt-8 lh-6 md:lh-9" v-html="hottestProduct?.content"></p>
          <div class="mt-6 flex justify-end">
            <button
              class="flex items-center gap-2 h-11 px-6 font-600 bg-white hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer border-1 border-solid  border-primary text-primary rounded-30px">
              <span>更多熱門 </span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>

            </button>
          </div>
        </div>
      </div>

      <h2
        class="mt-30 mb-10 text-7 md:text-10 text-center relative after:content-[''] after:absolute after:z-[0] after:bottom-[-6px] after:left-0 after:w-32 md:after:w-44 after:h-3 after:bg-yellow-200 after:rounded-full after:left-1/2 after:-translate-x-1/2">
        最新商品</h2>
      <div class="flex flex-col-reverse md:grid md:grid-cols-2 gap-6">

        <div>
          <h2 class="text-primary my-3 text-7 md:text-10 font-bold">{{ newestProduct?.name }}</h2>
          <p class="text-6 md:text-10 font-600 m-0"> {{ newestProduct?.description }}</p>
          <p class="text-3.5 md:text-5 md:text-6 font-500 mt-8 lh-6 md:lh-9" v-html="newestProduct?.content"></p>
          <div class="mt-6 flex justify-end">
            <button
              class="flex items-center gap-2 h-11 px-6 font-600 bg-white hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer border-1 border-solid  border-primary text-primary rounded-30px">
              <span>更多新品 </span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>

            </button>
          </div>
        </div>
        <div class="xl:flex xl:gap-4">
          <div class="xl:flex-1">
            <img :src="newestProductImages[selectedNewestImageIndex]" alt="newestProduct" class="w-full max-h-408px block rounded-4 object-cover">
          </div>
          <HomeImgSwiper :images="newestProductImages"   v-model:selectedImageIndex="selectedNewestImageIndex"/>

        </div>
      </div>

    </div>

  </div>
</template>
