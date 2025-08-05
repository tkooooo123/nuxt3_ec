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
