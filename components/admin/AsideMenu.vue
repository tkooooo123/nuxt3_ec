<script lang="ts" setup>
interface menu {
  name: string;
  path:string;
}

const { logout } = useAuth()
const route = useRoute()
const isExpanded = ref<boolean>(true)
const menuList = ref<menu[]>([
  {
    name: '分類管理',
    path: '/admin/categories'
  },
  {
    name: '商品管理',
    path: '/admin/products'
  },
  {
    name: '訂單管理',
    path: '/admin/order'
  },
  // {
  //   name: '文章管理',
  //   path: '/admin/articles'
  // }
])
const selectedMenu = ref<string>('')

const handleLogout = async () => {
  await logout()
}
onMounted(() => {
  selectedMenu.value = route.path
})
</script>

<template>
  <div class="min-w-250px">
    <div
      class="fixed top-0 bg-white bottom-0 transition-property-all transition-ease-linear transition-duration-300 transform-origin-l overflow-hidden w-250px flex flex-col justify-between"
      :style="
        isExpanded
          ? { boxShadow: '6px 2px 12px 0px #00000040' }
          : { boxShadow: '0px 4px 4px 0px #00000040' }
      "
    >
      <div class="flex flex-col">
        <img class="block w-25 ml-4" src="/images/logo.png" alt="logo" /> 
        <ul class="p-0">
          <li v-for="item in menuList" :key="item.path">
            <NuxtLink
              :to="item.path"
              @click="selectedMenu = item.path"
              :class="
                selectedMenu === item.path
                  ? 'bg-red-100 text-red'
                  : 'text-black'
              "
              class="text-black flex justify-between items-center hover:bg-red-100 hover:text-red px-6 py-3"
            >
              <span class="text-sm">{{ item.name }}</span>
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
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </NuxtLink>
          </li>
        </ul>
      </div>
      <button
        class="m-4 bg-primary text-white rounded-30px h-10 cursor-pointer flex items-center justify-center"
      @click="handleLogout"
        >
        登出
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 ml-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
