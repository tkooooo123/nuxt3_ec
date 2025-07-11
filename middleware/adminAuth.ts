export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isLoggedIn, isAdmin, clearAuth } = useAuth()

  try {
    // 檢查是否已登入
    if (!isLoggedIn()) {
      return navigateTo('/login')
    }

    // 檢查是否為管理員
    if (!isAdmin()) {
      return navigateTo('/')
    }

    // 獲取 token 並驗證管理員權限
    const token = useCookie('token')
    const { data, error } = await useFetch('/api/auth/check-admin-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    // 如果請求有錯誤或返回的數據為空，清除認證狀態並重定向
    if (error.value || !data.value) {
      clearAuth()
      return navigateTo('/login')
    }
  } catch (error) {
    clearAuth()
    return navigateTo('/login')
  }
})
