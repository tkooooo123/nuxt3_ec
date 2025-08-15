import userModel from "@/server/models/User";
import bcrypt from "bcrypt";
import { H3Event } from "h3";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<RegisterBody>(event);
    const { name, email, password, confirmPassword } = body;

    // 驗證資料格式
    if (!name || !email || !password || !confirmPassword) {
      throw createError({ statusCode: 400, statusMessage: "請填寫所有欄位" });
    }

    // 檢查 email 是否已存在
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: "此電子郵件已被註冊",
      });
    }
    //密碼與密碼確認不一致
    if (password !== confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: "密碼與確認密碼不一致，請重新輸入。",
      });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立新使用者
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    if (!newUser) {
      throw createError({
        statusCode: 500,
        statusMessage: "使用者建立失敗，請稍後再試。",
      });
    }

    // 回傳成功訊息
    return event.respondWith(
      new Response(
        JSON.stringify({
          message: "註冊成功!",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }
 
    throw createError({
      statusCode: 500,
      statusMessage: '伺服器錯誤'
    })
  }
});
