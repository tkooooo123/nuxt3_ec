<script lang="ts" setup>
import { UploadFilled, Delete } from '@element-plus/icons-vue'
import type { UploadRawFile, FormInstance, FormRules } from 'element-plus'

definePageMeta({
  layout: 'admin'
})
interface product {
  id: string
  name: string
  description: string
  image: string
  imagesUrl: string[]
  quantity: number
  price: number
  content: string
  isEnabled: boolean
  unit: string
  category: string
}

interface category {
  id: string
  name: string
  description: string
}

const productDialogVisible = ref<boolean>(false)
const type = ref<'edit' | 'create'>('create')
const productList = ref<product[]>([
  {
    id: '',
    name: '',
    description: '',
    image: '',
    imagesUrl: [],
    quantity: 1,
    price: 1,
    content: '',
    isEnabled: true,
    unit: '',
    category: ''
  }
])

const categories = ref<category[]>([])
const uploadFile = ref<UploadRawFile | null>(null)
const loading = ref<boolean>(false)
const selectedProductId = ref<string>('')

// 新增：多張圖片上傳相關變數
const multipleUploadFiles = ref<File[]>([])
const multipleUploadLoading = ref<boolean>(false)

const formRef = ref<FormInstance>()
const rules: FormRules<product> = {
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
const ruleForm = reactive<product>({
  id: '',
  name: '',
  description: '',
  image: '',
  imagesUrl: [],
  quantity: 1,
  price: 1,
  content: '',
  category: '',
  unit: '',
  isEnabled: true
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
const createDebounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

const processMultipleFiles = async (file: any, fileList: any[]) => {
  const validFiles: File[] = []

  for (const uploadFile of fileList) {
    const fileObj = uploadFile.raw || uploadFile
    const isJPGorPNG =
      fileObj.type === 'image/jpeg' || fileObj.type === 'image/png'

    if (!isJPGorPNG) {
      ElMessage({
        message: `檔案 ${fileObj.name} 格式不正確，只允許 JPG 或 PNG 格式`,
        type: 'error',
        duration: 3000
      })
      return
    }

    validFiles.push(fileObj)
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
  } catch (error: any) {
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
  } catch (error: any) {
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

// 取得分類資料
const fetchCategories = async () => {
  try {
    const response = await $fetch<{ message: string; data: any[] }>(
      '/api/admin/categories'
    )
    categories.value = response.data
  } catch (error) {
    console.error('取得分類資料失敗:', error)
  }
}

const fetchProducts = async () => {
  const res = await $fetch<{ message: string; data: any[] }>(
    '/api/admin/products'
  )
  productList.value = res.data
}

// 頁面載入時取得分類資料
onMounted(() => {
  fetchCategories()
  fetchProducts()
})

const handleSubmit = () => {
  formRef.value?.validate((valid) => {
        if (valid) {
           console.log(123,ruleForm)
           addProduct()
        }
    })
}
const addProduct = async()=>{
  try {
    const res = await $fetch<{ message: string; data: any[] }>(
      '/api/admin/product',
      {
        method: 'POST',
        body: {
          ...ruleForm
        }
      }
    )
   if(res) {
    productDialogVisible.value = false
    ElMessage({
      message: res.message,
      type: 'success',
      duration: 2000
    })
   }
  } catch (error) {
    console.error('新增產品失敗:', error)
  }
}
</script>

<template>
  <el-container>
    <div class="p-6 w-full">
      <h1>Test</h1>
      <div class="flex justify-end">
        <button
          class="h-10 px-4 rounded-2 border-0 cursor-pointer"
          @click="
            () => {
              productDialogVisible = true
              type = 'create'
            }
          "
        >
          新增
        </button>
      </div>
      <el-table :data="productList" class="mt-6">
        <el-table-column label="名稱" prop="name"></el-table-column>
      </el-table>

      <el-dialog
        :title="`${type === 'edit' ? '編輯' : '新增'}`"
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
                   <div class="flex flex-col w-full"
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
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
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
                <el-select v-model="ruleForm.category" placeholder="請選擇分類">
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
                <el-input></el-input>
              </el-form-item>
              <el-form-item
                label="售價"
                prop="price"
                class="flex flex-col items-start"
              >
                <el-input v-model="ruleForm.price"></el-input>
              </el-form-item>
              <el-form-item  label="數量"
                prop="quantity"
                class="flex flex-col items-start">
                <el-input-number v-model="ruleForm.quantity" :min="1" :max="10000" :step="1" />

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
            </div>
          </el-form>
          <div class="flex justify-end mt-4">
            <button class="h-10 px-4 cursor-pointer" @click="productDialogVisible = false">
              取消
            </button>
            <button class="h-10 px-4 ml-2 cursor-pointer" @click="handleSubmit">確定</button>
          </div>
        </div>
      </el-dialog>
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