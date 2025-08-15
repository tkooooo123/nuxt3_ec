import Order from '~/server/models/Order'
import Cart from '~/server/models/Cart'
import { verifyJWTToken } from '~/server/utils/auth'
import { IProduct } from '~/server/models/Product'

export default defineEventHandler(async (event) => {
  try {
    // 驗證用戶登入
    const { userId } = verifyJWTToken(event)

    // 取得前端傳來的收件人資料
    const body = await readBody(event)
    const { shipping, payment } = body
    if (
      !shipping ||
      !shipping.name ||
      !shipping.phone ||
      !shipping.address ||
      !shipping.email
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: '收件人資訊不完整'
      })
    }
    if (!payment) {
      throw createError({
        statusCode: 400,
        statusMessage: '未選擇付款方式'
      })
    }

    // 取得購物車
    const cart = await Cart.findOne({ user: userId }).populate<{ product: IProduct}>({
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
    const orderItems = cart.items.map((item) => {
      const product = item.product as unknown as IProduct
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
      shipping,
      payment
    })

    // 扣除商品庫存
    const Product = (await import('~/server/models/Product')).default
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      )
    }

    // 清空購物車
    cart.items = []
    await cart.save()

    return {
      message: '訂單建立成功',
      data: {
        orderId: order._id
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: '伺服器錯誤'
    })
  }
})
