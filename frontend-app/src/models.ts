

export interface INewOrder {
    siteName: string
    siteLink: string
    performerFee: number
    address?: IAddress
    orderItems: IOrderItem[]
  }
  export interface IAddress {
    postalCode: string
    country: string
    region: string
    label: string
  }

export interface IOrder {
  id: number
  statesOrder: IStateOrder[]
  siteName: string
  siteLink: string
  performerFee: number
  orderItems: IOrderItem[]
  address: IAddress
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

export interface INewOffer {
  orderId: number
  itemsTotalCost: number
  deliveryCost: number
  expenses: number
  comment: string
} 

export interface IOrderItem {
    productName: string
    options: string
    productLink: string
    images: IOrderItemImage[]
    unitPrice: number
    units: number
  }

export interface IResponse{
    id: string
    message: string
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