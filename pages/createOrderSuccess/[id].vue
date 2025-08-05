<script setup lang="ts">
import type { ApiResponse } from '~/types/api'
import type { OrderResponse, OrderItem } from '~/types/order'
const route = useRoute()
const orderId = route.params.id
const order = ref<OrderResponse>()
const getOrder = async () => {
  const res = await $fetch<ApiResponse<OrderResponse>>(`/api/order/${orderId}`)
  order.value = res.data
}
const submitPayment = async () => {
  if (!order.value) return
  const res = await $fetch('/api/ecpay', {
    method: 'POST',
    body: {
      orderId: order.value.id,
      amount: order.value.total,
      description: '訂單測試',
      itemName: order.value.items.map((item: OrderItem) => item.name).join(','),
      page: 'createOrderSuccess'
    },
    responseType: 'text' // 回傳 HTML 字串
  })

  // 建立 form 並送出
  const div = document.createElement('div')
  div.innerHTML = res
  document.body.appendChild(div)
  div.querySelector('form')?.submit()
}
onMounted(() => {
  getOrder()
})
</script>
<template>
  <div class="pt-17 pb-20 px-12">
    <h1
      class="text-center relative after:content-[''] after:absolute after:z-[2] after:bottom-[-6px] after:left-0 after:w-54 after:h-3 after:bg-yellow-200 after:rounded-full after:left-1/2 after:-translate-x-1/2"
    >
      謝謝您的訂購
    </h1>
    <div
      class="mt-12 grid grid-cols-1 sm:grid-cols-2 max-w-7xl mx-auto shadow-custom rounded-lg overflow-hidden"
    >
      <div class="p-6 bg-white">
        <h2 class="text-7 text-primary font-bold">訂單資訊</h2>
        <p>訂單編號： {{ orderId }}</p>
        <p>收件人姓名： {{ order?.shipping.name }}</p>
        <p>收件人電話： {{ order?.shipping.phone }}</p>
        <p>收件人地址： {{ order?.shipping.address }}</p>
        <p>
          付款方式：<span v-if="order?.payment === 'credit_card'">信用卡</span
          ><span v-else>貨到付款</span>
        </p>
      </div>
      <div class="p-4 bg-red-100 flex flex-col justify-center items-center">
        <div
          v-if="order?.payment === 'credit_card' && order?.status === 'pending'"
          class="py-6"
        >
          <button
            class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
            @click="submitPayment"
          >
            立即付款
          </button>
        </div>
        <div v-else>
          <p class="text-center text-6 text-primary font-500">
            已收到您的訂單 <br />
            預計三天內為您出貨
          </p>
          <div class="flex justify-center">
            <button
              class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
              @click="navigateTo('/products')"
            >
              繼續逛逛
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.shadow-custom {
  box-shadow: rgba(0, 0, 0, 0.08) 2px 2px 8px 0px;
}
</style>
