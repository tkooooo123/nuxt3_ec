import { toast } from 'vue3-toastify'
import type { ApiResponse } from '~/types/api'
import type { CartResponse } from '~/types/cart'

export const useCart = () => {
  // 使用 useState 確保全局狀態共享
  const cartCount = useState('cartCount', () => 0)
  const cartItems = useState('cartItems', () => [] as any[])
  const token = useCookie('token')

  const loadingStore = useLoadingStore()

  // 獲取購物車資料
  const fetchCart = async () => {
    loadingStore.show()
    try {
      const { data } = await $fetch<ApiResponse<CartResponse>>('/api/cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      if (data) {
        cartItems.value =
          data.items.length > 0
            ? data.items.map((item: any) => ({
                id: item.product.id,
                quantity: item.quantity,
                price: item.price,
                image: item.product.image,
                unit: item.product.unit,
                name: item.product.name,
                origin_price: item.product.origin_price,
                stock: item.product.quantity
              }))
            : []
        cartCount.value = data.itemCount || 0
      }
    } catch (error: any) {
      toast.error(`${error.data?.statusMessage}`)
      // 如果未登入，清空購物車狀態
      cartItems.value = []
      cartCount.value = 0
    } finally {
      loadingStore.hide()
    }
  }

  // 加入購物車
  const addToCart = async (productId: string, quantity: number = 1) => {
    loadingStore.show()
    try {
      if (!token.value) {
        toast.error('請先登入')
        return
      }

      const { data } = await $fetch('/api/cart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: {
          productId,
          quantity
        }
      })

      // 更新購物車狀態
      if (data) {
        await fetchCart()
        toast.success('已成功加入購物車')
      }
    } catch (error: any) {
      toast.error(`${error.data?.statusMessage}`)
      return {
        success: false,
        error: error.data?.statusMessage || '加入購物車失敗'
      }
    } finally {
      loadingStore.hide()
    }
  }

  // 更新購物車數量
  const updateCartItemQuantity = async (
    productId: string,
    quantity: number
  ) => {
    loadingStore.show()
    try {
      await $fetch(`/api/cart/quantity`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: {
          productId,
          quantity
        }
      })

      // 重新獲取購物車資料
      await fetchCart()
    } catch (error: any) {
      toast.error(`${error.data?.statusMessage}`)
      return {
        success: false,
        error: error.data?.statusMessage || '更新數量失敗'
      }
    } finally {
      loadingStore.hide()
    }
  }

  // 移除購物車商品
  const removeFromCart = async (productId: string) => {
    loadingStore.show()
    try {
      await $fetch(`/api/cart/item`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: {
          productId
        }
      })

      // 重新獲取購物車資料
      await fetchCart()
      toast.success('移除商品成功')
    } catch (error: any) {
      toast.error(`${error.data?.statusMessage}`)
      return {
        success: false,
        error: error.data?.statusMessage || '移除商品失敗'
      }
    } finally {
      loadingStore.hide()
    }
  }

  // 清空購物車
  const clearCart = async () => {
    loadingStore.show()
    try {
      if (!token.value) {
        toast.error('請先登入')
        cartItems.value = []
        cartCount.value = 0
        return
      }
      await $fetch('/api/cart/clear', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      await fetchCart()
      toast.success('購物車已清空')
    } catch (error: any) {
      toast.error(`${error.data?.statusMessage || '清空購物車失敗'}`)
    } finally {
      loadingStore.hide()
    }
  }

  return {
    cartCount,
    cartItems,
    fetchCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart
  }
}
