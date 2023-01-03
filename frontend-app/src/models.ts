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
    imgLink: string
    unitPrice: number
    units: number
  }

  export interface ICreateOrderResponse{
    orderId: number
    message: string
    creatorName: string
  }