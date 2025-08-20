export default defineNuxtRouteMiddleware((to) => {
  const { isAdmin } = useAuth()
  //禁止管理者訪問前台頁面
  if (isAdmin() && !to.path.startsWith('/admin')) {
    return navigateTo('/admin/products') 
  }
 
})