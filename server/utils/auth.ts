import jwt from 'jsonwebtoken'
import { H3Event } from 'h3'
import userModel from '@/server/models/User'

interface JWTPayload {
  userId: string
  role: string
}

export function verifyJWTToken(event: H3Event): JWTPayload {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: '缺少授權 token'
    })
  }

  const token = authHeader.substring(7) // 移除 'Bearer ' 前綴

  if (!process.env.JWT_SECRET) {
    throw createError({
      statusCode: 500,
      statusMessage: 'JWT 密鑰未設定'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload
    return decoded
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: '無效的 token'
    })
  }
}

// 新增：管理員權限驗證函數
export async function verifyAdminAuth(event: H3Event): Promise<JWTPayload> {
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

    return { userId, role: user.role }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 其他錯誤
    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤'
    })
  }
}
