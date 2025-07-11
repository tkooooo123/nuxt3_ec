export const useAuth = () => {
  // 獲取 token
  const getToken = () => {
    const token = useCookie('token')
    return token.value
  }

  // 獲取用戶資訊
  const getUser = () => {
    const userInfo = useCookie('userInfo')
    return userInfo.value ? JSON.parse(userInfo.value) : null
  }

  // 檢查是否已登入
  const isLoggedIn = () => {
    return !!getToken()
  }

  // 檢查是否為管理員
  const isAdmin = () => {
    const user = getUser()
    return user?.role === 'admin'
  }

  // 登出功能
  const logout = async () => {
   
      // 都要清除本地狀態
      const token = useCookie('token')
      const userInfo = useCookie('userInfo')

      token.value = null
      userInfo.value = null

      // 重定向到登入頁面
      await navigateTo('/login')
    
  }

  // 清除認證狀態（不重定向）
  const clearAuth = () => {
    const token = useCookie('token')
    const userInfo = useCookie('userInfo')

    token.value = null
    userInfo.value = null
  }

  return {
    getToken,
    getUser,
    isLoggedIn,
    isAdmin,
    logout,
    clearAuth
  }
}