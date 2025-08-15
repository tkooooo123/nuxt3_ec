import Cart from '~/server/models/Cart'
import { verifyJWTToken } from '~/server/utils/auth'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 驗證用戶登入狀態並取得 userId
    const { userId } = verifyJWTToken(event)

    // 查找用戶的購物車
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return {
        message: '購物車為空',
        data: {
          items: []
        }
      }
    }

    // 清空購物車
    cart.items = []
    await cart.save()

    return {
      message: '購物車已清空',
      data: {
        items: []
      }
    }
  } catch (error: unknown) {
    // 如果 error 是物件且有 statusCode 屬性，就直接拋出
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }
  
    // 其他狀況，拋出通用錯誤
    throw createError({
      statusCode: 500,
      statusMessage: '清空購物車失敗，請稍後再試'
    })
  }
})
