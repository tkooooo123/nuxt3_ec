<script lang="ts" setup>
const isExpanded = ref<boolean>(true)
const menuList = ref<any[]>([
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
    path: '/admin/orders'
  },
  {
    name: '文章管理',
    path: '/admin/articles'
  }
])
const selectedMenu = ref<string>('')
</script>

<template>
  <div
    class="h-100vh transition-property-all transition-ease-linear transition-duration-300 transform-origin-l overflow-hidden w-250px"
    :style="
      isExpanded
        ? { boxShadow: '6px 2px 12px 0px #00000040' }
        : { boxShadow: '0px 4px 4px 0px #00000040' }
    "
  >
    <ul class="p-0">
      <li v-for="item in menuList" :key="item.path">
        <NuxtLink
          :to="item.path"
          @click="selectedMenu = item.path"
          :class="selectedMenu === item.path ? 'bg-red-100 text-red' : 'text-black'"
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
</template>
