import ecpay_payment from 'ecpay_aio_nodejs'

export const createECPayment = () => {
  const config = useRuntimeConfig()
  
  const options = {
    OperationMode: config.ECPAY_MODE === 'production' ? 'Production' : 'Test',
    MercProfile: {
      MerchantID: config.ECPAY_MERCHANT_ID || '3002599',
      HashKey: config.ECPAY_HASH_KEY || 'spPjZn66i0OhqJsQ',
      HashIV: config.ECPAY_HASH_IV || 'hT5OJckN45isQTTs',
    },
    IgnorePayment: [],
    IsProjectContractor: false,
  }

  return new ecpay_payment(options)
}