<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { FetchError } from 'ofetch'

definePageMeta({
    layout: false
})
interface RuleForm {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const formRef = ref<FormInstance>()

const ruleform = reactive<RuleForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const rules: FormRules<RuleForm> = {
    name: [
        { required: true, message: '請輸入姓名', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '請輸入帳號', trigger: 'blur' },
        { type: 'email', message: '請輸入正確的 Email 格式', trigger: ['blur', 'change'] }
    ],
    password: [
        { required: true, message: '請輸入密碼', trigger: 'blur' },
        { min: 6, message: '密碼長度至少為 6 碼', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '請再次輸入密碼', trigger: 'blur' },
        { min: 6, message: '密碼長度至少為 6 碼', trigger: 'blur' }
    ]
}

const handleSubmit = () => {
    formRef.value?.validate((valid) => {
        if (valid) {
            handleSignUp()
        }
    })
}
const handleSignUp = async () => {
    try {
        const  data = await $fetch<{ message: string }>('/api/user/signup', {
            method: 'POST',
            body: {
                name: ruleform.name,
                email: ruleform.email,
                password: ruleform.password,
                confirmPassword: ruleform.confirmPassword
            }
        })
        console.log(data)
    } catch (error) {
       if (error instanceof FetchError) {
            console.log(error.data)
        }
        console.log(error)
    }
}
</script>

<template>
    <div class="w-full ">
        <div class="max-w-150 mx-auto mt-20">
            <h2 class="text-center text-primary">會員註冊</h2>
            <el-form ref="formRef" :model="ruleform" :rules="rules">
                <el-form-item label="姓名" prop="email" class="flex flex-col items-start">
                    <el-input class="mt-2" v-model="ruleform.name"></el-input>
                </el-form-item>
                <el-form-item label="帳號" prop="email" class="flex flex-col items-start">
                    <el-input class="mt-2" v-model="ruleform.email"></el-input>
                </el-form-item>
                <el-form-item label="密碼" prop="password" class="flex flex-col items-start mt-4">
                    <el-input type="password" class="mt-2" v-model="ruleform.password"></el-input>
                </el-form-item>
                <el-form-item label="確認密碼" prop="confirmPassword" class="flex flex-col items-start mt-4">
                    <el-input type="password" class="mt-2" v-model="ruleform.confirmPassword"></el-input>
                </el-form-item>
            </el-form>

            <button class="mt-4 w-full bg-primary text-white font-600 rounded-2 h-10 cursor-pointer"
                @click="handleSubmit">註冊</button>
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