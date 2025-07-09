<script setup lang="ts">
const route = useRoute()
const orderId = route.params.id
const order = ref<any>()
const getOrder = async () => {
  const res:any = await $fetch(`/api/order/${orderId}`)
  console.log(res)
  order.value = res.data
}
onMounted(() => {
  getOrder()
})
</script>
<template>
  <div class="pt-17 px-12">
    <h1
      class="text-center relative after:content-[''] after:absolute after:z-[2] after:bottom-[-6px] after:left-0 after:w-54 after:h-3 after:bg-yellow-200 after:rounded-full after:left-1/2 after:-translate-x-1/2"
    >
     謝謝您的訂購
    </h1>
    <div class="mt-12 grid grid-cols-1 sm:grid-cols-2  max-w-7xl mx-auto">
      <div class="p-6 rounded-lg bg-red-100">
        <h2 class="text-7 text-primary font-bold">訂單資訊</h2>
        <p>訂單編號： {{ orderId }}</p>
        <p>收件人姓名： {{ order?.shipping.name }}</p>
        <p>收件人電話： {{ order?.shipping.phone }}</p>
        <p>收件人地址： {{ order?.shipping.address }}</p>
        <p>付款方式：<span v-if="order?.payment.method === 'credit'">信用卡</span><span v-else>貨到付款</span></p>
      </div>
      <div class="bg-white p-4 rounded-lg ">
      </div>
    </div>
  </div>
  
</template>