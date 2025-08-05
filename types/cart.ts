export interface CartResponse {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  itemCount: number
}

interface CartItem {
  product: Product
  quantity: number
  price: number
}
interface Product {
  id: string
  name: string
  image: string
  quantity: number
  price: number
  origin_price: number
  unit: string
}
