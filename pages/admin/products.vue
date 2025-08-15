<script lang="ts" setup>
import { UploadFilled, Delete } from '@element-plus/icons-vue'
import type { UploadRawFile, FormInstance, FormRules } from 'element-plus'
import type { ApiResponse } from '~/types/api'
import type { Product } from '~/types/product'
import type { Category } from '~/types/category'
import adminAuth from '~/middleware/adminAuth'
import { toast } from 'vue3-toastify'
import { FetchError } from 'ofetch'
import type { UploadFile, UploadFiles } from 'element-plus'

definePageMeta({
  layout: 'admin',
  middleware: adminAuth
})



const token = useCookie('token')
const loadingStore = useLoadingStore()
const productDialogVisible = ref<boolean>(false)
const deleteDialogVisible = ref<boolean>(false)
const selectToDelete = ref<Product | null>(null)
const type = ref<'edit' | 'create'>('create')
const productList = ref<Product[]>([
  {
    id: '',
    name: '',
    description: '',
    image: '',
    imagesUrl: [],
    quantity: 1,
    price: 1,
    origin_price: 0,
    content: '',
    isEnabled: true,
    unit: '',
    is_hottest: false,
    is_newest: false,
    notice: '',
    material: '',
    size: '',
    style: '',
    category: '',
    createdAt: ''
  }
])

const categories = ref<Category[]>([])
const uploadFile = ref<UploadRawFile | null>(null)
const loading = ref<boolean>(false)
const selectedProductId = ref<string>('')

// 新增：多張圖片上傳相關變數
const multipleUploadFiles = ref<File[]>([])
const multipleUploadLoading = ref<boolean>(false)

const formRef = ref<FormInstance>()
const rules: FormRules<Product> = {
  name: [{ required: true, message: '請輸入名稱', trigger: 'blur' }],
  category: [{ required: true, message: '請選擇分類', trigger: 'blur' }],
  unit: [{ required: true, message: '請輸入單位', trigger: 'blur' }],
  price: [{ required: true, message: '請輸入售價', trigger: 'blur' }],
  description: [{ required: true, message: '請輸入描述', trigger: 'blur' }],
  content: [{ required: true, message: '請輸入內容', trigger: 'blur' }],
  quantity: [{ required: true, message: '請輸入數量', trigger: 'blur' }],
  image: [{ required: true, message: '請上傳圖片', trigger: 'blur' }],
  imagesUrl: [{ required: true, message: '請上傳圖片', trigger: 'blur' }]
}
const ruleForm = reactive<Product>({
  id: '',
  name: '',
  description: '',
  image: '',
  imagesUrl: [],
  quantity: 1,
  price: 1,
  origin_price: 0,
  content: '',
  category: '',
  unit: '',
  isEnabled: true,
  is_hottest: false,
  is_newest: false,
  notice: '',
  material: '',
  size: '',
  style: '',
})

const checkFileType = async (file: UploadRawFile) => {
  const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'

  if (!isJPGorPNG) {
    ElMessage({
      message: '只允許上傳 JPG 或 PNG 格式的圖片',
      type: 'error',
      duration: 3000
    })
    return
  }
  uploadFile.value = file
  await getImgUrl(file)
}

// 新增：防抖函數
const createDebounce = <
  TArgs extends unknown[],
  TReturn extends void
>(
  fn: (..._args: TArgs) => TReturn,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: TArgs): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const processMultipleFiles = async (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  const validFiles: File[] = []

  for (const fileObj of uploadFiles) {
    const file = (fileObj as any).raw || fileObj
    const isJPGorPNG =
      file.type === 'image/jpeg' || file.type === 'image/png'

    if (!isJPGorPNG) {
      ElMessage({
        message: `檔案 ${file.name} 格式不正確，只允許 JPG 或 PNG 格式`,
        type: 'error',
        duration: 3000
      })
      return
    }

    validFiles.push(file)
  }

  if (validFiles.length > 0) {
    multipleUploadFiles.value = validFiles
    await uploadMultipleImages(validFiles)
  }
}
// 新增：檢查多張圖片格式
const checkMultipleFileType = createDebounce(processMultipleFiles, 300)

const getImgUrl = async (file: File) => {
  loading.value = true
  try {
    const uploadResult = await useCloudinaryUpload(file)
    ruleForm.image = uploadResult
    loading.value = false
  } catch (error: unknown) {
    if(error instanceof Error)
    ElMessage({
      message: error.message || '圖片上傳失敗',
      type: 'error',
      duration: 3000
    })
    loading.value = false
  }
}

// 上傳多張圖片
const uploadMultipleImages = async (files: File[]) => {
  try {
    const uploadResults = await useCloudinaryUploadMultiple(files)
    ruleForm.imagesUrl = [...ruleForm.imagesUrl, ...uploadResults]

    ElMessage({
      message: `成功上傳 ${uploadResults.length} 張圖片`,
      type: 'success',
      duration: 3000
    })

    // 等待所有圖片載入完成
    // 等待所有圖片載入完成並釋放記憶體
    await Promise.all(
      uploadResults.map(
        (url) =>
          new Promise<void>((resolve) => {
            const img = new window.Image()

            const cleanup = () => {
              // 移除事件監聽器
              img.onload = null
              img.onerror = null
              // 清空圖片來源，釋放記憶體
              img.src = ''
              resolve()
            }

            img.onload = cleanup
            img.onerror = cleanup
            img.src = url
          })
      )
    )

    multipleUploadLoading.value = false
  } catch (error: unknown) {
    if(error instanceof Error)
    ElMessage({
      message: error.message || '多張圖片上傳失敗',
      type: 'error',
      duration: 3000
    })
    multipleUploadLoading.value = false
  }
}

// 新增：刪除單張圖片
const removeImage = (index: number) => {
  ruleForm.imagesUrl.splice(index, 1)
  ElMessage({
    message: '圖片已刪除',
    type: 'success',
    duration: 2000
  })
}

const editProduct = (row: Product) => {
  type.value = 'edit'
  selectedProductId.value = row.id
  ruleForm.name = row.name
  ruleForm.description = row.description
  ruleForm.image = row.image
  ruleForm.imagesUrl = [...row.imagesUrl] // 使用展開運算符複製陣列
  ruleForm.quantity = row.quantity
  ruleForm.price = row.price
  ruleForm.origin_price = row.origin_price
  ruleForm.category =
    typeof row.category === 'object' ? row.category.id : row.category
  ruleForm.unit = row.unit
  ruleForm.isEnabled = row.isEnabled
  ruleForm.content = row.content
  ruleForm.is_hottest = row.is_hottest
  ruleForm.is_newest = row.is_newest
  ruleForm.notice = row.notice
  ruleForm.material = row.material
  ruleForm.size = row.size
  ruleForm.style = row.style
  productDialogVisible.value = true
}
// 重置表單
const resetForm = () => {
  ruleForm.id = ''
  ruleForm.name = ''
  ruleForm.description = ''
  ruleForm.image = ''
  ruleForm.imagesUrl = []
  ruleForm.quantity = 1
  ruleForm.price = 1
  ruleForm.origin_price = 0
  ruleForm.category = ''
  ruleForm.unit = ''
  ruleForm.isEnabled = true
  ruleForm.content = ''
  ruleForm.is_hottest = false
  ruleForm.is_newest = false
  ruleForm.notice = ''
  ruleForm.material = ''
  ruleForm.size = ''
  ruleForm.style = ''
}
// 分頁相關
const { currentPage, pageSize, pagedData: pagedProducts } = usePagination<Product>(productList, 10)
// 取得分類資料
const fetchCategories = async () => {
  try {
    const response = await $fetch<ApiResponse<Category[]>>(
      '/api/admin/categories',
      {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    categories.value = response.data || []
  } catch (error: unknown) {
    if(error instanceof FetchError) {
      toast.error(`${error.data?.statusMessage}`)
    }
  } finally {
      loadingStore.hide()
    
  }
}

//取得商品資料
const fetchProducts = async () => {
  loadingStore.show()
  try {
    const res = await $fetch<ApiResponse<Product[]>>(
      '/api/admin/products',
      {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    if(res.data) {
      productList.value = res.data
    }
   
  } catch (error: unknown) {
    if(error instanceof FetchError) {
      toast.error(`${error.data?.statusMessage}`)
    }
  } finally {
 
      loadingStore.hide()
   
  }
}

const addProduct = async () => {
  loadingStore.show()
  try {
    const res = await $fetch<{ message: string}>(
      '/api/admin/product',
      {
        method: 'POST',
        body: {
          name: ruleForm.name,
          description: ruleForm.description,
          image: ruleForm.image,
          imagesUrl: ruleForm.imagesUrl,
          quantity: ruleForm.quantity,
          price: ruleForm.price,
          origin_price: ruleForm.origin_price,
          category: ruleForm.category,
          unit: ruleForm.unit,
          isEnabled: ruleForm.isEnabled,
          content: ruleForm.content,
          is_hottest: ruleForm.is_hottest,
          is_newest: ruleForm.is_newest,
          notice: ruleForm.notice,
          material: ruleForm.material,
          size: ruleForm.size,
          style: ruleForm.style
        },
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    if (res) {
      productDialogVisible.value = false
      resetForm()
      ElMessage({
        message: res.message,
        type: 'success',
        duration: 2000
      })
      // 重新取得產品列表
      await fetchProducts()
    }
  } catch (error: unknown) {
    if(error instanceof FetchError) {
      toast.error(`${error.data?.statusMessage}`)
    }
  } finally {
      loadingStore.hide()
  
  }
}

const updateProduct = async () => {
  loadingStore.show()
  try {
    const res = await $fetch<ApiResponse<Product>>(
      '/api/admin/product',
      {
        method: 'PUT',
        body: {
          id: selectedProductId.value,
          name: ruleForm.name,
          description: ruleForm.description,
          image: ruleForm.image,
          imagesUrl: ruleForm.imagesUrl,
          quantity: ruleForm.quantity,
          price: ruleForm.price,
          origin_price: ruleForm.origin_price,
          category: ruleForm.category,
          unit: ruleForm.unit,
          isEnabled: ruleForm.isEnabled,
          content: ruleForm.content,
          is_hottest: ruleForm.is_hottest,
          is_newest: ruleForm.is_newest,
          notice: ruleForm.notice,
          material: ruleForm.material,
          size: ruleForm.size,
          style: ruleForm.style
        },
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    if (res) {
      productDialogVisible.value = false
      resetForm()
      ElMessage({
        message: res.message,
        type: 'success',
        duration: 2000
      })
      // 重新取得產品列表
      await fetchProducts()
    }
  } catch (error: unknown) {
    if(error instanceof FetchError) {
      toast.error(`${error.data?.statusMessage}`)
    }
  } finally {
 
      loadingStore.hide()
   
  }
}

// 刪除產品
const deleteProduct = async () => {
  if (!selectToDelete.value) return
  loadingStore.show()
  try {
    const res = await $fetch<{ message: string }>('/api/admin/product', {
      method: 'DELETE',
      body: {
        id: selectToDelete.value.id
      },
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (res) {
      deleteDialogVisible.value = false
      selectToDelete.value = null
      ElMessage({
        message: res.message,
        type: 'success',
        duration: 2000
      })
      // 重新取得產品列表
      await fetchProducts()
    }
  } catch (error: unknown) {
    if(error instanceof FetchError) {
      toast.error(`${error.data?.statusMessage}`)
    }
  } finally {

      loadingStore.hide()
  
  }
}
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (type.value === 'edit') {
        updateProduct()
      } else {
        addProduct()
      }
    }
  })
}

// 頁面載入時取得分類資料
onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
  <el-container class="bg-white m-4 rounded-3">
    <div class="w-full">
      <div class="p-6">
        <h1 class="text-8">產品管理</h1>
        <div class="flex justify-end">
          <button
            class="h-10 bg-blue-light hover:bg-blue-dark text-white px-4 rounded-2 border-0 cursor-pointer transition-all duration-200"
            @click="
              () => {
                resetForm()
                productDialogVisible = true
                type = 'create'
              }
            "
          >
            新增產品
          </button>
        </div>
        <el-table :data="pagedProducts" class="mt-6">
          <el-table-column label="No" width="60">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="主圖" width="105">
            <template #default="scope">
              <img
                :src="scope.row.image"
                alt="商品圖片"
                class="w-20 h-20 object-cover"
              />
            </template>
          </el-table-column>
          <el-table-column label="名稱" prop="name" width="170">
            <template #default="scope">
              <div class="flex flex-col">
                <span>{{ scope.row.name }}</span>
                <div class="flex gap-2 mt-2">
                  <span
                    v-if="scope.row.is_newest"
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
                    v-if="scope.row.is_hottest"
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
            </template>
          </el-table-column>
          <el-table-column
            label="原價"
            prop="origin_price"
            width="80"
          ></el-table-column>
          <el-table-column
            label="售價"
            prop="price"
            width="80"
          ></el-table-column>
          <el-table-column
            label="數量"
            prop="quantity"
            width="60"
          ></el-table-column>
          <el-table-column label="是否啟用">
            <template #default="scope">
              <div class="flex flex-col gap-1">
                <el-tag v-if="scope.row.isEnabled" type="success"
                  >已啟用</el-tag
                >
                <el-tag v-else type="danger">未啟用</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170">
            <template #default="scope">
              <div class="flex">
                <button
                  class="hover:bg-blue-light bg-white text-blue-light border border-blue-light border-solid hover:text-white rounded-2 w-16 h-10 cursor-pointer transition-all duration-200 mr-2"
                  @click="editProduct(scope.row)"
                >
                  編輯
                </button>
                <button
                  class="hover:bg-alert bg-white text-alert border border-alert border-solid hover:text-white rounded-2 w-16 h-10 cursor-pointer transition-all duration-200"
                  @click="
                    () => {
                      deleteDialogVisible = true
                      selectToDelete = scope.row
                    }
                  "
                >
                  刪除
                </button>
              </div>
            </template>
          </el-table-column>
        </el-table>
         <!-- 分頁 -->
         <div class="flex justify-center mt-6">
          <Pagination
            :total="productList.length"
            :page-size="pageSize"
            v-model:currentPage="currentPage"
          />
        </div>

        <el-dialog
          :title="`${type === 'edit' ? '編輯' : '新增'}產品`"
          v-model="productDialogVisible"
          width="700"
          :modal="false"
        >
          <div>
            <el-form ref="formRef" :model="ruleForm" :rules="rules">
              <div class="grid md:grid-cols-2 gap-4">
                <el-form-item
                  label="品名"
                  prop="name"
                  class="col-span-2 flex flex-col items-start"
                >
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item
                  label="主要圖片"
                  prop="image"
                  class="flex flex-col items-start"
                >
                  <el-upload
                    v-loading="loading"
                    v-if="ruleForm.image === ''"
                    class="w-full"
                    drag
                    multiple
                    :before-upload="checkFileType"
                    action="#"
                  >
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                      將圖片拖曳到此處，<em>或點擊以上傳</em>
                    </div>
                  </el-upload>
                  <div v-else v-loading="loading" class="flex flex-col">
                    <img
                      class="max-w-full block"
                      :src="ruleForm.image"
                      alt="產品圖片"
                    />
                    <div class="flex justify-end">
                      <el-upload
                        multiple
                        :before-upload="checkFileType"
                        action="#"
                        class="mt-4"
                      >
                        <button
                          @click.prevent=""
                          class="bg-blue h-10 px-4 text-white rounded-2 font-600 cursor-pointer"
                        >
                          選擇其他圖片
                        </button>
                      </el-upload>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item
                  label="其他圖片"
                  prop="imagesUrl"
                  class="flex flex-col items-start"
                >
                  <div class="w-full">
                    <!-- 已上傳的圖片列表 -->
                    <div
                      class="flex flex-col w-full"
                      v-if="
                        ruleForm.imagesUrl.length > 0 && !multipleUploadLoading
                      "
                      v-loading="multipleUploadLoading"
                    >
                      <div
                        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      >
                        <div
                          v-for="(imageUrl, index) in ruleForm.imagesUrl"
                          :key="index"
                          class="relative group"
                        >
                          <img
                            :src="imageUrl"
                            :alt="`產品圖片 ${index + 1}`"
                            class="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <div
                            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center"
                          >
                            <el-button
                              type="danger"
                              size="small"
                              circle
                              class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              @click="removeImage(index)"
                            >
                              <el-icon><delete /></el-icon>
                            </el-button>
                          </div>
                        </div>
                      </div>
                      <button
                        @click.prevent=""
                        class="bg-blue h-10 px-4 text-white rounded-2 font-600 cursor-pointer"
                      >
                        上傳更多圖片
                      </button>
                    </div>

                    <!-- 多張圖片上傳區域 -->
                    <el-upload
                      v-else
                      v-loading="multipleUploadLoading"
                      class="w-full"
                      drag
                      multiple
                      :before-upload="
                        () => {
                          multipleUploadLoading = true
                          return false
                        }
                      "
                      :on-change="checkMultipleFileType"
                      action="#"
                      :show-file-list="false"
                    >
                      <el-icon class="el-icon--upload"
                        ><upload-filled
                      /></el-icon>
                      <div class="el-upload__text">
                        將多張圖片拖曳到此處，<em>或點擊以上傳</em>
                      </div>
                      <template #tip>
                        <div class="el-upload__tip">
                          支援 JPG/PNG 格式，可同時選擇多張圖片
                        </div>
                      </template>
                    </el-upload>
                  </div>
                </el-form-item>
                <el-form-item
                  label="分類"
                  prop="category"
                  class="flex flex-col items-start"
                >
                  <el-select
                    v-model="ruleForm.category"
                    placeholder="請選擇分類"
                  >
                    <el-option
                      v-for="category in categories"
                      :key="category.id"
                      :label="category.name"
                      :value="category.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="單位"
                  prop="unit"
                  class="flex flex-col items-start"
                >
                  <el-input v-model="ruleForm.unit"></el-input>
                </el-form-item>
                <el-form-item label="原價" class="flex flex-col items-start">
                  <el-input-number
                    v-model="ruleForm.origin_price"
                    :min="0"
                    :max="100000"
                    :step="1"
                  />
                </el-form-item>
                <el-form-item
                  label="售價"
                  prop="price"
                  class="flex flex-col items-start"
                >
                  <el-input-number
                    v-model="ruleForm.price"
                    :min="0"
                    :max="100000"
                    :step="1"
                  />
                </el-form-item>
                <el-form-item
                  label="數量"
                  prop="quantity"
                  class="flex flex-col items-start"
                >
                  <el-input-number
                    v-model="ruleForm.quantity"
                    :min="1"
                    :max="10000"
                    :step="1"
                  />
                </el-form-item>
                <el-form-item label="最熱門" class="flex flex-col items-start">
                  <el-switch v-model="ruleForm.is_hottest" />
                </el-form-item>
                <el-form-item label="最新" class="flex flex-col items-start">
                  <el-switch v-model="ruleForm.is_newest" />
                </el-form-item>
                <el-form-item label="啟用" class="flex flex-col items-start">
                  <el-switch v-model="ruleForm.isEnabled" />
                </el-form-item>
                <el-form-item
                  label="描述"
                  prop="description"
                  class="flex flex-col items-start col-span-2"
                >
                  <el-input
                    type="textarea"
                    :rows="5"
                    placeholder="請輸入描述"
                    class="textarea"
                    v-model="ruleForm.description"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="內容"
                  prop="content"
                  class="flex flex-col items-start col-span-2"
                >
                  <el-input
                    type="textarea"
                    :rows="5"
                    placeholder="請輸入內容"
                    class="textarea"
                    v-model="ruleForm.content"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="注意事項"
                  class="flex flex-col items-start col-span-2"
                >
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="請輸入注意事項"
                    class="textarea"
                    v-model="ruleForm.notice"
                  ></el-input>
                </el-form-item>
                <el-form-item label="材質" class="flex flex-col items-start">
                  <el-input
                    v-model="ruleForm.material"
                    placeholder="請輸入材質"
                  ></el-input>
                </el-form-item>
                <el-form-item label="尺寸" class="flex flex-col items-start">
                  <el-input
                    v-model="ruleForm.size"
                    placeholder="請輸入尺寸"
                  ></el-input>
                </el-form-item>
                <el-form-item label="風格" class="flex flex-col items-start">
                  <el-input
                    v-model="ruleForm.style"
                    placeholder="請輸入風格"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form>
            <div class="flex justify-end mt-4">
              <button
                class="h-10 px-4 cursor-pointer"
                @click="productDialogVisible = false"
              >
                取消
              </button>
              <button
                class="h-10 px-4 ml-2 cursor-pointer"
                @click="handleSubmit"
              >
                確定
              </button>
            </div>
          </div>
        </el-dialog>

        <!-- 刪除確認對話框 -->
        <el-dialog
          title="確認刪除"
          v-model="deleteDialogVisible"
          width="400"
          :modal="false"
        >
          <div>
            <p>確定要刪除產品「{{ selectToDelete?.name }}」嗎？</p>
            <p class="text-red-500 text-sm mt-2">此操作無法復原</p>
          </div>
          <template #footer>
            <div class="flex justify-end">
              <button
                class="h-10 px-4 cursor-pointer"
                @click="deleteDialogVisible = false"
              >
                取消
              </button>
              <button
                class="h-10 px-4 ml-2 bg-red text-white font-600 cursor-pointer"
                @click="deleteProduct"
              >
                確定刪除
              </button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
  </el-container>
</template>

<style lang="scss" scoped>
:deep() {
  .el-form-item__content {
    width: 100%;
  }

  .el-form-item {
    margin: 0;
  }

  .el-input,
  .el-textarea,
  .el-date-editor,
  .el-input__inner {
    width: 100%;
    height: 50px;
  }

  .textarea.el-textarea {
    height: 115px;
  }
  .el-upload-list__item {
    display: none;
  }
}
</style>
