<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

definePageMeta({
    layout: 'admin'
})
interface category {
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

const handleSubmit = () => {
    formRef.value?.validate((valid) => {
        if (valid) {
           console.log(valid)
        }
    })
}
</script>

<template>
    <el-container>
        <div class="w-full">
            <div class="px-8 py-6 ">
                <h1>分類管理</h1>
                <div class="flex justify-end">
                    <button class="bg-blue rounded-2 h-10 px-4 text-white font-600 cursor-pointer"
                    @click="createDialogVisible = true"
                    >新增</button>
                </div>
                <el-table class="mt-8" :data="categoryList"
                    :headerCellStyle="{ background: '#60A5FA', color: 'white' }">
                    <el-table-column label="No" width="60"></el-table-column>
                    <el-table-column label="名稱" width="160"></el-table-column>
                    <el-table-column label="描述"></el-table-column>
                    <el-table-column label="動作"></el-table-column>
                </el-table>
            </div>
        </div>

        <!--新增彈窗-->
        <el-dialog title="新增分類" v-model="createDialogVisible" width="600">
            <div>
                <el-form ref="formRef" :model="ruleform" :rules="rules">
                    <el-form-item label="名稱" prop="name" class="flex flex-col items-start">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description" class="flex flex-col items-start">
                        <el-input type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <div class="flex justify-end">
                    <button class="border border-1 border-solid border-black rounded-2 h-10 px-4 bg-white cursor-pointer"
                    @click="createDialogVisible = false"
                    >取消</button>
                    <button class="bg-blue text-white rounded-2 h-10 px-4 ml-4 cursor-pointer"
                    @click="handleSubmit"
                    >確定</button>
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