<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue3-toastify'
import type { ApiResponse } from '~/types/api'
import type { User } from '~/types/user'
import { FetchError } from 'ofetch'

definePageMeta({
  layout: false
})

interface RuleForm {
  email: string
  password: string
}


const loadingStore = useLoadingStore()
const isShow = ref<boolean>(false)
const formRef = ref<FormInstance>()
const ruleform = reactive<RuleForm>({
  email: '',
  password: ''
})

const rules: FormRules<RuleForm> = {
  email: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    {
      type: 'email',
      message: '請輸入正確的 Email 格式',
      trigger: ['blur', 'change']
    }
  ],
  password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }]
}

const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      handleLogin()
    }
  })
}
const { clearAuth } = useAuth()

const handleLogin = async () => {
  loadingStore.show()
  try {
    const res = await $fetch<ApiResponse<User>>('/api/user/login', {
      method: 'POST',
      body: {
        email: ruleform.email,
        password: ruleform.password
      }
    })
    if (res.data) {
      // 使用 useCookie 儲存 token
      const token = useCookie('token', {
        maxAge: 30 * 60, // 30分鐘，與後端 JWT 過期時間一致
        secure: true,
        sameSite: 'strict'
      })
      token.value = res.data.token

      // 儲存用戶資訊
      const userInfo = useCookie('userInfo', {
        maxAge: 30 * 60,
        secure: true,
        sameSite: 'strict'
      })
      userInfo.value = JSON.stringify({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        user_id: res.data.user_id
      })
    }

    if ( res.data && res.data.role === 'admin') {
      await navigateTo('/admin/products')
    } else {
      await navigateTo('/')
    }
  } catch (error: unknown) {
    let msg
    // 錯誤處理
    if(error instanceof FetchError) {
        msg = error?.data?.message || error?.message || '登入失敗，請稍後再試'
    }
 
    toast.error(`登入失敗: ${msg}`)
    // 登入失敗時清除認證狀態
    clearAuth()
  } finally {
    loadingStore.hide()
  }
}
</script>

<template>
  <CustomLoading />
  <div class="px-12">
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
          class="flex flex-col items-start mt-4 relative"
        >
          <div class="w-full relative mt-2">
            <el-input
              class="password"
              :type="isShow ? 'text' : 'password'"
              v-model="ruleform.password"
            >
            </el-input>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 hover:cursor-pointer absolute top-50% right-10px transform-translate-y--50%"
              v-if="!isShow"
              @click="isShow = !isShow"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 hover:cursor-pointer absolute top-50% right-10px transform-translate-y--50%"
              v-else
              @click="isShow = !isShow"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          </div>
        </el-form-item>
      </el-form>

      <button
        class="mt-4 w-full bg-primary text-white font-600 rounded-2 h-10 cursor-pointer"
        @click="handleSubmit"
      >
        登入
      </button>

      <div class="text-center mt-4">
        還沒有帳號？
        <NuxtLink to="/signup" class="text-primary underline hover:opacity-80">
          前往註冊
        </NuxtLink>
      </div>
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
  .el-input__inner {
    height: 44px;
  }
  .password .el-input__inner {
    padding: 0 24px 0 0;
  }
}
</style>
