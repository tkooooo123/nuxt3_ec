<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

definePageMeta({
    layout: false
})
interface RuleForm {
    email: string
    password: string
}

const formRef = ref<FormInstance>()

const ruleform = reactive<RuleForm>({
    email: '',
    password: ''
})

const rules: FormRules<RuleForm> = {
    email: [
        { required: true, message: '請輸入帳號', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '請輸入密碼', trigger: 'blur' }
    ]
}

const handleSubmit = () => {
    formRef.value?.validate((valid) => {
        if (valid) {
            handleLogin()
        }
    })
}
const handleLogin = async () => {
    try {
        const { data, error } = await useFetch('/api/user/login', {
            method: 'POST',
            body: {
                email: ruleform.email,
                password: ruleform.password
            }
        })
        console.log(data, error)
    } catch (error) {
        console.log(error)
    }
}
</script>

<template>
    <div class="w-full ">
        <div class="max-w-150 mx-auto mt-20">
            <h2 class="text-center text-primary">會員登入</h2>
            <el-form ref="formRef" :model="ruleform" :rules="rules">
                <el-form-item label="帳號" prop="email" class="flex flex-col items-start">
                    <el-input class="mt-2" v-model="ruleform.email"></el-input>
                </el-form-item>
                <el-form-item label="密碼" prop="password" class="flex flex-col items-start mt-4">
                    <el-input class="mt-2" v-model="ruleform.password"></el-input>
                </el-form-item>
            </el-form>

            <button class="mt-4 w-full bg-primary text-white font-600 rounded-2 h-10 cursor-pointer"
                @click="handleSubmit">登入</button>
        </div>

    </div>
</template>

<style lang="scss" scoped>
:deep() {
    .el-form-item__content {
        width: 100%;
    }

    .el-form-item__label {
        font-weight: 600;
    }
}
</style>