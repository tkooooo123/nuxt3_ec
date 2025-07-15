<script setup lang="ts">
// 使用 useAuth 檢查登入狀態
const { isLoggedIn } = useAuth()
// 如果未登入，重定向到登入頁面
if (!isLoggedIn()) {
  await navigateTo('/login')
}
const orders = ref([])
const token = useCookie('token')

const getOrders = async () => {
  try {
    const res: any = await $fetch('/api/order/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    const data = await res.data
    orders.value = data
  } catch (error) {
    console.log(error)
  }
}

const submitPayment = async (order: any) => {
  try {
    const res = await $fetch('/api/ecpay', {
      method: 'POST',
      body: {
        orderId: order.id,
        amount: order.total,
        description: '訂單測試',
        itemName: order.items.map((item: any) => item.name).join(','),
        page: 'orders'
      },
      responseType: 'text' // 回傳 HTML 字串
    })

    // 建立 form 並送出
    const div = document.createElement('div')
    div.innerHTML = res
    document.body.appendChild(div)
    div.querySelector('form')?.submit()
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getOrders()
})
</script>

<template>
  <div class="py-17 px-10">
    <h1
      class="mt-10 text-center relative after:content-[''] after:absolute after:z-[0] after:bottom-[-6px] after:left-0 after:w-36 after:h-3 after:bg-yellow-200 after:rounded-full after:left-1/2 after:-translate-x-1/2"
    >
      我的訂單
    </h1>
    <el-container class="max-w-180 mx-auto mt-10">
      <el-table v-if="orders.length > 0" :data="orders">
        <el-table-column prop="id" label="訂單編號" width="220" />
        <el-table-column label="建立時間" width="100">
          <template #default="scope">
            {{ scope.row.createdAt.slice(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column prop="total" label="總金額" width="80">
          <template #default="scope">
            <span class="font-500">${{ scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column label="付款方式" width="90">
          <template #default="scope">
            <span class="font-500">{{
              scope.row.payment === 'credit_card' ? '信用卡' : '貨到付款'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="處理狀態" width="100">
          <template #default="scope">
            <span
              v-if="
                scope.row.status === 'pending' &&
                scope.row.payment === 'credit_card'
              "
            >
            <button @click="submitPayment(scope.row)" class="hover:bg-white bg-#44AAE9 text-white hover:text-#44AAE9 border border-#44AAE9 border-solid text-3.5 rounded-2 w-18 h-10 cursor-pointer transition-all duration-200">前往付款</button>
            
            </span>
            <span v-else-if="scope.row.status === 'pending'">待付款</span>
            <span v-else-if="scope.row.status === 'paid'">已付款</span>
            <span v-else-if="scope.row.status === 'shipped'">已出貨</span>
            <span v-else-if="scope.row.status === 'delivered'">已到貨</span>
            <span v-else-if="scope.row.status === 'cancelled'">已取消</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <button @click="submitPayment(scope.row)" class="hover:bg-primary bg-white text-primary hover:text-white border border-primary border-solid text-3.5 rounded-2 w-18 h-10 cursor-pointer transition-all duration-200">查看更多</button>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-else
        class="flex flex-col items-center justify-center w-full text-gray-500"
      >
        <span class="text-2xl font-500">您目前沒有訂單建立</span>
        <button
          class="mt-4 bg-primary text-white px-4 py-2 rounded-md cursor-pointer"
          @click="navigateTo('/products')"
        >
          前往購物
        </button>
      </div>
    </el-container>
  </div>
</template>
