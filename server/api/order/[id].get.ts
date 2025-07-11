import Order from '~/server/models/Order'

export default defineEventHandler(async (event) => {
  try {
    // 取得訂單 id
    const { id } = event.context.params
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少訂單 ID'
      })
    }
    // 查詢訂單，並帶出 user 詳細資料
    const order = await Order.findById(id).populate('user').populate('items.product')
    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: '找不到訂單'
      })
    }
    console.log(order)
    const result = {
      id: order._id,
      user: {
        userId: order.user._id,
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        address: order.user.address,
      },
      items: order.items.map((item: any) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      shipping: order.shipping,
      status: order.status,
      payment: order.payment,
      sn: order.sn,
      createdAt: order.createdAt,
      
    }
    return {
      message: '取得成功!',
      data: result
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '伺服器錯誤'
    })
  }
})