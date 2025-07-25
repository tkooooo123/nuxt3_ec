<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadRawFile, FormInstance, FormRules } from 'element-plus'
import adminAuth from '~/middleware/adminAuth'

definePageMeta({
  layout: 'admin',
  middleware: adminAuth
})
interface tagItem {
  id: string
  name: string
}
interface article {
  id: string
  title: string
  author: string
  is_public: boolean
  tags: string[]
  content: string
  date: string
  imageUrl: string
}
interface articleRuleForm {
  title: string
  author: string
  is_public: boolean
  tags: tagItem[]
  content: string
  date: string
  imageUrl: string
}
const token = useCookie('token')
const articleDialogVisible = ref<boolean>(false)
const deleteDialogVisible = ref<boolean>(false)
const type = ref<'edit' | 'create'>('create')
const articleList = ref<article[]>([
  {
    id: '',
    title: '',
    author: '',
    content: '',
    tags: [],
    is_public: true,
    date: '',
    imageUrl: ''
  }
])
const rules: FormRules<articleRuleForm> = {
  title: [{ required: true, message: '請輸入標題', trigger: 'blur' }],
  author: [{ required: true, message: '請輸入作者', trigger: 'blur' }],
  content: [{ required: true, message: '請輸入內容', trigger: 'blur' }],
  is_public: [{ required: true, message: '請選擇是否公開', trigger: 'blur' }],
  date: [{ required: true, message: '請選擇公告日期', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '請選擇圖片', trigger: 'blur' }],
  tags: [{ required: true, message: '請新增標籤', trigger: 'blur' }]
}
const formRef = ref<FormInstance>()
const uploadFile = ref<UploadRawFile | null>(null)
const loading = ref<boolean>(false)
const selectedArticleId = ref<string>('')
const selectToDelete = ref<article | null>(null)
const ruleForm = reactive<articleRuleForm>({
  title: '',
  author: '',
  content: '',
  tags: [],
  is_public: true,
  date: new Date().toString(),
  imageUrl: ''
})

const inputTag = ref<string>('')

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

const getImgUrl = async (file: File) => {
  loading.value = true
  try {
    const uploadResult = await useCloudinaryUpload(file)
    ruleForm.imageUrl = uploadResult
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

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
const addTag = () => {
  const name = inputTag.value.trim()
  if (name) {
    ruleForm.tags.push({
      id: generateId(),
      name
    })
    inputTag.value = ''
  }
}
const removeTag = (id: string) => {
  ruleForm.tags = ruleForm.tags.filter((tag) => tag.id !== id)
}
const formatDateString = (dateStr: string): string => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份從 0 開始
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

const parseDateString = (str: string): string => {
  const year = parseInt(str.slice(0, 4), 10)
  const month = parseInt(str.slice(4, 6), 10) - 1 // 月份從 0 開始
  const day = parseInt(str.slice(6, 8), 10)

  const date = new Date(year, month, day)
  return date.toString()
}
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      createArticle()
    }
  })
}
const getArticles = async () => {
  try {
    const { data } = await $fetch<{ data: article[] }>('/api/admin/articles', {
      headers: {
          Authorization: `Bearer ${token.value}`
      }
    })
    if (data) {
      articleList.value = data
    }
  } catch (error) {
    console.log(error)
  }
}
const createArticle = async () => {
  try {
    const params = {
      title: ruleForm.title,
      author: ruleForm.author,
      tags: ruleForm.tags.map((item: tagItem) => item.name),
      content: ruleForm.content,
      is_public: ruleForm.is_public,
      date: formatDateString(ruleForm.date),
      imageUrl: ruleForm.imageUrl,
      id: type.value === 'edit' ? selectedArticleId.value : null
    }
    const data = await $fetch('/api/admin/article', {
      method: type.value === 'edit' ? 'PUT' : 'POST',
      body: params
    })
    ElMessage({
      type: 'success',
      message: data?.message
    })
    getArticles()
    articleDialogVisible.value = false
  } catch (error) {
    console.log(error)
    articleDialogVisible.value = false
  }
}
const editArticle = (item: article) => {
  type.value = 'edit'
  selectedArticleId.value = item.id
  ruleForm.title = item.title
  ruleForm.author = item.author
  ruleForm.imageUrl = item.imageUrl
  ruleForm.is_public = item.is_public
  ruleForm.content = item.content
  ruleForm.tags = item.tags.map((item: string) => {
    return {
      id: generateId(),
      name: item
    }
  })
  ruleForm.date = parseDateString(item.date)
  articleDialogVisible.value = true
}

const handleDelete = async () => {
  try {
    const res = await $fetch(`/api/admin/article`, {
      method: 'DELETE',
      body: {
        id: selectToDelete.value?.id
      }
    })

    ElMessage.success(res.message || '刪除成功')

    // 關閉 dialog 並重置選擇
    await getArticles()

    deleteDialogVisible.value = false
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getArticles()
})
</script>

<template>
  <el-container>
    <div class="p-6 w-full">
      <h1>文章管理</h1>
      <div class="flex justify-end">
        <button
          class="h-10 px-4 rounded-2 border-0 cursor-pointer"
          @click="
            () => {
              articleDialogVisible = true
              type = 'create'
            }
          "
        >
          新增
        </button>
      </div>
      <div></div>
      <el-table :data="articleList" class="mt-6">
        <el-table-column label="No" width="50">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="標題"
          prop="title"
          width="180"
        ></el-table-column>
        <el-table-column
          label="作者"
          prop="author"
          width="120"
        ></el-table-column>
        <el-table-column label="標籤" width="120">
          <template #default="scope">
            <div class="flex">
              <span v-for="tag in scope.row.tags" class="mx-1">
                {{ tag }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="內容" prop="content"></el-table-column>
        <el-table-column
          label="發布日期"
          width="120"
          prop="date"
        ></el-table-column>
        <el-table-column label="是否公開" width="90">
          <template #default="scope">
            <span v-if="scope.row.is_public">已公開</span>
            <span v-else>未公開</span>
          </template>
        </el-table-column>
        <el-table-column label="動作">
          <template #default="scope">
            <div class="flex">
              <button
                class="h-10 px-4 bg-yellow font-600 rounded-2 cursor-pointer"
                @click="editArticle(scope.row)"
              >
                編輯
              </button>
              <button
                class="h-10 px-4 bg-red text-white font-600 rounded-2 cursor-pointer ml-2"
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

      <el-dialog
        :title="`${type === 'edit' ? '編輯' : '新增'}文章`"
        v-model="articleDialogVisible"
        width="700"
        :modal="false"
      >
        <div>
          <el-form ref="formRef" :model="ruleForm" :rules="rules">
            <div class="grid md:grid-cols-2 gap-4 flex-1">
              <el-form-item
                label="標題"
                prop="title"
                class="col-span-2 flex flex-col items-start"
              >
                <el-input v-model="ruleForm.title"></el-input>
              </el-form-item>
              <div>
                <el-form-item
                  label="作者"
                  prop="author"
                  class="flex flex-col items-start"
                >
                  <el-input v-model="ruleForm.author"></el-input>
                </el-form-item>
              </div>
              <el-form-item
                label="圖片"
                prop="imageUrl"
                class="flex flex-col items-start"
              >
                <el-upload
                  v-loading="loading"
                  v-if="ruleForm.imageUrl === ''"
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
                    :src="ruleForm.imageUrl"
                    alt="文章圖片"
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
              <el-form-item label="標籤" class="flex flex-col items-start">
                <div class="flex items-center justify-between w-full">
                  <el-input
                    placeholder="請輸入標籤名稱"
                    v-model="inputTag"
                  ></el-input>
                  <button
                    class="h-12.5 w-17 rounded-2 ml-2 cursor-pointer"
                    :disabled="!inputTag.trim() ? true : false"
                    :class="!inputTag.trim() ? 'cursor-not-allowed' : ''"
                    @click.prevent="addTag"
                  >
                    新增
                  </button>
                </div>
              </el-form-item>
              <el-form-item
                label="標籤清單"
                prop="tags"
                class="flex flex-col items-start"
              >
                <div class="flex">
                  <el-tag
                    v-for="tag in ruleForm.tags"
                    closable
                    @close="removeTag(tag.id)"
                    :key="tag.id"
                    class="px-2"
                    >{{ tag.name }}</el-tag
                  >
                </div>
              </el-form-item>
              <el-form-item
                label="是否公開"
                prop="is_public"
                class="flex flex-col items-start"
              >
                <el-radio-group v-model="ruleForm.is_public">
                  <el-radio :value="true">是</el-radio>
                  <el-radio :value="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="公告日期"
                prop="date"
                class="flex flex-col items-start"
              >
                <el-date-picker v-model="ruleForm.date"></el-date-picker>
              </el-form-item>

              <el-form-item
                label="內容"
                prop=""
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
            <button class="h-10 px-4" @click="articleDialogVisible = false">
              取消
            </button>
            <button class="h-10 px-4 ml-2" @click="handleSubmit">確定</button>
          </div>
        </div>
      </el-dialog>
      <!--刪除彈窗-->
      <el-dialog v-model="deleteDialogVisible" :title="'刪除分類'" width="500">
        <div>
          <p v-if="selectToDelete">
            分類「{{ selectToDelete.title }}」刪除後將無法復原，你確定要刪除嗎？
          </p>
          <div class="flex justify-end">
            <button
              class="border border-1 border-solid border-black rounded-2 h-10 px-4 bg-white cursor-pointer"
              @click="deleteDialogVisible = false"
            >
              取消
            </button>
            <button
              class="bg-red text-white rounded-2 h-10 px-4 ml-4 cursor-pointer"
              @click="handleDelete"
            >
              確定
            </button>
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
