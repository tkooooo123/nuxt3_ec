<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperClass } from 'swiper'

import 'swiper/css'

const emit = defineEmits<{
  'update:selectedImageIndex': [index: number]
  selectedImageIndex: [index: number]
}>()

const props = defineProps<{
  images: string[]
}>()
const selectedImageIndex = ref(0)
const swiperRef = ref<SwiperClass>()


const onSwiper = (swiper: SwiperClass) => {
  swiperRef.value = swiper
  //showGradient.value = !swiper.isEnd
}

const handleImageSelect = (index: number) => {
  selectedImageIndex.value = index
  emit('update:selectedImageIndex', index)
}
</script>

<template>
  
    <Swiper
      class="mt-6 xl:mt-0 max-h-416px xl:w-40"
      @swiper="onSwiper"
      :slides-per-view="3"
      :space-between="16"
      :breakpoints="{
        0: {
          slidesPerView: 3,
          spaceBetween: 16,
          direction: 'horizontal'
        },
        1280: {
          spaceBetween: 24,
          direction: 'vertical'
        }
      }"
    >
      <SwiperSlide
        v-for="(image, index) in props.images"
        :key="image"
        @click="handleImageSelect(index)"
        class="xl:h-full"
      >
        <img
          :src="image"
          alt="image"
          class="block w-full xl:h-full object-cover rounded-2 cursor-pointer"
          :class="selectedImageIndex === index ? '' : 'opacity-60'"
        />
      </SwiperSlide>
    </Swiper>
 
</template>
