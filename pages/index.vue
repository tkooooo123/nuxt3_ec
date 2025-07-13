<script setup lang="ts">
const getProducts = async () => {
  try {
    const  data  = await $fetch('/api/product/all')
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  getProducts()
})
</script>

<template>
  <div class="pt-17">
    <div class="banner">
        <img class="w-full block object-cover" src="/images/home_banner.jpg" alt="banner">
    </div>
    <div class="px-12 pt-10">
        <h2 class="text-center relative after:content-[''] after:absolute after:z-[0] after:bottom-[-6px] after:left-0 after:w-28 after:h-3 after:bg-yellow-200 after:rounded-full after:left-1/2 after:-translate-x-1/2"
        >最新商品</h2>
    </div>
  </div>

</template>