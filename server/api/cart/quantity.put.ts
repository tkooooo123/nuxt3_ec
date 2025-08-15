import Cart from '~/server/models/Cart'
import Product, { IProduct } from '~/server/models/Product'
import { verifyJWTToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // 驗證用戶登入狀態並取得 userId
    const { userId } = verifyJWTToken(event)

    // 獲取請求體
    const body = await readBody(event)
    const { productId, quantity } = body

    // 驗證必要參數
    if (!productId || typeof quantity !== 'number') {
      throw createError({
        statusCode: 400,
        statusMessage: '商品 ID 與數量為必填項目'
      })
    }
    if (quantity < 1) {
      throw createError({
        statusCode: 400,
        statusMessage: '商品數量必須大於 0'
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

    // 查找商品
    const product = await Product.findById(productId)
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: '商品不存在'
      })
    }
    if (!product.isEnabled) {
      throw createError({
        statusCode: 400,
        statusMessage: '此商品已停售'
      })
    }
    if (product.quantity !== undefined && product.quantity < quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: `庫存不足，目前僅剩 ${product.quantity} 件`
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

    // 更新數量與價格
    cart.items[itemIndex].quantity = quantity
    cart.items[itemIndex].price = product.price

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
      message: '商品數量已更新',
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
      statusMessage: '變更購物車商品數量失敗，請稍後再試'
    })
  }
}) 