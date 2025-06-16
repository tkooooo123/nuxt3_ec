import userModel from "@/server/models/User";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { H3Event } from "h3";

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  _id: string
}

export default defineEventHandler(async (event:H3Event) => {
  const body = await readBody(event);
  const { email, password } = body;
  const user: User | null = await userModel.findOne({ email });

  if (!user) {
    throw createError({ statusCode: 400, statusMessage: "電子郵件不存在!" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createError({ statusCode: 401, statusMessage: '密碼錯誤!' })
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

   const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  )
   return event.respondWith(
    new Response(
      JSON.stringify({
        message: '登入成功!',
        data: {
          token,
          name: user.name,
          email: user.email,
          role: user.role,
          user_id: user._id
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  )
});
