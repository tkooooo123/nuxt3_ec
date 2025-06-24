<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { FetchError } from 'ofetch'

definePageMeta({
    layout: 'admin'
})
interface category {
    id: string
    name: string
    description: string
}
interface CatrgoryRuleForm {
    name: string
    description: string
}
const categoryList = ref<category[]>([

])

const createDialogVisible = ref<boolean>(false)
const type = ref<string>('')
const selectedCategoryId = ref<string>('')

const formRef = ref<FormInstance>()
const ruleform = reactive<CatrgoryRuleForm>({
    name: '',
    description: ''
})



const rules: FormRules<CatrgoryRuleForm> = {
    name: [
        { required: true, message: '請輸入分類名稱', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '請輸入分類描述', trigger: 'blur' }
    ]
}
const getCategories = async () => {
    try {
        const { data } = await $fetch<{ data: category[] }>('/api/admin/categories');
        if (data) {
            categoryList.value = data
        }

    } catch (error) {
        console.error("取得分類失敗", error);
    }
}

const addCategory = async () => {
    try {
        const data = await $fetch('/api/admin/category', {
            method: type.value === 'edit' ? 'PUT' : 'POST',
            body: {
                name: ruleform.name,
                description: ruleform.description,
                id:type.value === 'edit' ? selectedCategoryId.value : null
            }
        })
        if (data) {
            createDialogVisible.value = false
            ruleform.name = ''
            ruleform.description = ''
            getCategories()

        }
    } catch (error) {
        if (error instanceof FetchError) {
        }
        console.log(error)
    }
}



const handleSubmit = () => {
    formRef.value?.validate((valid) => {
        if (valid) {
            addCategory()
        }
    })
}

const handleEdit = (item:category) => {
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
        <div class="w-full">
            <div class="px-8 py-6 ">
                <h1>分類管理</h1>
                <div class="flex justify-end">
                    <button class="bg-blue rounded-2 h-10 px-4 text-white font-600 cursor-pointer"
                        @click="() => {
                            createDialogVisible = true
                            type = 'create'
                        }">新增</button>
                </div>
                <el-table class="mt-8" :data="categoryList"
                    :headerCellStyle="{ background: '#60A5FA', color: 'white' }">
                    <el-table-column label="No" width="60"></el-table-column>
                    <el-table-column label="名稱" prop="name" width="160"></el-table-column>
                    <el-table-column label="描述" prop="description"></el-table-column>
                    <el-table-column label="動作">
                        <template #default="scope">
                            <div class="flex">
                                <button class="bg-yellow h-10 px-4 rounded-2 font-600  cursor-pointer"
                                @click="handleEdit(scope.row)"
                                >編輯</button>
                                <button class="bg-red h-10 px-4 rounded-2 ml-2 text-white font-600  cursor-pointer">刪除</button>
                            </div>
                        </template></el-table-column>
                </el-table>
            </div>
        </div>

        <!--新增彈窗-->
        <el-dialog :title="`${type === 'edit' ? '編輯': '新增'}分類`" v-model="createDialogVisible" width="600">
            
            <div>
                <el-form ref="formRef" :model="ruleform" :rules="rules">
                    <el-form-item label="名稱" prop="name" class="flex flex-col items-start">
                        <el-input v-model="ruleform.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description" class="flex flex-col items-start">
                        <el-input type="textarea" v-model="ruleform.description"></el-input>
                    </el-form-item>
                </el-form>
                <div class="flex justify-end">
                    <button
                        class="border border-1 border-solid border-black rounded-2 h-10 px-4 bg-white cursor-pointer"
                        @click="createDialogVisible = false">取消</button>
                    <button class="bg-blue text-white rounded-2 h-10 px-4 ml-4 cursor-pointer"
                        @click="handleSubmit">確定</button>
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