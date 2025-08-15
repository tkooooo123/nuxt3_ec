import Product from '@/server/models/Product'
import { H3Event } from 'h3'
import { verifyAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event: H3Event) => {
  // 驗證管理員權限
  await verifyAdminAuth(event)

  try {
    const body = await readBody(event)
    const {
      id,
      name,
      price,
      origin_price,
      category,
      image,
      description,
      quantity,
      isEnabled,
      content,
      imagesUrl,
      unit,
      is_hottest,
      is_newest,
      notice,
      material,
      size,
      style
    } = body

    // 驗證必要欄位
    if (!id) {
      return createError({ statusCode: 400, statusMessage: '請提供產品 ID' })
    }

    if (!name) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品名稱' })
    }

    if (!price || price < 0) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品價格' })
    }

    if (!category) {
      return createError({ statusCode: 400, statusMessage: '請選擇商品分類' })
    }

    if (!image) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品主圖' })
    }

    if (!description) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品描述' })
    }

    if (!quantity || quantity < 0) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品數量' })
    }

    if (typeof isEnabled !== 'boolean') {
      return createError({
        statusCode: 400,
        statusMessage: '請輸入商品啟用狀態'
      })
    }

    if (!content) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品內容' })
    }

    if (!imagesUrl || !Array.isArray(imagesUrl)) {
      return createError({
        statusCode: 400,
        statusMessage: '請輸入商品圖片列表'
      })
    }

    if (!unit) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品單位' })
    }

    // 更新產品資料
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        origin_price: origin_price || 0,
        category,
        image,
        description,
        quantity,
        isEnabled,
        content,
        imagesUrl,
        unit,
        is_hottest: is_hottest || false,
        is_newest: is_newest || false,
        notice: notice || '',
        material: material || '',
        size: size || '',
        style: style || ''
      },
      { new: true } // 回傳更新後的資料
    )

    if (!updatedProduct) {
      return createError({ statusCode: 404, statusMessage: '找不到產品' })
    }

    return {
      message: '更新成功!',
      data: updatedProduct
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
