

export interface INewOrder {
    siteName: string
    siteLink: string
    performerFee: number
    address: IAddress
    orderItems: IOrderItem[]
  }
  export interface IAddress {
    id: number
    postalCode: string
    country: string
    city: string
    label: string
  }

export interface IOrder {
  id: number
  statesOrder: IState[]
  siteName: string
  siteLink: string
  performerFee: number
  orderItems: IOrderItem[]
  address: IAddress
  totalPrice: number
  offers: IOffer[],
  isEditable: boolean,
  isDeletable: boolean,
  hasConfirmedOffer: boolean,
  canBeClosed: boolean,
  trackCode: string
}

export interface IState {
  id: number,
  state: string
  description: string
  date: string
} 

export interface IOffer {
  id: number
  userName: string
  orderId: number
  itemsTotalCost: number
  deliveryCost: number
  expenses: number
  isSelected: boolean,
  comment: string
  statesOffer: IState[],
  isEditable: boolean,
  isDeletable: boolean,
  isNeedConfirmation: boolean,
  isNeedTrackNumber: boolean,
  isCanceld: boolean,
  deleted: string
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
    imageLink: string
    unitPrice: number
    units: number
  }

export interface IResponse{
    id: string
    message: string
  }

export interface IUser {
  firsName: string
  lastName: string
  role: string
}

export interface ILoginResponse {
  user: IUser
  token: string
  message: string
  id: string
}

export interface ILoginRequest {
  email: string
  password: string
}

export interface IPaginationMetaData {
  totalCount: number,
  pageSize: number,
  currentPage: number,
  totalPages: number,
  hasNext: boolean,
  hasPrevious: boolean
}

export interface IPaginatedOrders {
  paginationMeta: IPaginationMetaData,
  orders: IOrder[]
}

export interface IOrdersFilter {
  page: number,
  pageSize: number
  shops: string[],
  countries: string[],
  numOrderItems: number,
  minOrderPrice: number,
  maxOrderPrice: number,
  sortBy: string
}

export interface IUserOrdersFilter {
  orderStates: string[],
  shops: string[],
  sortBy: string
}

export interface IUserOffersFilter {
  offerStates: string[],
  sortBy: string
}