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

const productsList = ref<Product[]>([])
const categoryList = ref<Category[]>([])
const filteredProducts = ref<Product[]>([])
const selectedCategoryId = ref<string>('all')

const getProducts = async () => {
  const res = await $fetch<ApiResponse<Product>>('/api/admin/products')
  console.log(res)
  productsList.value = res.data
  filterProducts()
}

const getCategories = async () => {
  const res = await $fetch<ApiResponse<Category>>('/api/admin/categories')
  console.log(res)
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
    <div class="grid md:grid-cols-4 gap-6">
      <div class="flex flex-col col-span-1">
        <h3>產品分類</h3>
        <div class="flex sm:block">
          <div class="mr-2 sm:mr-0" @click="selectedCategoryId = 'all'">
            <span
              class="category-item hover:bg-red-100 text-red block w-full my-2 p-2 cursor-pointer rounded-2 whitespace-nowrap"
              :class="{ active: selectedCategoryId === 'all' }"
              >全部產品</span
            >
          </div>
          <div
            v-for="category in categoryList"
            :key="category.id"
            class="mr-4 sm:mr-0"
            @click="selectedCategoryId = category.id"
          >
            <span
              class="category-item hover:bg-red-100 text-red block w-full my-2 p-2 cursor-pointer rounded-2 whitespace-nowrap"
              :class="{ active: selectedCategoryId === category.id }"
              >{{ category.name }}</span
            >
          </div>
        </div>
      </div>
      <div class="col-span-3">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card border border-solid border-gray-200 rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              class="product-card-image w-full object-cover block"
              :src="product.image"
              alt="商品圖片"
            />
            <div class="flex flex-col p-4">
              <span class="text-5 font-bold">{{ product.name }}</span>
              <p class="text-primary">$ {{ product.price }}</p>
              <button
                class="flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary bg-transparent border border-solid border-primary px-4 py-2 rounded-2 cursor-pointer"
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
