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

interface LoginResponse {
  message: string
  data: {
    token: string
    name: string
    email: string
    role: string
    user_id: string
  }
}

const formRef = ref<FormInstance>()

const ruleform = reactive<RuleForm>({
  email: '',
  password: ''
})

const rules: FormRules<RuleForm> = {
  email: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }]
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
    const { data, error } = await useFetch<LoginResponse>('/api/user/login', {
      method: 'POST',
      body: {
        email: ruleform.email,
        password: ruleform.password
      }
    })

    if (error.value) {
      console.error('登入錯誤:', error.value)
      return
    }

    if (data.value) {
      // 使用 useCookie 儲存 token
      const token = useCookie('token', {
        maxAge: 30 * 60, // 30分鐘，與後端 JWT 過期時間一致
        secure: true,
        sameSite: 'strict'
      })
      token.value = data.value.data.token

      // 儲存用戶資訊
      const userInfo = useCookie('userInfo', {
        maxAge: 30 * 60,
        secure: true,
        sameSite: 'strict'
      })
      userInfo.value = JSON.stringify({
        name: data.value.data.name,
        email: data.value.data.email,
        role: data.value.data.role,
        user_id: data.value.data.user_id
      })

      console.log('登入成功，token 已儲存')

      // 根據用戶角色導向不同頁面
      if (data.value.data.role === 'admin') {
        await navigateTo('/admin')
      } else {
        await navigateTo('/')
      }
    }
  } catch (error) {
    console.error('登入失敗:', error)
  }
}
</script>

<template>
  <div class="w-full">
    <div class="max-w-150 mx-auto mt-20">
      <h2 class="text-center text-primary">會員登入</h2>
      <el-form ref="formRef" :model="ruleform" :rules="rules">
        <el-form-item
          label="帳號"
          prop="email"
          class="flex flex-col items-start"
        >
          <el-input class="mt-2" v-model="ruleform.email"></el-input>
        </el-form-item>
        <el-form-item
          label="密碼"
          prop="password"
          class="flex flex-col items-start mt-4"
        >
          <el-input class="mt-2" v-model="ruleform.password"></el-input>
        </el-form-item>
      </el-form>

      <button
        class="mt-4 w-full bg-primary text-white font-600 rounded-2 h-10 cursor-pointer"
        @click="handleSubmit"
      >
        登入
      </button>
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