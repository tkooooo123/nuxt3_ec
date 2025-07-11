<script lang="ts" setup>
interface navItem {
  id: number
  name: string
  link: string
}

const { isLoggedIn, logout } = useAuth()
const { cartCount, fetchCart } = useCart()
const isToggled = ref<boolean>(false)
const navList = ref<navItem[]>([
  {
    id: 1,
    name: '關於我們',
    link: 'about'
  },
  {
    id: 2,
    name: '最新消息',
    link: 'news'
  }
])

// 組件掛載時獲取購物車資料
onMounted(async () => {
  if (isLoggedIn()) {
    await fetchCart()
  }
})

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <div
    class="h-17 bg-white px-10 fixed left-0 right-0 flex justify-between items-center shadow-md z-10"
  >
    <div
      class="flex items-center md:hidden cursor-pointer"
      @click="isToggled = !isToggled"
    >
      <svg
        v-if="!isToggled"
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
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
      <svg
        v-else
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
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </div>

    <div class="text-red">Test</div>
    <div class="flex">
      <ul class="hidden md:flex">
        <li class="mx-1" v-for="item in navList" :key="item.id">
          <RouterLink
            to=""
            class="relative after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-red-500 after:transition-all after:duration-300 after:origin-center hover:after:w-full hover:after:left-0 py-1"
            ><span class="px-2">{{ item.name }}</span></RouterLink
          >
        </li>
      </ul>
      <RouterLink
        to="/cart"
        class="flex items-center ml-4 hover:scale-120 transition duration-300 relative"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 hover:text-red"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
        <!-- 購物車數量徽章 -->
        <span
          v-if="cartCount > 0"
          class="absolute -top-2 md:top-1.5 -right-2 md:-right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        >
          {{ cartCount }}
        </span>
      </RouterLink>
      <RouterLink
        v-if="!isLoggedIn()"
        to="/login"
        class="hidden md:flex items-center ml-4 hover:scale-120 transition duration-300"
      >
        <span>登入</span>
      </RouterLink>
      <RouterLink
        v-else
        to=""
        @click="handleLogout"
        class="hidden md:flex items-center ml-4 hover:scale-120 transition duration-300"
      >
        <span>登出</span>
      </RouterLink>
    </div>
    <!--手機板 toggle 清單-->
  </div>
  <div
    v-if="isToggled"
    class="fixed left-0 right-0 top-17 z-1 bg-white md:hidden"
  >
    <ul class="px-5">
      <li v-if="isLoggedIn()">
        <RouterLink
          to=""
          @click="handleLogout"
          class="relative flex justify-center mt-4 hover:scale-110 transition-all duration-300 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-red-500 after:transition-all after:duration-300 after:origin-center hover:after:w-20 hover:after:left-50% hover:after:transform-translate-x--50% py-1"
          ><span class="text-center">登出</span></RouterLink
        >
      </li>
      <li v-else>
        <RouterLink
          to="/login"
          class="relative flex justify-center mt-4 hover:scale-110 transition-all duration-300 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-red-500 after:transition-all after:duration-300 after:origin-center hover:after:w-20 hover:after:left-50% hover:after:transform-translate-x--50% py-1"
          ><span class="text-center">登入</span></RouterLink
        >
      </li>
      <hr class="my-4" />
      <li class="mx-1" v-for="item in navList" :key="item.id">
        <RouterLink
          to=""
          class="relative flex justify-center mt-4 hover:scale-110 transition-all duration-300 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-red-500 after:transition-all after:duration-300 after:origin-center hover:after:w-20 hover:after:left-50% hover:after:transform-translate-x--50% py-1"
          ><span class="text-center">{{ item.name }}</span></RouterLink
        >
      </li>
    </ul>
  </div>
</template>
