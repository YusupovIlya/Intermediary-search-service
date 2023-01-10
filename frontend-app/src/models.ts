export interface INewOrder {
    siteName: string
    siteLink: string
    performerFee: number
    orderItems: IOrderItem[]
  }

export interface IOrder {
  id: number
  statesOrder: IStateOrder[]
  siteName: string
  siteLink: string
  performerFee: number
  orderItems: IOrderItem[]
}

export interface IStateOrder {
  state: string
  description: string
  date: Date
} 

export interface IOffer {
  id: number
  orderId: number
  userName: string
  itemsTotalCost: number
  deliveryCost: number
  expenses: number
  isSelected: boolean
} 

export interface IOrderItem {
    productName: string
    options: string
    productLink: string
    images: IOrderItemImage[]
    unitPrice: number
    units: number
  }

export interface ICreateOrderResponse{
    orderId: number
    message: string
    creatorName: string
  }

export interface IOrderItemImage {
    imageLink: string
  }

export interface IUser {
  firsName: string
  lastName: string
}

export interface ILoginResponse {
  user: IUser
  token: string
  message: string
}

export interface ILoginRequest {
  email: string
  password: string
}