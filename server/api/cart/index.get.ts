import Cart from '~/server/models/Cart'
import { verifyJWTToken } from '~/server/utils/auth'
import { connectDB } from '~/server/utils/mongoose'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    // 驗證用戶登入狀態並取得 userId
    const { userId } = verifyJWTToken(event)
    // 查找用戶的購物車
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name image price origin_price quantity unit isEnabled'
    })

    // 如果購物車不存在，回傳空的購物車
    if (!cart) {
      return {
        message: '購物車為空',
        data: {
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      }
    }

    // 計算購物車統計資訊
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // 檢查商品是否仍然有效（啟用且有庫存）
    const validItems = cart.items.filter(item => {
      const product = item.product as any
      return product && product.isEnabled && product.quantity > 0
    })

    // 如果有些商品已失效，更新購物車
    if (validItems.length !== cart.items.length) {
      cart.items = validItems
      await cart.save()
    }

    // 轉換 _id 為 id
    const transformedItems = validItems.map(item => {
      const product = item.product as any
      return {
        product: {
          id: product._id,
          name: product.name,
          image: product.image,
          quantity: product.quantity,
          price: product.price,
          origin_price: product.origin_price,
          isEnabled: product.isEnabled,
          unit: product.unit
        },
        quantity: item.quantity,
        price: item.price
      }
    })

    return {
      message: '成功獲取購物車',
      data: {
        items: transformedItems,
        totalItems,
        totalPrice,
        itemCount: transformedItems.length
      }
    }

  } catch (error: any) {
    console.error('獲取購物車錯誤:', error)
    
    // 如果是已知錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 其他錯誤
    throw createError({
      statusCode: 500,
      statusMessage: '獲取購物車失敗，請稍後再試'
    })
  }
}) 