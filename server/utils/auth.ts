import jwt from 'jsonwebtoken'
import { H3Event } from 'h3'

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
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: '無效的 token'
    })
  }
} 