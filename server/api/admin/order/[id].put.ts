import Order from '~/server/models/Order'
import Product from '~/server/models/Product'
import { connectDB } from '~/server/utils/mongoose'
import type { IUser } from '~/server/models/User'
import type { IProduct } from '~/server/models/Product'
import { verifyAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // 驗證管理員權限
    await verifyAdminAuth(event)
    await connectDB()
    const id = event.context.params?.id
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少訂單 ID'
      })
    }
    const body = await readBody(event)
    // 可更新欄位：shipping, status, items, total, payment
    const updateData: any = {}
    if (body.shipping) updateData.shipping = body.shipping
    if (body.status) updateData.status = body.status
    if (body.items) updateData.items = body.items
    if (typeof body.total === 'number') updateData.total = body.total

    // 1. 取得原本訂單
    const originalOrder = await Order.findById(id)
    if (!originalOrder) {
      throw createError({ statusCode: 404, statusMessage: '找不到原始訂單' })
    }
    // 2. 建立原本商品數量對照表
    const originalItemMap = new Map<string, number>()
    originalOrder.items.forEach((item: any) => {
      originalItemMap.set(item.product.toString(), item.quantity)
    })

    // 3. 檢查庫存並異動庫存
    for (const item of updateData.items) {
      const product = (await Product.findById(item.id)) as IProduct | null
      if (!product) {
        throw createError({ statusCode: 404, statusMessage: '找不到商品' })
      }
      const originQty = originalItemMap.get(item.id) || 0
      const diff = item.quantity - originQty
      // diff > 0 代表要多扣庫存，diff < 0 代表要補回庫存
      if (product.quantity < diff) {
        throw createError({ statusCode: 400, statusMessage: '商品庫存不足' })
      }
      // 更新庫存
      product.quantity -= diff
      await product.save()
    }

    // 4. 處理 items 結構
    updateData.items = updateData.items.map((item: any) => ({
      product: item.id,
      quantity: item.quantity,
      price: item.price
    }))

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true
    })
      .populate<{ user: IUser }>('user')
      .populate('items.product')
      .lean()

    if (!updatedOrder) {
      throw createError({
        statusCode: 404,
        statusMessage: '找不到訂單'
      })
    }

    return {
      message: '更新成功!'
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '伺服器錯誤'
    })
  }
})
