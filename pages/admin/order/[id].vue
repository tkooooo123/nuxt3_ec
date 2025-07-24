<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

interface Order {
  id: string
  user: {
    userId: string
    name: string
    email: string
  }
  items: Array<{
    name: string
    image: string
    quantity: number
    price: number
    origin_price: number
    stock: number
    
  }>
  total: number
  shipping: {
    name: string
    phone: string
    address: string
    email: string
    message: string
  }
  status:
    | 'pending'
    | 'paid'
    | 'shipped'
    | 'shipping'
    | 'completed'
    | 'cancelled'
  payment: 'credit_card' | 'cash_on_delivery'
  createdAt: string // ISO 字串格式
}

const route = useRoute()
const order = ref<Order[]>([])




const getOrder = async () => {
  try {
    const { data } = await $fetch<any>(`/api/admin/order/${route.params.id}`)
    order.value = [data]
  } catch (error) {
    console.error('取得訂單失敗', error)
  }
}

onMounted(() => {
  getOrder()
})
</script>

<template>
  <el-container class="m-4">
    <div class="w-full">
      <div class="p-6 bg-white rounded-3">
        <h1 class="m-0 text-8 flex items-center">
          訂單管理
          <NuxtLink
            to="/admin/order"
            class="text-primary text-5 font-normal ml-4 flex items-center"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5 mt-0.5 mr-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            返回訂單列表</NuxtLink
          >
        </h1>

        <el-table :data="order" class="mt-6">
          <el-table-column label="訂單編號" prop="id"></el-table-column>
          <el-table-column label="訂購時間">
            <template #default="scope">
              <span>
                {{ scope.row.createdAt.slice(0, 19).replace('T', ' ') }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="處理狀態">
            <template #default="scope">
              <span
                v-if="
                  scope.row.status === 'pending' &&
                  scope.row.payment === 'credit_card'
                "
                >待付款</span
              >
              <span v-else-if="scope.row.status === 'paid'">已付款</span>
              <span v-else-if="scope.row.status === 'shipping'">配送中</span>
              <span v-else-if="scope.row.status === 'shipped'">已送達</span>
              <span v-else-if="scope.row.status === 'completed'">已送達</span>
              <span v-else-if="scope.row.status === 'cancelled'">已取消</span>
              <span v-else>處理中</span>
            </template>
          </el-table-column>
          <el-table-column label="付款方式">
            <template #default="scope">
              <span>{{
                scope.row.payment === 'credit_card' ? '信用卡' : '貨到付款'
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    
       
     
      <div class="flex flex-col xl:flex-row gap-5 mt-5">
        <div class="flex-1 p-6 bg-white rounded-3">
          <span class="text-5 font-600">訂購人資料</span>
          <el-form class="mt-6">
            <el-form-item label="姓名">
              <el-input placeholder="請輸入姓名"></el-input>
            </el-form-item>
            <el-form-item label="電話">
              <el-input placeholder="請輸入電話"></el-input>
            </el-form-item>
            <el-form-item label="信箱">
              <el-input type="email" placeholder="請輸入Email"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input placeholder="請輸入地址"></el-input>
            </el-form-item>
            <el-form-item label="留言">
              <el-input
                class="textarea"
                type="textarea"
                :rows="4"
                placeholder="請輸入留言"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="xl:w-60%  flex flex-col gap-2 bg-white p-6 rounded-3">
        
          <span class="text-5 font-600">訂購產品</span>
          
         
       
        <el-table :data="order[0]?.items">
            <el-table-column label="圖示" width="100">
              <template #default="scope">
                <img class="w-20 rounded-3 object-cover block" :src="scope.row.image" :alt="scope.row.name">
              </template>
            </el-table-column>
            <el-table-column label="品名" prop="name"></el-table-column>
            <el-table-column label="單價">
              <template #default="scope">
                <span><small class="line-through"> $ {{ scope.row.origin_price }}</small> $ {{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="數量/單位" width="150">
              <template #default="scope">
                <div class="flex items-center">
              <button
                :disabled="scope.row.quantity === 1"
             
                class="h-8 w-8 hover:bg-primary hover:text-white bg-white border border-solid border-primary text-primary rounded-l-[50%] cursor-pointer transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                  stroke="currentColor"
                  class="size-4 align-middle"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 12h14"
                  />
                </svg>
              </button>
              <span
                class="bg-white h-8 w-8 text-center flex items-center justify-center box-border border-t border-b border-l-0 border-r-0 border-solid border-primary"
                >{{ scope.row.quantity }}</span
              >
              <button
                :disabled="scope.row.quantity === scope.row.stock"
              
                class="h-8 w-8 hover:bg-primary hover:text-white bg-white border border-solid border-primary text-primary rounded-r-[50%] cursor-pointer transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                  stroke="currentColor"
                  class="size-4 align-middle"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
              <span class="ml-1">/ {{ scope.row.unit }}</span>
            </div>
              </template>
            </el-table-column>
            <el-table-column label="小計">
              <template #default="scope">
                <span> $ {{ scope.row.quantity * scope.row.price }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end mt-6">
            <span class="mr-8">總計</span>
            <span class="text-primary font-600"> $ {{ order[0]?.total }}</span>
          </div>
      </div>
      </div>
      <div class="mt-5 p-6 bg-white rounded-3 flex">
        <button
          class="bg-primary text-white rounded-7.5 h-10 px-4 cursor-pointer"
        >
          儲存變更
        </button>
        <NuxtLink
          to="/admin/order"
          class="text-primary text-5 font-normal ml-4 flex items-center"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5 mt-0.5 mr-1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          返回訂單列表</NuxtLink
        >
      </div>
      
    </div>
  </el-container>
</template>

<style lang="scss" scoped>
:deep() {
  .el-form-item {
    margin: 0;
    padding: 8px 0;
    border-bottom: 1px solid #ececec;
  }
  .el-form-item__label {
    font-weight: 600;
    margin-right: 20px;
  }
  .el-input__inner {
    height: 40px;
  }
}
</style>
