<script setup lang="ts">
const loadingStore = useLoadingStore()
// 使用 useAuth 檢查登入狀態
const { isLoggedIn } = useAuth()
// 如果未登入，重定向到登入頁面
if (!isLoggedIn()) {
  await navigateTo('/login')
}
const orders = ref<any[]>([])
const token = useCookie('token')
const orderDialogVisible = ref<boolean>(false)
const selectedOrder = ref<any>()

const getOrders = async () => {
  loadingStore.show()
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
  } finally {
    await nextTick()
    requestAnimationFrame(() => {
      loadingStore.hide()
    })
  }
}

const submitPayment = async (order: any) => {
  loadingStore.show()
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
  } finally {
      loadingStore.hide()
    
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
      <div v-if="orders.length > 0" class="w-full">
        <el-table :data="orders" class="rounded-2 pb-4 hidden md:block">
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
                <button
                  @click="submitPayment(scope.row)"
                  class="hover:bg-white bg-#44AAE9 text-white hover:text-#44AAE9 border border-#44AAE9 border-solid text-3.5 rounded-2 w-18 h-10 cursor-pointer transition-all duration-200"
                >
                  前往付款
                </button>
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
              <button
                class="hover:bg-primary bg-white text-primary hover:text-white border border-primary border-solid text-3.5 rounded-2 w-18 h-10 cursor-pointer transition-all duration-200"
              @click="() => {
                selectedOrder = scope.row
                orderDialogVisible = true
              }"
                >
                查看更多
              </button>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-for="order in orders"
          :key="order?.id"
          class="flex flex-col p-6 bg-white mb-4 rounded-2 md:hidden"
        >
          <span>訂單編號：{{ order.id }}</span>
          <span class="mt-1"
            >建立時間： {{ order.createdAt.slice(0, 10) }}</span
          >
          <span class="mt-1">總金額： $ {{ order.total }}</span>
          <span class="mt-1"
            >付款方式：
            {{ order.payment === 'credit_card' ? '信用卡' : '貨到付款' }}</span
          >
          <div class="flex justify-between mt-2">
            <div class="flex items-center">
              <span>處理狀態：</span>
              <span
                v-if="
                  order.status === 'pending' && order.payment === 'credit_card'
                "
              >
                <button
                  @click="submitPayment(order)"
                  class="hover:bg-white bg-#44AAE9 text-white hover:text-#44AAE9 border border-#44AAE9 border-solid text-3.5 rounded-2 w-18 h-10 cursor-pointer transition-all duration-200"
                >
                  前往付款
                </button>
              </span>
              <span v-else-if="order.status === 'pending'">待付款</span>
              <span v-else-if="order.status === 'paid'">已付款</span>
              <span v-else-if="order.status === 'shipped'">已出貨</span>
              <span v-else-if="order.status === 'delivered'">已到貨</span>
              <span v-else-if="order.status === 'cancelled'">已取消</span>
            </div>
            <button
              @click="
                () => {
                  orderDialogVisible = true
                  selectedOrder = order
                }
              "
              class="hover:bg-primary bg-white text-primary hover:text-white border border-primary border-solid text-3.5 rounded-2 w-18 h-10 cursor-pointer transition-all duration-200"
            >
              查看更多
            </button>
          </div>
        </div>
      </div>

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
      <el-dialog
        title="訂單明細"
        v-model="orderDialogVisible"
        width="90%"
        class="max-w-200"
      >
        <div class="md:grid md:grid-cols-2">
          <div>
            <div>
              <span class="text-4.5 font-600 text-primary">訂單資訊</span>
              <div class="flex mt-2">
                <span class="w-15 mr-2">編號</span>
                <span> {{ selectedOrder?.id }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-15 mr-2">成立時間</span>
                <span> {{ selectedOrder?.createdAt.slice(0,19).replace('T', ' ') }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-15 mr-2">付款方式</span>
                <span>
                  {{
                    selectedOrder?.payment === 'credit_card'
                      ? '信用卡'
                      : '貨到付款'
                  }}</span
                >
              </div>
              <div class="flex mt-2">
                <span class="w-15 mr-2">處理狀態</span>
                <span
                  v-if="
                    selectedOrder.status === 'pending' &&
                    selectedOrder.payment === 'credit_card'
                  "
                >
                  <button
                    @click="submitPayment(selectedOrder)"
                    class="hover:bg-white bg-#44AAE9 text-white hover:text-#44AAE9 border border-#44AAE9 border-solid text-3.5 rounded-2 w-18 cursor-pointer transition-all duration-200"
                  >
                    前往付款
                  </button>
                </span>
                <span v-else-if="selectedOrder.status === 'pending'"
                  >待付款</span
                >
                <span v-else-if="selectedOrder.status === 'paid'">已付款</span>
                <span v-else-if="selectedOrder.status === 'shipped'"
                  >已出貨</span
                >
                <span v-else-if="selectedOrder.status === 'delivered'"
                  >已到貨</span
                >
                <span v-else-if="selectedOrder.status === 'cancelled'"
                  >已取消</span
                >
              </div>
            </div>
            <div class="mt-6">
              <span class="text-4.5 font-600 text-primary">聯絡資訊</span>
              <div class="flex mt-2">
                <span class="w-15 mr-2">姓名</span>
                <span> {{ selectedOrder?.shipping.name }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-15 mr-2">Email</span>
                <span> {{ selectedOrder?.shipping.email }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-15 mr-2">電話</span>
                <span> {{ selectedOrder?.shipping.phone }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-15 mr-2">地址</span>
                <span> {{ selectedOrder?.shipping.address }}</span>
              </div>
              <div class="flex mt-2">
                <span class="w-15 mr-2">留言</span>
                <span> {{ selectedOrder?.shipping.message || '無' }}</span>
              </div>
            </div>
          </div>
          <div class="mt-6 md:mt-0">
            <span class="text-4.5 font-600 text-primary">購買商品</span>
            <div
              v-for="item in selectedOrder.items"
              :key="item.id"
              class="mt-4 flex items-center"
            >
              <img
                class="w-20 h-20 block object-cover"
                :src="item.image"
                :alt="item.name"
              />
              <div class="flex justify-between items-center w-full">
                <div class="flex flex-col ml-4 justify-center">
                  <span>{{ item.name }}</span>
                  <span> {{ item.quantity }} / {{ item.unit }}</span>
                </div>
                <span class="ml-4"> $ {{ item.price }}</span>
              </div>
            </div>
            <hr class="my-4" />
            <div class="flex justify-between text-5 font-600">
              <span>總金額</span>
              <span>$ {{ selectedOrder.total }}</span>
            </div>
          </div>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
