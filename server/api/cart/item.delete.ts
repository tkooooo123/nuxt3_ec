import Cart from '~/server/models/Cart'
import { verifyJWTToken } from '~/server/utils/auth'
import { H3Event } from 'h3'
import { IProduct } from '~/server/models/Product'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 驗證用戶登入狀態並取得 userId
    const { userId } = verifyJWTToken(event)

    // 獲取請求體
    const body = await readBody(event)
    const { productId } = body

    // 驗證必要參數
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: '商品 ID 為必填項目'
      })
    }

    // 查找用戶的購物車
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      throw createError({
        statusCode: 404,
        statusMessage: '購物車不存在'
      })
    }

    // 查找購物車中的商品
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)
    if (itemIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: '購物車中沒有此商品'
      })
    }

    // 移除該商品
    cart.items.splice(itemIndex, 1)
    await cart.save()

    // 回傳更新後的購物車（包含商品詳情）
    const updatedCart = await Cart.findById(cart._id).populate<{ product: IProduct}>({
      path: 'items.product',
      select: 'name image price origin_price quantity unit isEnabled'
    })

    // 轉換 _id 為 id
    const transformedItems = updatedCart?.items.map(item => {
      const prod = item.product as unknown as IProduct
      return {
        product: {
          id: prod._id,
          name: prod.name,
          image: prod.image,
          quantity: prod.quantity,
          price: prod.price,
          origin_price: prod.origin_price,
          isEnabled: prod.isEnabled,
          unit: prod.unit
        },
        quantity: item.quantity,
        price: item.price
      }
    })

    return {
      message: '商品已從購物車移除',
      data: {
        items: transformedItems
      }
    }
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: '刪除購物車商品失敗，請稍後再試'
    })
  }
}) 