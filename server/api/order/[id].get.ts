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
    const order = await Order.findById(id).populate('user')
    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: '找不到訂單'
      })
    }
    return {
      message: '取得成功!',
      data: order
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '伺服器錯誤'
    })
  }
})