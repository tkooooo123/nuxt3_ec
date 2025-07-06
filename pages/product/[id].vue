<script setup lang="ts">
interface Product {
  id: string
  name: string
  image: string
  imagesUrl: string[]
  description: string
  content: string
  quantity: number
  price: number
  isEnabled: boolean
  unit: string
  is_hottest: boolean
  is_newest: boolean
  notice: string
  origin: string
  origin_price: number
  size: string
  material: string
  category: {
    id: string
    name: string
    description: string
  } | null
  createdAt: string
}

interface ApiResponse<T> {
  message: string
  data: T
}
 interface UserInfo {
  user_id: string
 }


const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const imgList = ref<string[]>([])
const error = ref<string | null>(null)
const selectedImageIndex = ref(0)
const quantity = ref(1)
const detailType = ref<'content' | 'specification' | 'notice'>('content')

const userCookie = useCookie('userInfo')
const token = useCookie('token')
const userInfo = userCookie.value as UserInfo | null
const userId = userInfo?.user_id


// 獲取商品詳情
const getProduct = async () => {
  try {

    console.log(token.value,userId)
    //console.log(token.value)
    //loading.value = true
    //const res = await $fetch<ApiResponse<Product>>(
      //`/api/product/${route.params.id}`
    //)
    //product.value = res.data
    product.value = {
    id: '1',
    name: '奶油泡芙',
    image: 'https://res.cloudinary.com/dbfvtcjog/image/upload/v1751192048/ihp5oimbsm9sopxvoi53.jpg',
    imagesUrl: ['https://res.cloudinary.com/dbfvtcjog/image/upload/v1751191902/jbspz0cvhigxxjegwldq.jpg'],
    description: '酥脆外皮 × 滑順內餡，奶香四溢的法式享受',
    content: '1. 外皮酥脆，內餡香濃滑順，層次豐富<br/>\n2. 採用法國進口奶油與天然香草籽製作<br/>\n3. 冷藏食用口感最佳，適合下午茶或送禮',
    quantity: 100,
    origin_price: 120,
    price: 100,
    isEnabled: true,
    unit: '顆',
    is_hottest: true,
    is_newest: true,
    notice: '1. 冷藏保存，建議三日內食用完畢<br/>\n2. 含奶製品與蛋製品，過敏者請留意<br/>\n3. 避免陽光直射與高溫環境',
    material: '法國奶油、雞蛋、麵粉、天然香草籽',
    size: '單顆裝（約6cm直徑）',
    origin: '日式匠心 × 法式工藝',
    category: {
      id: '1',
      name: '質感甜點系列',
      description: '甜點',
    },
    createdAt: '2021-01-01',
  }
  imgList.value = [product.value.image, ...product.value.imagesUrl]
    //imgList.value = [res.data.image, ...res.data.imagesUrl]
  } catch (err: any) {
    error.value = err.data?.message || '無法載入商品資訊'
  } finally {
    loading.value = false
  }
}

// 選擇圖片
const selectImage = (index: number) => {
  selectedImageIndex.value = index
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
  console.log(userId)
  if (!userId) {
    // 如果用戶未登入，導向登入頁面
    await navigateTo('/login')
    return
  }

  if (!product.value) return

  try {
    const response = await $fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        productId: product.value.id,
        quantity: quantity.value
      }
    })

    // 顯示成功訊息
    alert(`已成功加入購物車：${product.value.name} x ${quantity.value}`)
    
    // 重置數量為 1
    quantity.value = 1

  } catch (error: any) {
    console.error('加入購物車失敗:', error)
    
    // 顯示錯誤訊息
    const errorMessage = error.data?.message || '加入購物車失敗，請稍後再試'
    alert(errorMessage)
  }
}

// 格式化價格
const formatPrice = (price: number) => {
  return price.toLocaleString('zh-TW')
}

onMounted(() => {
  getProduct()
  
})
</script>

<template>
  <div class="pt-17 px-3 sm:px-12">
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

    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <!-- 錯誤訊息 -->
    <div v-else-if="error" class="text-center py-20">
      <div class="text-red-500 text-lg mb-4">{{ error }}</div>
      <button
        @click="getProduct"
        class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        重新載入
      </button>
    </div>

    <!-- 商品詳情 -->
    <div v-else-if="product" class="grid lg:grid-cols-2 gap-12">
      <!-- 商品圖片區域 -->
      <div class="space-y-4">
        <!-- 主要圖片 -->
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            :src="
              product.imagesUrl && product.imagesUrl.length > 0
                ? imgList[selectedImageIndex]
                : product.image
            "
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- 縮圖列表 -->
        <div
          v-if="product.imagesUrl && product.imagesUrl.length > 0"
          class="flex gap-2 overflow-x-auto"
        >
          <div
            v-for="(image, index) in imgList"
            :key="index"
            @click="selectImage(index)"
            class="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden cursor-pointer border-2 transition-colors"
            :class="
              selectedImageIndex === index
                ? 'border-primary'
                : 'border-transparent'
            "
          >
            <img
              :src="image"
              :alt="`${product.name} - 圖片 ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- 商品資訊區域 -->
      <div class="space-y-6">
        <!-- 商品標題 -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ product.name }}
          </h1>
          <div v-if="product.category" class="text-sm text-gray-500">
            分類：{{ product.category.name }}
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
            <div class="flex items-center border border-gray-300 rounded-md">
              <button
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 12h14"
                  />
                </svg>
              </button>
              <span class="px-4 py-2 min-w-[60px] text-center">{{
                quantity
              }}</span>
              <button
                @click="increaseQuantity"
                :disabled="quantity >= product.quantity"
                class="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
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
        <span class="mr-3 p-3 rounded-2 cursor-pointer transition-all duration-200"
        @click="detailType = 'content'"
        :class="detailType === 'content' ? 'bg-#fee2e2 text-primary' : 'bg-#ECECEC'"
        >產品說明</span>
        <span class="mr-3  p-3 rounded-2 cursor-pointer transition-all duration-200"
        @click="detailType = 'specification'"
        :class="detailType === 'specification' ? 'bg-#fee2e2 text-primary' : 'bg-#ECECEC'"
        >產品規格</span>
        <span class=" p-3 rounded-2 cursor-pointer transition-all duration-200"
        @click="detailType = 'notice'"
        :class="detailType === 'notice' ? 'bg-#fee2e2 text-primary' : 'bg-#ECECEC'"
        >注意事項</span>
      </div>
      <div class="max-w-none" v-if="detailType === 'content'">
        <div
          v-html="product.content"
          class="text-gray-700 leading-relaxed px-4 py-6 bg-white rounded-2"
        ></div>
      </div>
      <div class="max-w-none" v-if="detailType === 'specification'">

        <div
          v-html="product.notice"
          class="text-gray-700 leading-relaxed px-4 py-6 bg-white rounded-2"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>