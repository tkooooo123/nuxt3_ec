<script lang="ts" setup>
interface menu {
  name: string
  path: string
}
const { logout } = useAuth()
const route = useRoute()
const drawerVisible = ref(false)
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
  }
])
const selectedMenu = ref('')
const handleLogout = async () => {
  await logout()
}
onMounted(() => {
  selectedMenu.value = route.path
})
</script>

<template>
  <div class="fixed left-0 right-0 bg-white h-15 sm:hidden z-10 shadow-md">
    <div class="flex px-4 h-full justify-between">
      <NuxtImg
        src="/images/logo.png"
        alt="logo"
        class="h-full block"
        width="100%"
        height="100%"
        format="webp"
      >
      </NuxtImg>
      <svg
        @click="drawerVisible = true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-7 self-center cursor-pointer"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </div>
  </div>
  <el-drawer v-model="drawerVisible" size="100%">
    <div>
      <div class="flex flec-col justify-center">
      <ul class="p-0">
        <li v-for="item in menuList" :key="item.path" class="">
          <NuxtLink
            :to="item.path"
            @click="() => {
              selectedMenu = item.path
              drawerVisible = false
            }"
            :class="
              selectedMenu === item.path ? 'text-primary' : 'text-black'
            "
           class="relative flex justify-center mt-4 hover:scale-110 transition-all duration-300 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 after:origin-center hover:after:w-22 hover:after:left-50% hover:after:transform-translate-x--50% py-1 hover:text-primary"
          >
            <span class="text-5">{{ item.name }}</span>
            
          </NuxtLink>
        </li>
      </ul>
    </div>
    <hr class="my-4" />
    <NuxtLink
          to=""
     @click="handleLogout"
          class="relative flex justify-center mt-4 hover:scale-110 transition-all duration-300 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 after:origin-center hover:after:w-20 hover:after:left-50% hover:after:transform-translate-x--50% py-1 hover:text-primary cursor-pointer"
          ><span class="text-center text-5">登出</span></NuxtLink
        >
    </div>
  </el-drawer>
</template>
