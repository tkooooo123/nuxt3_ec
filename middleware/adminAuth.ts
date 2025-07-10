export default defineNuxtRouteMiddleware(async (to, from) => {
    try {
      // 獲取 token 並檢查是否存在
      const token = useCookie('token')
      if (!token.value) return navigateTo('/login') // 如果沒有 token，重定向到登錄頁面
    
      // 使用 useFetch 發送請求
      const { data, error } = await useFetch('/api/auth/check-admin-token', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}` // 在請求標頭中傳遞 token
        }
      })
    
      // 如果請求有錯誤或返回的數據為空，重定向到登入頁面
      if (error.value || !data.value) {
       
        return navigateTo('/login')
      }
    
    } catch (error) {
      
      navigateTo('/login') // 無論錯誤是什麼，都重定向到登錄頁面
    }
  })