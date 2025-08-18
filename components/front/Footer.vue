<script lang="ts" setup></script>
<template>
  <footer class="bg-#f7eee9 text-white">
    <div class="mx-auto px-6 md:px-[clamp(48px,10vw,120px)] py-8">
      <div
        class="flex flex-col md:flex-row justify-between items-center relative"
      >
        <div class="max-w-40">
          <NuxtImg
            @click="navigateTo('/')"
            class="w-full h-full cursor-pointer block"
            src="/images/logo.png"
            alt="logo"
            width="100%"
            height="100%"
            format="webp"
          />
        </div>

        <ul class="p-0 flex flex-col md:flex-row gap-4">
          <li>
            <NuxtLink
              to="/about"
              class="hover:text-primary transition-all duration-200"
            >
              關於我們
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/products"
              class="hover:text-primary transition-all duration-200"
            >
              商品一覽
            </NuxtLink>
          </li>
        </ul>

        <div class="flex gap-3 mt-4 md:mt-0">
          <NuxtImg
            src="/images/footer/facebook.png"
            alt="facebook_logo"
            class="block opacity-80 cursor-pointer"
            width="24"
            height="24"
          />
          <NuxtImg
            src="/images/footer/instagram.png"
            alt="instagram_logo"
            class="w-6 h-6 block opacity-80 cursor-pointer"
            width="24"
            height="24"
          />
          <NuxtImg
            src="/images/footer/line.png"
            alt="line_logo"
            class="w-6 h-6 block opacity-80 cursor-pointer"
            width="24"
            height="24"
          />
        </div>
      </div>

      <!-- 版權資訊 -->
      <p class="text-center text-#b6b6b6 text-3.5 lh-6 mt-5">
        Bakery 股份有限公司：台北市信義區信義路五段123號
        <br />無商業用途且僅供作品展示 | 版權所有 &copy;
        {{ new Date().getFullYear() }} Bakery All Rights Reserved
      </p>
    </div>
  </footer>
</template>

<style scoped>
/* 如果需要自定義樣式可以在這裡添加 */
</style>
