<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperClass } from 'swiper'
import 'swiper/css'
import type { Product } from '~/types/product'

const props = defineProps<{
  products: Product[]
}>()
const { addToCart } = useCart()
const swiperRef = ref<SwiperClass>()
const onSwiper = (swiper: SwiperClass) => {
  swiperRef.value = swiper
  //showGradient.value = !swiper.isEnd
}
</script>

<template>
  <Swiper
    @swiper="onSwiper"
    :breakpoints="{
      0: {
        slidesPerView: 1.6,
        spaceBetween: 16
      }
    }"
  >
    <SwiperSlide
      v-for="product in props.products"
      :key="product.id"
      class="product-card bg-white rounded-2 overflow-hidden cursor-pointer shadow-lg mb-4 relative"
    >
      <div class="max-w-full">
        <img
          class="product-card-image block w-full h-50 object-cover"
          :src="product.image"
          :alt="product.name"
        />
      </div>
      <div class="absolute top-3 left-3 flex gap-3">
              <span
                v-if="product.is_newest"
                class="bg-#F7eee9 flex text-primary py-1.5 px-2 rounded-7.5"
              >
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
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
                新品
              </span>
              <span
                v-if="product.is_hottest"
                class="bg-primary flex text-#F7eee9 py-1.5 px-2 rounded-7.5"
              >
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
                    d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                  />
                </svg>

                TOP
              </span>
            </div>
      <div class="p-4">
        <p class="m-0 text-5">{{ product.name }}</p>
        <p class="mt-2 text-#7F7A7A">{{ product.style }}</p>
        <div class="flex justify-between mb-3">
          <span class="text-primary">$ {{ product.price }}</span>
          <span class="text-#7F7A7A line-through"
            >${{ product.origin_price }}</span
          >
        </div>
        <button
          class="flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary bg-transparent border border-solid border-primary px-4 py-2 rounded-2 cursor-pointer"
          @click.stop="addToCart(product.id, 1)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          加入購物車
        </button>
      </div>
    </SwiperSlide>
  </Swiper>
</template>
