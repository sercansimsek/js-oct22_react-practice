export interface User {
  id: number,
  name: string,
  sex: string,
}

export interface Product {
  id: number,
  name: string,
  categoryId: number,
}

export interface Category {
  id: number,
  title: string,
  icon: string,
  ownerId: number,
}

export interface ProductInfo {
  user: User | null,
  product: Product,
  category: Category,
}
