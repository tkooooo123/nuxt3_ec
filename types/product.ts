export interface Product {
  id: string
  name: string
  description: string
  image: string
  imagesUrl: string[]
  quantity: number
  price: number
  origin_price: number
  content: string
  isEnabled: boolean
  unit: string
  is_hottest: boolean
  is_newest: boolean
  notice: string
  material: string
  size: string
  style: string
  category: string | { id: string; name: string; description: string }
  createdAt?: string
}

export interface ProductsResponse {
  products: Product[],
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

