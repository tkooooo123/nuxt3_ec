import Product from '~/server/models/Product'
import type { IProduct } from '~/server/models/Product'
import type { ICategory } from '~/server/models/Category'
import { H3Event } from 'h3'
import { connectDB } from '~/server/utils/mongoose'

export default defineEventHandler(async (event: H3Event) => {
  try {
    await connectDB()
    // 從 query 參數取得篩選條件
    const query = getQuery(event)
    const {
      page = 1,
      limit = 12,
      search = '',
      category = '',
      sort = 'createdAt',
      order = 'desc',
      is_hottest,
      is_newest,
      minPrice,
      maxPrice
    } = query

    // 建立查詢條件
    const filter: any = { isEnabled: true }

    // 搜尋條件
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    // 分類篩選
    if (category) {
      filter.category = category
    }

    // 熱門商品篩選
    if (is_hottest === 'true') {
      filter.is_hottest = true
    }

    // 最新商品篩選
    if (is_newest === 'true') {
      filter.is_newest = true
    }

    // 價格範圍篩選
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    // 排序條件
    const sortOptions: any = {}
    sortOptions[sort as string] = order === 'desc' ? -1 : 1

    // 計算分頁
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    // 查詢商品總數
    const total = await Product.countDocuments(filter)

    // 查詢商品列表並帶出分類資訊
    const products = await Product.find(filter)
      .populate('category')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum) as (IProduct & { category: ICategory })[]

    // 格式化回傳資料
    const data = products.map(product => ({
      id: product._id,
      name: product.name,
      image: product.image,
      imagesUrl: product.imagesUrl,
      description: product.description,
      content: product.content,
      quantity: product.quantity,
      price: product.price,
      origin_price: product.origin_price,
      unit: product.unit,
      is_hottest: product.is_hottest,
      is_newest: product.is_newest,
      notice: product.notice,
      material: product.material,
      size: product.size,
      style: product.style,
      category: product.category
        ? {
            id: product.category._id?.toString?.() || '',
            name: product.category.name || '',
            description: product.category.description || ''
          }
        : null,
      createdAt: product.createdAt
    }))

    // 計算分頁資訊
    const totalPages = Math.ceil(total / limitNum)
    const hasNextPage = pageNum < totalPages
    const hasPrevPage = pageNum > 1

    return event.respondWith(
      new Response(
        JSON.stringify({
          message: '取得成功!',
          data: {
            products: data,
            pagination: {
              currentPage: pageNum,
              totalPages,
              totalItems: total,
              itemsPerPage: limitNum,
              hasNextPage,
              hasPrevPage
            }
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    )
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 其他錯誤
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '無法取得商品列表'
    })
  }
})
