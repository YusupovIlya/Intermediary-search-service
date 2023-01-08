export interface INewOrder {
    siteName: string
    siteLink: string
    performerFee: number
    orderItems: IOrderItem[]
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

export interface User {
  first_name: string
  last_name: string
}

export interface UserResponse {
  user: User
  token: string
}

export interface LoginRequest {
  username: string
  password: string
}