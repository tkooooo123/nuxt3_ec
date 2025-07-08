<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
const ordersList = ref<any[]>([])

const getOrders = async () => {
  try {
    const res: any = await $fetch('/api/admin/orders')
    ordersList.value = res.data
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getOrders()
})
</script>

<template>
  <el-container>
    <div class="p-6 w-full">
    <h1>訂單管理</h1>
    <el-table :data="ordersList" class="mt-6" style="width: 100%">
      <el-table-column label="No" >
        <template #default="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="訂單編號" prop="id" />
   
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
      <el-table-column label="總金額" prop="total">
        <template #default="scope">
          <span>$ {{ scope.row.total }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="狀態" prop="status" />
      <el-table-column label="功能" width="160">
        <template #default="scope">
          <div class="flex">
            <button class="hover:bg-#44AAE9 bg-white text-#44AAE9 border border-#44AAE9 border-solid hover:text-white rounded-2 w-16 h-10 cursor-pointer transition-all duration-200 mr-2">編輯</button>
          <button class="hover:bg-#E04C10 bg-white text-#E04C10 border border-#E04C10 border-solid hover:text-white rounded-2 w-16 h-10 cursor-pointer transition-all duration-200">刪除</button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  </el-container>
</template>