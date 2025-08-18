<script lang="ts" setup>
interface navItem {
  id: number
  name: string
  link: string
}

const { isLoggedIn, logout } = useAuth()
const { cartCount, fetchCart } = useCart()
const isToggled = ref<boolean>(false)
const arrowToggled = ref<boolean>(false)
const navList = ref<navItem[]>([
  {
    id: 1,
    name: '關於我們',
    link: 'about'
  },
  {
    id: 2,
    name: '產品一覽',
    link: 'products'
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

    <div class="max-w-25">
      <img
        @click="navigateTo('/')"
        src="/images/logo.png"
        alt="logo"
        class="w-full block cursor-pointer"
      />
    </div>
    <div class="flex">
      <ul class="hidden md:flex">
        <li class="mx-1" v-for="item in navList" :key="item.id">
          <RouterLink
            :to="`${item.link}`"
            class="relative after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 after:origin-center hover:after:w-full hover:after:left-0 py-1"
            ><span
              class="px-2 hover:text-primary transition-all duration-200"
              >{{ item.name }}</span
            ></RouterLink
          >
        </li>
      </ul>
      <RouterLink
        to="/cart"
          aria-label="前往購物車"
        class="flex items-center ml-4 hover:scale-120 transition duration-300 relative"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 hover:text-primary"
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
          class="absolute -top-2 md:top-1.5 -right-2 md:-right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
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
      <div
        v-else
        class="hidden md:flex items-center ml-4 relative"
        @click="arrowToggled = !arrowToggled"
      >
        <img
          class="rounded-50% block h-12 w-12"
          src="https://i.imgur.com/ZgnOsNJ.png"
          alt="avatar"
        />
        <div class="arrow-down" :class="{ rotated: arrowToggled }"></div>
        <div
          class="absolute top-full right-0 w-40 bg-white rounded-b-[8px] pt-1 z-5"
          v-if="arrowToggled"
          style="box-shadow: 0px 4px 4px 0px #00000040"
        >
          <div
            class="flex justify-center items-center py-1.5 cursor-pointer"
            @click="navigateTo('/orders')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#1f1f1f"
            >
              <path
                d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"
              />
            </svg>

            <span class="ml-2 font-600">訂單</span>
          </div>

          <div
            class="border-t-1 border-t-#E7E7E7 border-t-solid h-12 flex justify-center items-center cursor-pointer"
            @click="handleLogout"
          >
            <span class="font-600">登出</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--手機板 toggle 清單-->
  <div
    v-if="isToggled"
    class="fixed left-0 right-0 top-17 bottom-0 z-9 bg-white md:hidden"
  >
    <ul class="px-5">
      <li v-if="isLoggedIn()">
        <RouterLink
          to="/orders"
          @click="isToggled = !isToggled"
          class="relative flex justify-center mt-4 hover:scale-110 transition-all duration-300 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 after:origin-center hover:after:w-20 hover:after:left-50% hover:after:transform-translate-x--50% py-1 hover:text-primary"
          ><span class="text-center">訂單</span></RouterLink
        >
      </li>
      <li v-if="isLoggedIn()">
        <RouterLink
          to=""
          @click="handleLogout"
          class="relative flex justify-center mt-4 hover:scale-110 transition-all duration-300 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 after:origin-center hover:after:w-20 hover:after:left-50% hover:after:transform-translate-x--50% py-1 hover:text-primary"
          ><span class="text-center">登出</span></RouterLink
        >
      </li>
      <li v-else>
        <RouterLink
          to="/login"
          class="relative flex justify-center mt-4 hover:scale-110 transition-all duration-300 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 after:origin-center hover:after:w-20 hover:after:left-50% hover:after:transform-translate-x--50% py-1 hover:text-primary"
          ><span class="text-center">登入</span></RouterLink
        >
      </li>
      <hr class="my-4" />
      <li class="mx-1" v-for="item in navList" :key="item.id">
        <RouterLink
          :to="item.link"
          @click="isToggled = !isToggled"
          class="relative flex justify-center mt-4 hover:scale-110 transition-all duration-300 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 after:origin-center hover:after:w-20 hover:after:left-50% hover:after:transform-translate-x--50% py-1 hover:text-primary"
          ><span class="text-center">{{ item.name }}</span></RouterLink
        >
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.arrow-down {
  border-left: 7.5px solid transparent;
  border-right: 7.5px solid transparent;
  border-top: 8px solid black;
  margin: 0 4.5px;
  cursor: pointer;
  &.rotated {
    transform: rotate(180deg);
  }
}
</style>