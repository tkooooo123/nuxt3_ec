<script lang="ts" setup>

</script>
<template>
  <footer class="bg-#f7eee9 text-white">
    <div class=" mx-auto px-6 md:px-[clamp(48px,10vw,120px)] py-8">
      <div class=" flex flex-col sm:flex-row justify-between items-center relative">


        <div class="max-w-40">
          <img 
          @click="navigateTo('/')"
          class="w-full cursor-pointer" src="/images/logo.png" alt="logo">
        </div>
        



        <div class="flex gap-3">
          <img src="/images/footer/facebook.png" alt="facebook_logo" class="w-6 h-6 block opacity-80 cursor-pointer">
          <img src="/images/footer/instagram.png" alt="instagram_logo" class="w-6 h-6 block opacity-80 cursor-pointer">
          <img src="/images/footer/line.png" alt="line_logo" class="w-6 h-6 block opacity-80 cursor-pointer">
        </div>
      </div>

      <!-- 版權資訊 -->
      <p class="text-center text-#b6b6b6 text-3.5 lh-6 mt-5">Bakery 股份有限公司：台北市信義區信義路五段123號 <br>無商業用途且僅供作品展示 | 版權所有
        &copy; {{
          new Date().getFullYear() }} Bakery All Rights
        Reserved</p>


    </div>
  </footer>
</template>


<style scoped>
/* 如果需要自定義樣式可以在這裡添加 */
</style>