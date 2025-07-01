import Product from "@/server/models/Product";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const {
      name,
      price,
      category,
      image,
      description,
      quantity,
      isEnabled,
      content,
      imagesUrl,
      unit
    } = body;

    if (!name) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品名稱' });
    }
    if (!price || price < 0) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品價格' });
    }
    if (!category) {
      return createError({ statusCode: 400, statusMessage: '請選擇商品分類' });
    }
    if (!image) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品主圖' });
    }
    if (!description) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品描述' });
    }
    if (quantity || quantity < 0) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品數量' });
    }
    if (typeof isEnabled !== 'boolean') {
      return createError({ statusCode: 400, statusMessage: '請輸入商品啟用狀態' });
    }
    if (!content) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品內容' });
    }
    if (!imagesUrl || !Array.isArray(imagesUrl) || imagesUrl.length === 0) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品圖片列表' });
    }
    if (!unit) {
      return createError({ statusCode: 400, statusMessage: '請輸入商品單位' });
    }

    const product = await Product.create({
      name,
      price,
      category,
      image,
      description,
      quantity,
      isEnabled,
      content,
      imagesUrl,
      unit
    });
    if (product) {
      return {
        message: "新增成功!",
      };
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "伺服器錯誤",
    });
  }
});
