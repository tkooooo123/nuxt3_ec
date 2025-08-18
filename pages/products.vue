<script lang="ts" setup>
import { toast } from 'vue3-toastify'
import type { ApiResponse } from '~/types/api'
import type { Product, ProductsResponse } from '~/types/product'
import type { Category } from '~/types/category'
import { FetchError } from 'ofetch'

const loadingStore = useLoadingStore()
const router = useRouter()
const route = useRoute()
const productsList = ref<Product[]>([])
const categoryList = ref<Category[]>([])
const filteredProducts = ref<Product[]>([])
const selectedCategoryId = ref<string>('all')
const selectedTheme = ref<string[]>([]) //主題篩選
const keyword = ref<string>('') //搜尋關鍵字
const { addToCart } = useCart()

const getProducts = async () => {
 try {
   const res = await $fetch<ApiResponse<ProductsResponse>>('/api/product/all')
    productsList.value = res.data?.products ?? [];
   filterProducts()
 } catch (error: unknown) {
    if(error instanceof FetchError) {
      toast.error(`${error.data?.statusMessage}`)
    }
 }
}

const getCategories = async () => {
  loadingStore.show()
 try {
   const res = await $fetch<ApiResponse<Category[]>>('/api/category/all')
   categoryList.value = res.data ||[]
   await  getProducts()
 } catch (error: unknown) {
    if(error instanceof FetchError) {
      toast.error(`${error.data?.statusMessage}`)
    }
 } finally {
  loadingStore.hide()
 }
}

// 過濾產品函數
const filterProducts = () => {
  // 先依分類過濾
  let tempProducts =
    selectedCategoryId.value === 'all'
      ? productsList.value
      : productsList.value.filter(
          (product) => typeof product.category === 'object'&& product.category?.id === selectedCategoryId.value
        )

  // 再依主題過濾（且邏輯）
  if (selectedTheme.value.length > 0) {
    tempProducts = tempProducts.filter((product) => {
      // 必須所有勾選的主題都符合
      return selectedTheme.value.every((theme) => {
        if (theme === 'is_newest') return product.is_newest
        if (theme === 'is_hottest') return product.is_hottest
        return false
      })
    })
  }
  if (route.query.search) {
    if (route.query.search) {
      const search = String(route.query.search).toLowerCase()
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search)
      )
    }
  }

  filteredProducts.value = tempProducts
}
const handleSearch = () => {
  const trimmed = keyword.value.trim()
  if (!trimmed) return // 若輸入是空白或空值就不執行搜尋

  navigateTo(`/products?search=${encodeURIComponent(trimmed)}`)
}

// 監聽分類選擇變化
watch(selectedCategoryId, () => {
  filterProducts()
})
watch(
  () => route.query.search,
  () => {
    filterProducts()
  }
)
onMounted(() => {
  if (route.query.topic) {
    selectedTheme.value = [route.query.topic as string]
  }
  getCategories()
})
</script>

<template>
  <div class="py-17 px-12">
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

    <div class="grid grid-cols-1 md:grid-cols-4 gap-y-6 md:gap-x-6">
      <div class="flex flex-col col-span-1">
        <el-input
          class="max-w-120"
          placeholder="搜尋商品"
          v-model="keyword"
          @keydown.enter="handleSearch"
        ></el-input>
        <h3>產品分類</h3>
        <div class="flex md:block">
          <div
            class="category-item hover:bg-red-100 text-red mr-2 md:mr-0 my-2 p-2 cursor-pointer rounded-2 whitespace-nowrap"
            :class="{ active: selectedCategoryId === 'all' }"
            @click="selectedCategoryId = 'all'"
          >
            全部產品
          </div>
          <div
            v-for="category in categoryList"
            :key="category.id"
            class="category-item hover:bg-red-100 text-red mr-2 md:mr-0 my-2 p-2 cursor-pointer rounded-2 whitespace-nowrap"
            :class="{ active: selectedCategoryId === category.id }"
            @click="selectedCategoryId = category.id"
          >
            {{ category.name }}
          </div>
        </div>
        <h3>主題篩選</h3>
        <el-checkbox-group
          v-model="selectedTheme"
          @change="filterProducts"
          class="flex md:flex-col"
        >
          <el-checkbox
            label="新品報到"
            value="is_newest"
            class="p-2 rounded-2 hover:bg-red-100 transition-all duration-300 md:mb-2"
          >
          </el-checkbox>
          <el-checkbox
            label="熱銷排行"
            value="is_hottest"
            class="p-2 rounded-2 hover:bg-red-100 transition-all duration-300 md:mb-2"
          >
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="col-span-3">
        <!-- 當沒有產品時顯示提示 -->
        <div>
          <!-- 有搜尋關鍵字時 -->
          <template v-if="route.query.search">
            <div class="flex flex-col">
              <span class="text-primary font-500 text-7"
                >關鍵字搜尋結果：{{ route.query.search }}</span
              >
              <span class="mt-6 mb-2" v-if="filteredProducts.length !== 0"
                >共{{ filteredProducts.length }}項「{{
                  route.query.search
                }}」商品</span
              >
              <div
                v-if="filteredProducts.length === 0"
                class="text-center py-8"
              >
                <p class="text-gray-500 text-6">查無相關商品</p>
              </div>
            </div>
          </template>
          <!-- 無搜尋關鍵字但有分類或主題篩選時 -->
          <template
            v-else-if="selectedCategoryId !== 'all' || selectedTheme.length > 0"
          >
            <div v-if="filteredProducts.length === 0" class="text-center py-8">
              <p class="text-gray-500">該分類/主題下暫無產品</p>
            </div>
          </template>
          <!-- 無任何篩選時 -->
          <template v-else>
            <div v-if="filteredProducts.length === 0" class="text-center py-8">
              <p class="text-gray-500">暫無產品</p>
            </div>
          </template>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            @click="router.push(`/product/${product.id}`)"
            class="product-card border border-solid border-gray-200 rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer relative"
          >
            <div class="overflow-hidden">
              <img
                class="product-card-image w-full  object-cover aspect-1 block"
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
:deep() {
  .el-checkbox__inner {
    zoom: 1.2;
  }
  .el-checkbox {
    --el-checkbox-checked-text-color: #f87171;
    --el-checkbox-checked-input-border-color: #f87171;
    --el-checkbox-checked-bg-color: #f87171;
    --el-checkbox-input-border-color-hover: #f87171;
    margin-right: 8px;
    @media (min-width: 768px) {
      margin-right: 0;
    }
  }
  .el-checkbox {
    .el-checkbox__label {
      transition: color 0.3s ease-in-out;
    }

    &:hover {
      .el-checkbox__label {
        color: #f87171;
      }
    }
    &.is-checked {
      background: #fee2e2;
    }
  }
  .el-input {
    --el-input-focus-border-color: #f87171;
  }
  .el-input__inner {
    height: 40px;
  }
}
</style>
