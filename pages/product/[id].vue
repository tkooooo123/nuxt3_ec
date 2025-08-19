<script setup lang="ts">
import type { Product, ProductsResponse } from '~/types/product'
import type { ApiResponse } from '~/types/api'
import type { User } from '~/types/user'
import { FetchError } from 'ofetch'
import { toast } from 'vue3-toastify'

const loadingStore = useLoadingStore()
const route = useRoute()
const product = ref<Product | null>(null)
const imgList = ref<string[]>([])
const quantity = ref(1)
const detailType = ref<'content' | 'specification' | 'notice'>('content')
const hottestList = ref<Product[]>([])
const userCookie = useCookie('userInfo')
const userInfo = userCookie.value as User | null
const userId = userInfo?.user_id

// 使用 useCart composable
const { addToCart: addToCartComposable } = useCart()

// 獲取商品詳情
const getProduct = async () => {
  loadingStore.show()
  try {
    const res = await $fetch<ApiResponse<Product>>(
      `/api/product/${route.params.id}`
    )
    product.value = res.data || null
    if (product.value) {
      imgList.value = [product.value.image, ...product.value.imagesUrl]
    }
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      toast.error(`無法載入商品資訊`)
    }
  } finally {
    loadingStore.hide()
  }
}
const getProducts = async () => {
  loadingStore.show()
  try {
    const res = await $fetch<ApiResponse<ProductsResponse>>('/api/product/all')
    hottestList.value =
      res.data && res.data.products.length > 0 ? res.data.products : []
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      toast.error(`無法載入商品資訊`)
    }
  } finally {
    loadingStore.hide()
  }
}


// 增加數量
const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.quantity) {
    quantity.value++
  }
}

// 減少數量
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 加入購物車
const addToCart = async () => {
  if (!userId) {
    toast.error('請先登入')
    return
  }

  if (!product.value) return

  try {
    // 使用 useCart composable 的 addToCart 方法
    await addToCartComposable(product.value.id, quantity.value)

    quantity.value = 1
  } catch (error: unknown) {
    let msg = '加入購物車失敗，請稍後再試'
    if (error instanceof FetchError) {
      msg = error.data.message
    }
    toast.error(msg)
  }
}

// 格式化價格
const formatPrice = (price: number) => {
  return price.toLocaleString('zh-TW')
}

onMounted(async () => {
  await getProducts()
  await getProduct()
})
</script>

<template>
  <div class="py-17 px-10 sm:px-15">
    <!-- 麵包屑導航 -->
    <div class="flex items-center mt-6 mb-8 text-sm text-gray-600">
      <NuxtLink to="/" class="hover:text-primary transition-colors"
        >首頁</NuxtLink
      >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-4 mx-2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
      <NuxtLink to="/products" class="hover:text-primary transition-colors"
        >產品</NuxtLink
      >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-4 mx-2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
      <span v-if="product" class="text-gray-900">{{ product.name }}</span>
    </div>

    

    <!-- 商品詳情 -->
    <div
      v-if="product"
      class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-150 lg:max-w-full mx-auto"
    >
    <div>
      <ImgSwiper :images="imgList" />
    </div>
      
     

      <!-- 商品資訊區域 -->
      <div class="space-y-6">
        <!-- 商品標題 -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ product.name }}
          </h1>
          <div class="flex gap-3 my-2">
            <span
              v-if="product.is_newest"
              class="bg-#F7eee9 flex text-primary py-1.5 px-2 rounded-7.5"
            >
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
                  d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                />
              </svg>
              新品
            </span>
            <span
              v-if="product.is_hottest"
              class="bg-primary flex text-#F7eee9 py-1.5 px-2 rounded-7.5"
            >
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
                  d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                />
              </svg>

              TOP
            </span>
          </div>
          <div v-if="product.category" class="text-sm text-gray-500">
            分類：{{
              typeof product.category === 'object' && product.category.name
            }}
          </div>
        </div>

        <!-- 價格 -->
        <div class="text-2xl font-bold text-primary">
          NT$ {{ formatPrice(product.price) }}
          <span v-if="product.unit" class="text-sm text-gray-500 font-normal"
            >/ {{ product.unit }}</span
          >
        </div>

        <!-- 商品描述 -->
        <div v-if="product.description" class="text-gray-700">
          <h3 class="font-semibold mb-2">商品描述</h3>
          <p>{{ product.description }}</p>
        </div>

        <!-- 庫存狀態 -->
        <div class="flex items-center space-x-2">
          <span class="font-semibold">庫存：</span>
          <span
            :class="product.quantity > 0 ? 'text-green-600' : 'text-red-600'"
            class="font-medium"
          >
            {{ product.quantity > 0 ? `${product.quantity} 件` : '缺貨中' }}
          </span>
        </div>

        <!-- 數量選擇 -->
        <div v-if="product.quantity > 0" class="space-y-4">
          <div class="flex items-center space-x-4">
            <span class="font-semibold">數量：</span>
            <div class="flex items-center">
              <button
                :disabled="quantity <= 1"
                @click="decreaseQuantity"
                class="h-8 w-8 hover:bg-primary hover:text-white bg-white border border-solid border-primary text-primary rounded-l-[50%] cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                  stroke="currentColor"
                  class="size-4 align-middle"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 12h14"
                  />
                </svg>
              </button>
              <span
                class="bg-white h-8 w-8 text-center flex items-center justify-center box-border border-t border-b border-l-0 border-r-0 border-solid border-primary"
                >{{ quantity }}</span
              >
              <button
               @click="increaseQuantity"
                :disabled="quantity >= product.quantity"
                class="h-8 w-8 hover:bg-primary hover:text-white bg-white border border-solid border-primary text-primary rounded-r-[50%] cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                  stroke="currentColor"
                  class="size-4 align-middle"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- 加入購物車按鈕 -->
          <button
            @click="addToCart"
            class="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            <span>加入購物車</span>
          </button>
        </div>

        <!-- 缺貨提示 -->
        <div v-else class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5 text-red-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            <span class="text-red-800 font-medium">此商品目前缺貨中</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品詳細內容 -->
    <div v-if="product && product.content" class="mt-16">
      <div class="flex mb-3">
        <span
          class="mr-3 p-3 rounded-2 cursor-pointer transition-all duration-200"
          @click="detailType = 'content'"
          :class="
            detailType === 'content' ? 'bg-#fee2e2 text-primary' : 'bg-#ECECEC'
          "
          >產品說明</span
        >
        <span
          class="mr-3 p-3 rounded-2 cursor-pointer transition-all duration-200"
          @click="detailType = 'notice'"
          :class="
            detailType === 'notice' ? 'bg-#fee2e2 text-primary' : 'bg-#ECECEC'
          "
          >注意事項</span
        >
        <span
          class="p-3 rounded-2 cursor-pointer transition-all duration-200"
          @click="detailType = 'specification'"
          :class="
            detailType === 'specification'
              ? 'bg-#fee2e2 text-primary'
              : 'bg-#ECECEC'
          "
          >產品規格</span
        >
      </div>
      <div class="max-w-none" v-if="detailType === 'content'">
        <div
          v-sanitize-html="product.content"
          class="text-gray-700 leading-relaxed px-4 py-6 bg-white rounded-2"
        ></div>
      </div>
      <div class="max-w-none" v-if="detailType === 'notice'">
        <div
          v-sanitize-html="product.notice"
          class="text-gray-700 leading-relaxed px-4 py-6 bg-white rounded-2"
        ></div>
      </div>
      <div class="max-w-none" v-if="detailType === 'specification'">
        <div class="text-gray-700 leading-relaxed px-4 py-6 bg-white rounded-2">
          <table>
            <tbody>
              <tr>
                <th class="w-20 font-600">風味</th>
                <td>{{ product.style }}</td>
              </tr>
              <tr>
                <th class="w-20 font-600">成分</th>
                <td>{{ product.material }}</td>
              </tr>
              <tr>
                <th class="w-20 font-600">尺寸</th>
                <td>{{ product.size }}</td>
              </tr>
              <tr>
                <th class="w-20 font-600">單位</th>
                <td>{{ product.unit }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div>
      <h2
        class="mt-30 mb-10 text-7 md:text-10 text-center relative after:content-[''] after:absolute after:z-[0] after:bottom-[-6px] after:left-0 after:w-32 md:after:w-44 after:h-3 after:bg-yellow-200 after:rounded-full after:left-1/2 after:-translate-x-1/2"
        id="hottest-product"
      >
        熱門商品
      </h2>
      <FrontProductSwiper
        class="mt-5"
        :products="hottestList"
      ></FrontProductSwiper>
    </div>
  </div>
</template>

<style lang="scss" scoped>
table {
  border-collapse: collapse; /* 合併框線 */
  width: 100%;
}
th,
td {
  border: 1px solid #ccc; /* 細灰色框線 */
  padding: 8px 12px;
}
th {
  background-color: #f7f7f7;
}
</style>
