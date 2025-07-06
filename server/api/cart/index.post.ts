import Cart from '~/server/models/Cart'
import Product from '~/server/models/Product'
import { verifyJWTToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // 驗證用戶登入狀態並取得 userId
    const { userId } = verifyJWTToken(event)

    // 獲取請求體
    const body = await readBody(event)
    const { productId, quantity = 1 } = body
    console.log(userId, body)
    // 驗證必要參數
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: '商品 ID 為必填項目'
      })
    }

    if (quantity < 1) {
      throw createError({
        statusCode: 400,
        statusMessage: '商品數量必須大於 0'
      })
    }

    // 驗證商品是否存在且啟用
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

    // 檢查庫存
    if (product.quantity !== undefined && product.quantity < quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: `庫存不足，目前僅剩 ${product.quantity} 件`
      })
    }

    //const userId = session.user.id

    // 查找用戶的購物車
    let cart = await Cart.findOne({ user: userId })

    // 如果購物車不存在，創建新的購物車
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: []
      })
    }

    // 檢查商品是否已在購物車中
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )

    if (existingItemIndex > -1) {
      // 如果商品已存在，更新數量
      const newQuantity = cart.items[existingItemIndex].quantity + quantity
      
      // 再次檢查庫存
      if (product.quantity !== undefined && product.quantity < newQuantity) {
        throw createError({
          statusCode: 400,
          statusMessage: `庫存不足，無法加入 ${quantity} 件商品`
        })
      }
      
      cart.items[existingItemIndex].quantity = newQuantity
      cart.items[existingItemIndex].price = product.price
    } else {
      // 如果商品不存在，新增到購物車
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: product.price
      })
    }

    // 保存購物車
    await cart.save()

    // 回傳更新後的購物車（包含商品詳情）
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name image price quantity unit isEnabled'
    })

    return {
      message: '商品已成功加入購物車',
      data: updatedCart
    }

  } catch (error: any) {
    console.error('加入購物車錯誤:', error)
    
    // 如果是已知錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 其他錯誤
    throw createError({
      statusCode: 500,
      statusMessage: '加入購物車失敗，請稍後再試'
    })
  }
}) 