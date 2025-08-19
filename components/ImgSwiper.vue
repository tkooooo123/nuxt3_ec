<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperClass } from 'swiper'
import { Thumbs, FreeMode } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
const props = defineProps<{
  images: string[]
}>()

// 縮圖 swiper 實例
const thumbsSwiper = ref<SwiperClass>()
const selectedImageIndex = ref(0)
</script>

<template>
  <!-- 主圖 -->
  <Swiper :modules="[Thumbs]" :thumbs="{ swiper: thumbsSwiper }" space-between="20" class="mb-4">
    <SwiperSlide v-for="(img, i) in props.images" :key="i">
      <img :src="img" class="w-full rounded-xl" />
    </SwiperSlide>
  </Swiper>

  <!-- 縮圖 -->
  <Swiper
    :modules="[FreeMode, Thumbs]"
    @swiper="(swiper) => (thumbsSwiper = swiper)"
    :slides-per-view="3"
    space-between="10"
    free-mode
    watch-slides-progress
    class="cursor-pointer"
  >
    <SwiperSlide
      v-for="(img, i) in props.images"
      :key="i"
      class="max-w-full"
      @click="selectedImageIndex = i"
    >
      <img
        :src="img"
        class="rounded-lg w-full aspect-1 object-cover"
        :class="selectedImageIndex === i ? '' : 'opacity-60'"
      />
    </SwiperSlide>
  </Swiper>
</template>
