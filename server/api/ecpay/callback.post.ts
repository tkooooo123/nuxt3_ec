import Order from '~/server/models/Order'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { RtnCode, MerchantTradeNo } = body

    // 強制轉為字串再比較，避免型別錯誤
    if (RtnCode === '1' && MerchantTradeNo) {
      const order = await Order.findOne({ sn: MerchantTradeNo })

      if (order) {
        order.status = 'paid'
        await order.save()
      } else {
        console.warn(`⚠️ 找不到對應訂單：${MerchantTradeNo}`)
      }
    }

    // 綠界要求回傳字串 "1|OK"
    return '1|OK'
  } catch (err) {
    console.error('❌ 處理綠界付款回傳時發生錯誤：', err)
    return '0|Error'
  }
})