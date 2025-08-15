import userModel from '@/server/models/User'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
        // 驗證用戶登入狀態並取得 userId
        const { userId } = verifyJWTToken(event)

    // 檢查用戶是否存在
    const user = await userModel.findById(userId).select('-password')

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: '用戶不存在'
      })
    }

    // 檢查是否為管理員
    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: '權限不足，需要管理員權限'
      })
    }

    // 返回管理員資訊
    return {
      message: '管理員權限驗證成功',
      data: {
        user_id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
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