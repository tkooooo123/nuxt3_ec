import { createECPayment } from '../../utils/ecpay'
import Order from '~/server/models/Order'

export default defineEventHandler(async (event) => {
  const logger = event.context.logger
  try {
    const body = await readBody(event)
    const { orderId, amount, description, itemName, page } = body    
    const ecpay = createECPayment()
    const sn = Date.now().toString()
    const order = await Order.findByIdAndUpdate(orderId, { sn })
    if(!order) {
      throw createError({
        statusCode: 404,
        statusMessage: '找不到訂單'
      })
    }
    // 付款參數
    const paymentData = {
      MerchantTradeNo: sn,
      MerchantTradeDate: new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }),
      PaymentType: 'aio',
      TotalAmount: amount.toString(),
      TradeDesc: description,
      ItemName: itemName,
      ReturnURL: `${process.env.ECPAY_RETURN_URL}/api/ecpay/callback`,
      ClientBackURL: process.env.ECPAY_RETURN_URL,
      OrderResultURL: page === 'orders' ? `${process.env.ECPAY_RETURN_URL}/orders` : `${process.env.ECPAY_RETURN_URL}/createOrderSuccess/${orderId}`,
      ChoosePayment: 'ALL',
      EncryptType: 1,
    }

    const html = ecpay.payment_client.aio_check_out_all(paymentData)
    
    // 設定 Content-Type，回傳原始 HTML
  event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8')
  return html
  } catch (error: unknown) {
    // 如果是 Error 物件，就取 message
    const message =
      error instanceof Error ? error.message : 'ECPay payment creation failed'
  
    // 使用 Nuxt 3 全域 logger 取代 console
    logger.error('ECPay payment creation error:', error)
  
    return {
      success: false,
      error: message
    }
  }
})