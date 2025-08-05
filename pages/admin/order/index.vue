<script setup lang="ts">
import { toast } from 'vue3-toastify'
import adminAuth from '~/middleware/adminAuth'
import type { ApiResponse } from '~/types/api'
import type { OrderResponse } from '~/types/order'

definePageMeta({
  layout: 'admin',
  middleware: adminAuth
})
const token = useCookie('token')
const loadingStore = useLoadingStore()
const ordersList = ref<OrderResponse[]>([])
const deleteDialogVisible = ref<boolean>(false)
const selectedOrderId = ref<string>('')

const getOrders = async () => {
  loadingStore.show()
  try {
    const res = await $fetch<ApiResponse<OrderResponse[]>>('/api/admin/orders', {
      headers: {
          Authorization: `Bearer ${token.value}`
      }
    })
    if(res.data) {
      ordersList.value = res.data
    }

  } catch (error: any) {
    toast.error(`${error.data?.statusMessage}`)
  } finally {
      loadingStore.hide()
  }
}
const handleDelete = async () => {
  loadingStore.show()
  try {
    const res: any = await $fetch(`/api/admin/order/${selectedOrderId.value}`, {
      method: 'DELETE',
      headers: {
          Authorization: `Bearer ${token.value}`
      }
    })

    toast.success(`${res.message}`)

    await getOrders()
    deleteDialogVisible.value = false
  } catch (error: any) {
    toast.error(`${error.data?.statusMessage}`)
  } finally {
      loadingStore.hide()
  }
}

onMounted(() => {
  getOrders()
})
</script>

<template>
  <el-container class="bg-white m-4 rounded-3">
    <div class="w-full">
      <div class="p-6">
        <h1 class="text-8">訂單管理</h1>
        <el-table :data="ordersList" class="mt-6">
          <el-table-column label="No" width="60">
            <template #default="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="訂單編號" prop="id" />

          <el-table-column>
            <template #header>
              <div class="flex"><span>訂購人/</span><small>Email</small></div>
            </template>
            <template #default="scope">
              <div class="flex flex-col">
                <span class="font-600">{{ scope.row.shipping.name }}</span>
                <span>{{ scope.row.shipping.email }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template #header>
              <div class="flex"><span>訂購產品/</span><small>數量</small></div>
            </template>
            <template #default="scope">
              <div
                v-for="item in scope.row.items"
                :key="item.id"
                class="flex flex-col"
              >
                <span class="font-600">{{ item.name }}</span>
                <span> x {{ item.quantity }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="總金額" prop="total" width="100">
            <template #default="scope">
              <span>$ {{ scope.row.total }}</span>
            </template>
          </el-table-column>

          <el-table-column label="狀態">
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
          <el-table-column label="功能" width="160">
            <template #default="scope">
              <div class="flex">
                <button
                  @click="navigateTo(`/admin/order/${scope.row.id}`)"
                  class="hover:bg-blue-light bg-white text-blue-light border border-blue-light border-solid hover:text-white rounded-2 w-16 h-10 cursor-pointer transition-all duration-200 mr-2"
                >
                  編輯
                </button>
                <button
                  class="hover:bg-alert bg-white text-alert border border-alert border-solid hover:text-white rounded-2 w-16 h-10 cursor-pointer transition-all duration-200"
                  @click="
                    () => {
                      deleteDialogVisible = true
                      selectedOrderId = scope.row.id
                    }
                  "
                >
                  刪除
                </button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="刪除訂單" v-model="deleteDialogVisible">
        <div>
          <p>訂單「{{ selectedOrderId }}」刪除後將無法復原，你確定要刪除嗎？</p>
          <div class="flex justify-end">
            <button
              class="border border-1 border-solid border-black rounded-2 h-10 px-4 bg-white cursor-pointer"
              @click="deleteDialogVisible = false"
            >
              取消
            </button>
            <button
              class="bg-red text-white rounded-2 h-10 px-4 ml-4 cursor-pointer"
              @click="handleDelete"
            >
              確定
            </button>
          </div>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>
