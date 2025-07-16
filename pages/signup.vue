<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { FetchError } from 'ofetch'
import { toast } from 'vue3-toastify'

definePageMeta({
  layout: false
})
interface RuleForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const loadingStore = useLoadingStore()
const passwordShow = ref<boolean>(false)
const confirmPasswordShow = ref<boolean>(false)
const formRef = ref<FormInstance>()

const ruleform = reactive<RuleForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const rules: FormRules<RuleForm> = {
  name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    {
      type: 'email',
      message: '請輸入正確的 Email 格式',
      trigger: ['blur', 'change']
    }
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
  loadingStore.show()
  try {
    const data = await $fetch<{ message: string }>('/api/user/signup', {
      method: 'POST',
      body: {
        name: ruleform.name,
        email: ruleform.email,
        password: ruleform.password,
        confirmPassword: ruleform.confirmPassword
      }
    })
    toast.success(data.message || '註冊成功，請登入')
    await navigateTo('/login')
  } catch (error: any) {
    let msg = '註冊失敗，請稍後再試'
    if (error instanceof FetchError) {
      msg = error.data?.message || msg
    } else if (error?.data?.message) {
      msg = error.data.message
    } else if (error?.message) {
      msg = error.message
    }
    toast.error(msg)
  } finally {
    loadingStore.hide()
  }
}
</script>

<template>
  <CustomLoading></CustomLoading>
  <div class="px-12">
    <div class="max-w-150 mx-auto mt-20">
      <h2 class="text-center text-primary">會員註冊</h2>
      <el-form ref="formRef" :model="ruleform" :rules="rules">
        <el-form-item
          label="姓名"
          prop="name"
          class="flex flex-col items-start"
        >
          <el-input class="mt-2" v-model="ruleform.name"></el-input>
        </el-form-item>
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
          <div class="ralative w-full">
            <el-input
              :type="passwordShow ? 'text' : 'password'"
              class="mt-2 password"
              v-model="ruleform.password"
            ></el-input>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 hover:cursor-pointer absolute top-50% right-10px transform-translate-y--50%"
              v-if="!passwordShow"
              @click="passwordShow = !passwordShow"
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
              @click="passwordShow = !passwordShow"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          </div>
        </el-form-item>
        <el-form-item
          label="確認密碼"
          prop="confirmPassword"
          class="flex flex-col items-start mt-4"
        >
          <div class="ralative w-full">
            <el-input
              :type="confirmPasswordShow ? 'text' : 'password'"
              class="mt-2 password"
              v-model="ruleform.confirmPassword"
            ></el-input>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 hover:cursor-pointer absolute top-50% right-10px transform-translate-y--50%"
              v-if="!confirmPasswordShow"
              @click="confirmPasswordShow = !confirmPasswordShow"
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
              @click="confirmPasswordShow = !confirmPasswordShow"
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
        註冊
      </button>
      <div class="text-center mt-4">
        已有帳號？
        <NuxtLink to="/login" class="text-primary hover:underline"
          >前往登入</NuxtLink
        >
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
