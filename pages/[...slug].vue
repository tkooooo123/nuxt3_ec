<script setup lang="ts">
definePageMeta({
  layout: false
})
const route = useRoute()
if (import.meta.server) {
  const event = useRequestEvent()
  if (event) {
    setResponseStatus(event, 404)
  }
}
const slugParam = route.params.slug
const page = Array.isArray(slugParam) ? slugParam.join('/') : slugParam
const seconds = ref<number>(3)

const autoCountdown = () => {
  const timer = setInterval(() => {
    seconds.value--
    if (seconds.value <= 0) {
      clearInterval(timer)
      navigateTo('/')
    }
  }, 1000)
}
onMounted(() => {
  autoCountdown()
})
</script>

<template>
  <div class="h-100vh flex justify-center items-center bg-#fafafa">
   <div class="p-8 border border-2 border-solid border-primary rounded-lg">
    <h1 class="mt-0 text-center">404 - 找不到頁面</h1>
    <p class="text-center">抱歉，您所尋找的 {{ page }} 頁面不存在。</p>
    <p class="text-center">{{ seconds }} 秒後自動跳轉到首頁</p>
  
   </div>
  </div>
</template>
