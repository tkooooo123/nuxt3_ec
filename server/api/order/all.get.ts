import Order from '~/server/models/Order'
import { verifyJWTToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // 驗證用戶登入
    const { userId } = verifyJWTToken(event)
    console.log(userId)
    // 根據 userId 查詢，若無則查全部
    const filter: any = {}
    if (userId) {
      filter.user = userId
    }

    // 查詢訂單，帶出 user 及商品詳細資料
    const orders = await Order.find(filter)
      .populate('user')
      .populate('items.product')

    const data = orders.map((order) => ({
      id: order._id,
      user: order.user
        ? {
            userId: order.user._id,
            name: order.user.name,
            email: order.user.email
          }
        : null,
      items: order.items.map((item: any) => ({
        name: item.product?.name,
        image: item.product?.image,
        quantity: item.quantity,
        price: item.price
      })),
      total: order.total,
      shipping: order.shipping,
      status: order.status,
      payment: order.payment,
      sn: order.sn,
      createdAt: order.createdAt
    }))
    return {
      message: '取得成功!',
      data
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '伺服器錯誤'
    })
  }
})
