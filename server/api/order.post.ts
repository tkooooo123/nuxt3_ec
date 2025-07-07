import Order from '~/server/models/Order'
import Cart from '~/server/models/Cart'
import { verifyJWTToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // 驗證用戶登入
    const { userId } = verifyJWTToken(event)

    // 取得前端傳來的收件人資料
    const body = await readBody(event)
    const { shipping } = body
    if (!shipping || !shipping.name || !shipping.phone || !shipping.address || !shipping.email) {
      throw createError({
        statusCode: 400,
        statusMessage: '收件人資訊不完整'
      })
    }

    // 取得購物車
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'price isEnabled quantity name'
    })
    if (!cart || !cart.items.length) {
      throw createError({
        statusCode: 400,
        statusMessage: '購物車沒有商品'
      })
    }

    // 檢查商品狀態與庫存，並計算總金額
    let total = 0
    const orderItems = cart.items.map(item => {
      const product = item.product as any
      if (!product.isEnabled) {
        throw createError({
          statusCode: 400,
          statusMessage: `商品「${product.name}」已停售`
        })
      }
      if (product.quantity !== undefined && product.quantity < item.quantity) {
        throw createError({
          statusCode: 400,
          statusMessage: `商品「${product.name}」庫存不足`
        })
      }
      total += item.price * item.quantity
      return {
        product: product._id,
        quantity: item.quantity,
        price: item.price
      }
    })

    // 建立訂單
    const order = await Order.create({
      user: userId,
      items: orderItems,
      total,
      shipping
      
    })

    // 清空購物車
    cart.items = []
    await cart.save()

    return {
      message: '訂單建立成功',
      data: {
        orderId: order._id
      }
    }
  } catch (error: any) {
    console.error('建立訂單錯誤:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: '建立訂單失敗，請稍後再試'
    })
  }
}) 