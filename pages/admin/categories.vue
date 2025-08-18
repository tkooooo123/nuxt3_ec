<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import type { ApiResponse } from '~/types/api'
import type { Category } from '~/types/category'
import { FetchError } from 'ofetch'
import adminAuth from '~/middleware/adminAuth'
import { toast } from 'vue3-toastify'

definePageMeta({
  layout: 'admin',
  middleware: adminAuth
})

interface CatrgoryRuleForm {
  name: string
  description: string
}

const token = useCookie('token')
const loadingStore = useLoadingStore()
const categoryList = ref<Category[]>([])

const createDialogVisible = ref<boolean>(false)
const deleteDialogVisible = ref<boolean>(false)
const type = ref<string>('')
const selectedCategoryId = ref<string>('')
const selectToDelete = ref<Category | null>(null)

const formRef = ref<FormInstance>()
const ruleform = reactive<CatrgoryRuleForm>({
  name: '',
  description: ''
})

const rules: FormRules<CatrgoryRuleForm> = {
  name: [{ required: true, message: '請輸入分類名稱', trigger: 'blur' }],
  description: [{ required: true, message: '請輸入分類描述', trigger: 'blur' }]
}

// 分頁相關
const { currentPage, pageSize, pagedData: pagedCategory } = usePagination<Category>(categoryList, 10)

const getCategories = async () => {
  loadingStore.show()
  try {
    const res = await $fetch<ApiResponse<Category[]>>(
      '/api/admin/categories',
      {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    if (res.data) {
      categoryList.value = res.data
    }
  } catch (error: unknown) {
    if(error instanceof FetchError) {
      toast.error(`${error.data?.statusMessage}`)
    }
  } finally {
      loadingStore.hide()
  }
}

const addCategory = async () => {
  loadingStore.show()
  try {
    const data = await $fetch('/api/admin/category', {
      method: type.value === 'edit' ? 'PUT' : 'POST',
      body: {
        name: ruleform.name,
        description: ruleform.description,
        id: type.value === 'edit' ? selectedCategoryId.value : null
      },
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    if (data) {
      createDialogVisible.value = false
      ruleform.name = ''
      ruleform.description = ''
      getCategories()
    }
  }  catch (error: unknown) {
    if(error instanceof FetchError) {
      toast.error(`${error.data?.statusMessage}`)
    }
  } finally {
      loadingStore.hide()
  }
}

const handleDelete = async () => {
  loadingStore.show()
  try {
    const res = await $fetch(`/api/admin/category`, {
      method: 'DELETE',
      body: {
        id: selectToDelete.value?.id
      },
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    ElMessage.success(res.message || '刪除成功')

    // 關閉 dialog 並重置選擇
    await getCategories()
    deleteDialogVisible.value = false
  }  catch (error: unknown) {
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
      addCategory()
    }
  })
}

const handleEdit = (item: Category) => {
  createDialogVisible.value = true
  type.value = 'edit'
  ruleform.name = item.name
  ruleform.description = item.description
  selectedCategoryId.value = item.id
}
onMounted(() => {
  getCategories()
})
</script>

<template>
  <el-container>
    <div class="w-full bg-white m-4 rounded-3">
      <div class="px-8 py-6">
        <h1 class="text-8">分類管理</h1>
        <div class="flex justify-end">
          <button
            class="h-10 bg-blue-light hover:bg-blue-dark text-white px-4 rounded-2 border-0 cursor-pointer transition-all duration-200"
            @click="
              () => {
                createDialogVisible = true
                type = 'create'
              }
            "
          >
            新增分類
          </button>
        </div>
        <el-table
          class="mt-8"
          :data="pagedCategory"
        >
          <el-table-column label="No" width="60"></el-table-column>
          <el-table-column
            label="名稱"
            prop="name"
            width="160"
          ></el-table-column>
          <el-table-column label="描述" >
            <template #default="scope">
              <span class="truncate">{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column label="動作" width="170">
            <template #default="scope">
              <div class="flex">
                <button
                  class="hover:bg-blue-light bg-white text-blue-light border border-blue-light border-solid hover:text-white rounded-2 w-16 h-10 cursor-pointer transition-all duration-200 mr-2"
                  @click="handleEdit(scope.row)"
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
            </template></el-table-column
          >
        </el-table>
        <!-- 分頁 -->
        <div class="flex justify-center mt-6">
          <Pagination
            :total="categoryList.length"
            :page-size="pageSize"
            v-model:currentPage="currentPage"
          />
        </div>
      </div>
    </div>

    <!--新增彈窗-->
    <el-dialog
      :title="`${type === 'edit' ? '編輯' : '新增'}分類`"
      v-model="createDialogVisible"
      width="600"
    >
      <div>
        <el-form ref="formRef" :model="ruleform" :rules="rules">
          <el-form-item
            label="名稱"
            prop="name"
            class="flex flex-col items-start"
          >
            <el-input v-model="ruleform.name"></el-input>
          </el-form-item>
          <el-form-item
            label="描述"
            prop="description"
            class="flex flex-col items-start"
          >
            <el-input type="textarea" v-model="ruleform.description"></el-input>
          </el-form-item>
        </el-form>
        <div class="flex justify-end">
          <button
            class="rounded-4 cursor-pointer px-4 py-2 mr-3 hover:brightness-90 transition duration-200"
            @click="createDialogVisible = false"
          >
            取消
          </button>
          <button
            class="h-10 px-4 rounded-4 cursor-pointer bg-blue-light hover:bg-blue-dark text-white transition duration-200"
            @click="handleSubmit"
          >
            確定
          </button>
        </div>
      </div>
    </el-dialog>
    <!--刪除彈窗-->
    <el-dialog v-model="deleteDialogVisible" :title="'刪除分類'" width="500">
      <div>
        <p v-if="selectToDelete">
          分類「{{ selectToDelete.name }}」刪除後將無法復原，你確定要刪除嗎？
        </p>
        <div class="flex justify-end">
          <button
            class="rounded-4 cursor-pointer px-4 py-2 mr-3 hover:brightness-90 transition duration-200"
            @click="deleteDialogVisible = false"
          >
            取消
          </button>
          <button
            class="bg-red text-white rounded-4 hover:brightness-90 h-10 px-4 cursor-pointer transition duration-200"
            @click="handleDelete"
          >
            確定
          </button>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<style lang="scss" scoped>
:deep() {
  .el-form-item__content {
    width: 100%;
  }

  .el-dialog {
    padding: 24px;
  }
}

</style>
