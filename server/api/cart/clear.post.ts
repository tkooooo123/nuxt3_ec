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
  } catch (error: any) {
    console.error('清空購物車錯誤:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: '清空購物車失敗，請稍後再試'
    })
  }
})
