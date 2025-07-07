<script setup lang="ts">
import { get } from 'mongoose'

const router = useRouter()
const token = useCookie('token')
const cartItemList = ref<any[]>([
])
const ruleForm = ref({
  email: '',
  name: '',
  phone: '',
  address: '',
  message: '',
  payment: 'credit_card'
})
const getCart = async () => {
  const { data } = await $fetch('/api/cart', {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  })
  cartItemList.value = data.items.length > 0 ? data.items.map((item: any) => ({
    id: item.product.id,
    quantity: item.quantity,
    price: item.price,
    image: item.product.image,
    unit: item.product.unit,
    name: item.product.name,
    origin_price: item.product.origin_price,
    stock: item.product.quantity
  })) : []

}
const changeQuantity = async (id: number, quantity: number) => {

  try {
    const res = await $fetch('/api/cart/quantity', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        productId: id,
        quantity
      }
    })
    if (res) {
      getCart()
    }
  } catch (error) {
    console.log(error)
  }
}
const deleteCartItem = async (id: string) => {
  try {
    const res = await $fetch<any>('/api/cart/item', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        productId: id
      }
    })
    if (res) {
      getCart()
    }
  } catch (error) {
    console.log(error)
  }
}
const submitOrder = async () => {
  try {
    const res = await $fetch('/api/order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        shipping: ruleForm.value,
        payment: ruleForm.value.payment
      }
    })
    if (res) {
      router.push('/order')
    }
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  getCart()
})
</script>

<template>
  <div class="pt-17 px-3 sm:px-12">
    <h1
      class="text-center relative after:content-[''] after:absolute after:z-[2] after:bottom-[-6px] after:left-0 after:w-28 after:h-3 after:bg-yellow-200 after:rounded-full after:left-1/2 after:-translate-x-1/2">
      購物車
    </h1>
    <div class="mt-8 flex flex-col items-center justify-center" v-if="cartItemList.length === 0">
      <p class="font-bold">購物車還沒有任何商品喔！趕快去逛逛吧！！</p>
      <button class="bg-primary text-white px-4 py-2 rounded-full mt-4 cursor-pointer"
        @click="router.push('/products')">
        前去逛逛商品
      </button>
    </div>
    <div v-else>
      <div class="flex justify-end">
        <button
          class="flex items-center gap-2 hover:bg-primary hover:text-white bg-white border border-solid border-primary text-primary px-4 py-2 rounded-full mt-4 cursor-pointer transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          清空購物車
        </button>
      </div>
      <el-table :data="cartItemList" class="mt-6 hidden md:block" width="100%">
        <el-table-column label="圖示" width="100">
          <template #default="scope">
            <img :src="scope.row.image" alt="商品圖片" class="w-full h-full object-cover" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="品名" />
        <el-table-column prop="price" label="單價">
          <template #default="scope">
            <span>$ {{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="數量/單位"> </el-table-column>
        <el-table-column label="小計">
          <template #default="scope">
            <span>$ {{ scope.row.price * scope.row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope" width="80">
            <div
              class="cursor-pointer text-primary hover:bg-primary hover:text-white transition-all duration-150 border border-solid border-primary rounded-50% flex items-center justify-center w-9 h-9">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-6 flex flex-col md:hidden">
        <div v-for="item in cartItemList" :key="item.id" class="bg-primary/10 rounded-3 p-2 pb-5 mb-5">
          <div class="flex justify-between items-center p-2 border-b-2 border-b-solid border-#fafafa">
            <img :src="item.image" class="w-20 h-20 object-cover rounded-3" alt="" />
            <button
              @click="deleteCartItem(item.id)"
              class="flex items-center gap-1 hover:bg-primary hover:text-white bg-white border border-solid border-primary text-primary p-2 rounded-full mt-4 cursor-pointer transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              刪除
            </button>
          </div>
          <div class="flex items-center p-2 border-b-2 border-b-solid border-#fafafa">
            品名 <span class="ml-4 text-4.5 font-500">{{ item.name }}</span>
          </div>
          <div class="flex justify-between items-center p-2 border-b-2 border-b-solid border-#fafafa">
            單價
            <div class="flex items-center">
              <span class="line-through text-gray-500 text-3 mr-2">$ {{ item.origin_price }}</span>
              <span>$ {{ item.price }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center p-2 border-b-2 border-b-solid border-#fafafa">
            數量
            <div class="flex items-center">

              <button :disabled="item.quantity === 1" @click="changeQuantity(item.id, item.quantity - 1)"
                class="h-8 w-8 hover:bg-primary hover:text-white bg-white border border-solid border-primary text-primary rounded-l-[50%]  cursor-pointer transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                  stroke="currentColor" class="size-4 align-middle">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                </svg>
              </button>
              <span
                class="bg-white h-8 w-8 text-center flex items-center justify-center box-border  border-t border-b border-l-0 border-r-0 border-solid border-primary">{{
                  item.quantity }}</span>
              <button :disabled="item.quantity === item.stock" @click="changeQuantity(item.id, item.quantity + 1)"
                class="h-8 w-8 hover:bg-primary hover:text-white bg-white border border-solid border-primary text-primary rounded-r-[50%]  cursor-pointer transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                  stroke="currentColor" class="size-4 align-middle">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              <span class="ml-1">{{ item.unit }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center p-2 border-b-2 border-b-solid border-#fafafa">
            小計
            <span class="text-4.5 font-500">$ {{ item.price * item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="cartItemList.length > 0">
      <h1
        class="mt-15 text-center relative after:content-[''] after:absolute after:z-[2] after:bottom-[-6px] after:left-0 after:w-36 after:h-3 after:bg-yellow-200 after:rounded-full after:left-1/2 after:-translate-x-1/2">
        收件資料
      </h1>
      <el-form class="mt-6">
        <el-form-item label="Email" class="flex flex-col items-start">
          <el-input placeholder="請輸入Email" v-model="ruleForm.email" />
        </el-form-item>
        <el-form-item label="收件人姓名" class="flex flex-col items-start">
          <el-input placeholder="請輸入姓名" v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="收件人電話" class="flex flex-col items-start">
          <el-input placeholder="請輸入電話" v-model="ruleForm.phone" />
        </el-form-item>
        <el-form-item label="收件人地址" class="flex flex-col items-start">
          <el-input placeholder="請輸入地址" v-model="ruleForm.address" />
        </el-form-item>
        <el-form-item label="留言" class="flex flex-col items-start">
          <el-input type="textarea" placeholder="請輸入留言" v-model="ruleForm.message" />
        </el-form-item>
        <el-form-item label="付款方式" class="flex flex-col items-start">
          <el-radio-group v-model="ruleForm.payment">
            <el-radio label="credit_card">信用卡</el-radio>
            <el-radio label="cash_on_delivery">貨到付款</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="flex justify-end mt-6">
        <button
          @click="submitOrder"
          class="bg-primary text-white px-4 py-2 rounded-full mt-4 cursor-pointer">
          送出訂單
        </button>
      </div>
    </div>


  </div>
</template>

<style lang="scss" scoped>
:deep() {
  .el-form-item__content {
    width: 100%;
  }

  .el-form-item {
    margin: 0;
  }

  .el-input,
  .el-textarea,
  .el-date-editor,
  .el-input__inner {
    width: 100%;
    height: 50px;
  }

  .textarea.el-textarea {
    height: 115px;
  }
}
</style>
