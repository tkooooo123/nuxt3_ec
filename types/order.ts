export interface OrderResponse {
  id: string
  user: {
    userId: string
    name: string
    email: string
  }
  items: OrderItem[]
  total: number
  shipping: {
    name: string
    phone: string
    address: string
    email: string
    message: string
  }
  status: string
  payment: string
  sn: string
  createdAt: string
}

export interface OrderItem {
  id?: string
  name: string
  image?: string
  quantity: number
  price: number
  unit?: string
}

export interface AdminOrder {
  id: string
  user: {
    userId: string
    name: string
    email: string
  }
  items: Array<{
    id: string
    name: string
    image: string
    quantity: number
    price: number
    origin_price: number
    stock: number
    origin_quantity: number
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