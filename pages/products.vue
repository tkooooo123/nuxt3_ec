<script lang="ts" setup>
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
  is_hottest: boolean
  is_newest: boolean
  unit: string
  category: {
    id: string
    name: string
    description: string
  } | null
  createdAt: string
}

interface Category {
  id: string
  name: string
  description: string
}

interface ApiResponse<T> {
  message: string
  data: T[]
}

const router = useRouter()
const productsList = ref<Product[]>([])
const categoryList = ref<Category[]>([])
const filteredProducts = ref<Product[]>([])
const selectedCategoryId = ref<string>('all')

const { addToCart } = useCart()

const getProducts = async () => {
  const res = await $fetch<ApiResponse<Product>>('/api/admin/products')
  productsList.value = res.data
  filterProducts()
}

const getCategories = async () => {
  const res = await $fetch<ApiResponse<Category>>('/api/admin/categories')
  categoryList.value = res.data
}

// 過濾產品函數
const filterProducts = () => {
  if (selectedCategoryId.value === 'all') {
    filteredProducts.value = productsList.value
  } else {
    filteredProducts.value = productsList.value.filter(
      (product) => product.category?.id === selectedCategoryId.value
    )
  }
}
//加入購物車
// const addToCart = async (productId: string) => {
//   try {
//     const response = await $fetch('/api/cart', {
//     headers: {
//       'Authorization': `Bearer ${token.value}`
//     },
//     method: 'POST',
//     body: { productId, quantity: 1 }
//   })

//   console.log(response)
//   // 顯示成功訊息
//   alert(`已成功加入購物車`)
//   } catch (error) {
//     console.error('加入購物車失敗:', error)
//   }

// }
// 監聽分類選擇變化
watch(selectedCategoryId, () => {
  filterProducts()
})

onMounted(() => {
  getProducts()
  getCategories()
})
</script>

<template>
  <div class="pt-17 px-12">
    <div class="flex mt-6 mb-12">
      <span>首頁</span>
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
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>

      <span>產品</span>
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
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>

      <span>全部</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="flex flex-col col-span-1">
        <h3>產品分類</h3>
        <div class="flex md:block">
          <div
            class="category-item hover:bg-red-100 text-red md:w-full mr-2 md:mr-0 my-2 p-2 cursor-pointer rounded-2 whitespace-nowrap"
            :class="{ active: selectedCategoryId === 'all' }"
            @click="selectedCategoryId = 'all'"
          >
            全部產品
          </div>
          <div
            v-for="category in categoryList"
            :key="category.id"
            class="category-item hover:bg-red-100 text-red md:w-full mr-2 md:mr-0 my-2 p-2 cursor-pointer rounded-2 whitespace-nowrap"
            :class="{ active: selectedCategoryId === category.id }"
            @click="selectedCategoryId = category.id"
          >
            {{ category.name }}
          </div>
        </div>
      </div>
      <div class="col-span-3">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            @click="router.push(`/product/${product.id}`)"
            class="product-card border border-solid border-gray-200 rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer relative"
          >
            <div class="overflow-hidden">
              <img
                class="product-card-image w-full object-cover block"
                :src="product.image"
                alt="商品圖片"
              />
            </div>
            <div class="flex flex-col p-4">
              <span class="text-5 font-bold">{{ product.name }}</span>
              <p class="text-primary">$ {{ product.price }}</p>
              <button
                class="flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary bg-transparent border border-solid border-primary px-4 py-2 rounded-2 cursor-pointer"
                @click.stop="addToCart(product.id, 1)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6 mr-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                加入購物車
              </button>
            </div>
            <div class="absolute top-3 left-3 flex gap-3">
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
          </div>
        </div>
        <!-- 當沒有產品時顯示提示 -->
        <div v-if="filteredProducts.length === 0" class="text-center py-8">
          <p class="text-gray-500">該分類下暫無產品</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.category-item {
  transition: all 0.3s ease-in-out;

  &.active {
    background: #fee2e2;
  }
}
.product-card {
  .product-card-image {
    transition: transform 0.3s ease-in-out;
  }

  &:hover {
    .product-card-image {
      transform: scale(1.05);
    }
  }
}
</style>
