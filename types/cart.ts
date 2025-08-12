export interface CartResponse {
  items: CartItemResponse[]
  totalItems: number
  totalPrice: number
  itemCount: number
}

export interface CartItemResponse {
  product: Product
  quantity: number
  price: number
}
export interface CartItem {
  id: string
  image: string
  name: string
  origin_price: number
  price: number
  quantity: number
  stock: number
  unit: string
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
