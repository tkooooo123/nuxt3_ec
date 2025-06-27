<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadRawFile } from 'element-plus'
definePageMeta({
  layout: 'admin'
})
interface tagItem {
  id: string
  name: string
}
interface article {
  title: string
  author: string
  is_public: boolean
  tags: string[]
  description: string
  created_at: string
}
interface RuleForm {
  title: string
  author: string
  is_public: boolean
  tags: tagItem[]
  description: string
  created_at: string
}
const articleDialogVisible = ref<boolean>(false)
const type = ref<'edit' | 'create'>('create')
const articleList = ref<article[]>([
  {
    title: 'test',
    author: 'test',
    description: 'test123',
    tags: ['ss'],
    is_public: true,
    created_at: ''
  }
])
const uploadImg = ref<string>('')

const ruleForm = reactive<RuleForm>({
  title: '',
  author: '',
  description: '',
  tags: [],
  is_public: true,
  created_at: ''
})

const inputTag = ref<string>('')

const checkFileType = (file: UploadRawFile) => {
  const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'

  if (!isJPGorPNG) {
    ElMessage({
      message: '只允許上傳 JPG 或 PNG 格式的圖片',
      type: 'error',
      duration: 3000
    })
    return
  }

  // ✅ 正確在這裡宣告 reader
  const reader = new FileReader()

  reader.onload = () => {
    const base64Data = reader.result as string
    console.log(base64Data)

    // 這裡你可以處理圖片，例如顯示
    uploadImg.value = base64Data
    // const imgElement = document.getElementById('preview-img') as HTMLImageElement
    // if (imgElement) {
    //   imgElement.src = base64Data
    // }

    // 或者如果你在 Vue 中：
    // this.previewImage = base64Data
  }

  reader.onerror = () => {
    ElMessage({
      message: '讀取圖片失敗',
      type: 'error',
      duration: 3000
    })
  }

  reader.readAsDataURL(file as Blob) // 👈 放在最後，觸發讀取
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
</script>

<template>
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
    <el-table :data="articleList" class="mt-6">
      <el-table-column label="No" width="50">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="標題" prop="title" width="180"></el-table-column>
      <el-table-column label="作者" prop="author" width="120"></el-table-column>
      <el-table-column label="標籤" width="120"></el-table-column>
      <el-table-column label="內容" prop="description"></el-table-column>
      <el-table-column label="發布日期" width="120"></el-table-column>
      <el-table-column label="是否啟用" width="90"></el-table-column>
      <el-table-column label="動作">
        <template #default="scope">
          <div class="flex">
            <button class="h-10 px-4 bg-yellow"
            @click="articleDialogVisible = true"
            >編輯</button>
            <button class="h-10 px-4 bg-red text-white">刪除</button>
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
        <el-form :model="ruleForm">
          <div class="grid md:grid-cols-2 gap-4 flex-1">
            <el-form-item
              label="標題"
              class="col-span-2 flex flex-col items-start"
            >
              <el-input></el-input>
            </el-form-item>
            <div>
              <el-form-item label="作者" class="flex flex-col items-start">
                <el-input></el-input>
              </el-form-item>
            </div>
            <el-form-item label="圖片" class="flex flex-col items-start">
              <el-upload
                v-if="!uploadImg"
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
              <img v-else :src="uploadImg" alt="" />
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
            <el-form-item label="標籤清單" class="flex flex-col items-start">
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
            <el-form-item label="是否公開" class="flex flex-col items-start">
              <el-radio-group>
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="公告日期" class="flex flex-col items-start">
              <el-date-picker></el-date-picker>
            </el-form-item>

            <el-form-item
              label="內容"
              class="flex flex-col items-start col-span-2"
            >
              <el-input
                type="textarea"
                :rows="5"
                placeholder="請輸入內容"
                class="textarea"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="flex justify-end mt-4">
          <button class="h-10 px-4" @click="articleDialogVisible = false">
            取消
          </button>
          <button class="h-10 px-4 ml-2">確定</button>
        </div>
      </div>
    </el-dialog>
  </div>
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
}
</style>
