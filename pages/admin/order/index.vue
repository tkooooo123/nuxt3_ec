<script setup lang="ts">
import { toast } from 'vue3-toastify'
import adminAuth from '~/middleware/adminAuth'
import type { ApiResponse } from '~/types/api'
import type { OrderResponse } from '~/types/order'
import { FetchError } from 'ofetch'

definePageMeta({
  layout: 'admin',
  middleware: adminAuth
})
const token = useCookie('token')
const loadingStore = useLoadingStore()

const deleteDialogVisible = ref<boolean>(false)
const selectedOrderId = ref<string>('')

const statusMap: Record<string, string> = {
  paid: '已付款',
  shipping: '配送中',
  shipped: '已送達',
  completed: '已完成',
  cancelled: '已取消'
}


const {
  data: ordersList,
  refresh: refreshOrdersList
} = useAsyncData('ordersList', async () => {
  try {
    loadingStore.show()
    const res = await $fetch<ApiResponse<OrderResponse[]>>(
      '/api/admin/orders',
      {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    return res.data ?? []
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      toast.error(`${error.data?.statusMessage}`)
    }
    return []
  } finally {
    loadingStore.hide()
  }
}, {
  default: () => []
})

// 分頁相關
const {
  currentPage,
  pageSize,
  pagedData: pagedOrders
} = usePagination<OrderResponse>(ordersList, 10)

const handleDelete = async () => {
  loadingStore.show()
  try {
    const res = await $fetch<{ message: string }>(`/api/admin/order/${selectedOrderId.value}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    toast.success(`${res.message}`)

    await refreshOrdersList()
    deleteDialogVisible.value = false
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      toast.error(`${error.data?.statusMessage}`)
    }
  } finally {
    loadingStore.hide()
  }
}

</script>

<template>
  <el-container class="bg-white m-4 rounded-3">
    <div class="w-full">
      <div class="p-6">
        <h1 class="text-8">訂單管理</h1>
        <el-table :data="pagedOrders" class="mt-6 hidden md:block">
          <el-table-column label="No" width="60">
            <template #default="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="訂單編號" prop="id" />
          <el-table-column label="訂購日期">
            <template #default="scope">
              <span>{{ scope.row.createdAt.slice(0, 10) }}</span>
            </template>
          </el-table-column>

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
              <div v-for="item in scope.row.items" :key="item.id" class="flex flex-col">
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

              <span v-if="
                scope.row.status === 'pending' &&
                scope.row.payment === 'credit_card'
              ">待付款</span>
              <span v-else>{{ statusMap[scope.row.status] || '處理中' }}</span>

            </template>
          </el-table-column>
          <el-table-column label="功能" width="160">
            <template #default="scope">
              <div class="flex">
                <button @click="navigateTo(`/admin/order/${scope.row.id}`)"
                  class="hover:bg-blue-light bg-white text-blue-light border border-blue-light border-solid hover:text-white rounded-2 w-16 h-10 cursor-pointer transition-all duration-200 mr-2">
                  編輯
                </button>
                <button
                  class="hover:bg-alert bg-white text-alert border border-alert border-solid hover:text-white rounded-2 w-16 h-10 cursor-pointer transition-all duration-200"
                  @click="
                    () => {
                      deleteDialogVisible = true
                      selectedOrderId = scope.row.id
                    }
                  ">
                  刪除
                </button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- Mobile -->
        <div class="md:hidden mt-4">
          <div v-for="(order, i) in pagedOrders" :key="order.id"
            class="flex flex-col p-6 mb-4 border border-#E7e7e7 border-solid rounded-4">
            <span>No： {{ (currentPage - 1) * pageSize + i + 1 }}</span>
            <span class="mt-2">訂單編號：{{ order.id }}</span>
            <span class="mt-2">訂購日期：{{ order.createdAt.slice(0, 10) }}</span>
            <span class="mt-2">訂購人： {{ order.shipping.name }}</span>
            <span class="mt-2">Email： {{ order.shipping.email }}</span>
            <div class="flex mt-2">
              <span>訂購產品/<small>數量</small>：</span>
              <div class="flex flex-col">
                <span v-for="product in order.items" :key="product.name">
                  {{ product.name }} x {{ product.quantity }}
                </span>
              </div>
            </div>
            <span class="mt-2">總金額： ${{ order.total }}</span>
            <span class="mt-2">狀態：
              <span v-if="order.status === 'pending' && order.payment === 'credit_card'">待付款</span>
              <span v-else>{{ statusMap[order.status] || `處理中` }}</span>
            </span>
            <div class="flex mt-2">
              <button @click="navigateTo(`/admin/order/${order.id}`)"
                class="hover:bg-blue-light bg-white text-blue-light border border-blue-light border-solid hover:text-white rounded-2 w-16 h-10 cursor-pointer transition-all duration-200 mr-2">
                編輯
              </button>
              <button
                class="hover:bg-alert bg-white text-alert border border-alert border-solid hover:text-white rounded-2 w-16 h-10 cursor-pointer transition-all duration-200"
                @click="
                  () => {
                    deleteDialogVisible = true
                    selectedOrderId = order.id
                  }
                ">
                刪除
              </button>
            </div>
          </div>
        </div>

        <!-- 分頁 -->
        <div class="flex justify-center mt-6">
          <Pagination  :total="ordersList?.length" :page-size="pageSize" v-model:currentPage="currentPage" />
        </div>
      </div>
      <el-dialog title="刪除訂單" v-model="deleteDialogVisible">
        <div>
          <p>訂單「{{ selectedOrderId }}」刪除後將無法復原，你確定要刪除嗎？</p>
          <div class="flex justify-end">
            <button class="rounded-4 cursor-pointer px-4 py-2 mr-3 hover:brightness-90 transition duration-200"
              @click="deleteDialogVisible = false">
              取消
            </button>
            <button
              class="bg-red text-white rounded-4 hover:brightness-90 h-10 px-4 cursor-pointer transition duration-200"
              @click="handleDelete">
              確定
            </button>
          </div>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>
