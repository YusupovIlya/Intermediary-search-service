export interface NewOrder {
    siteName: string
    siteLink: string
    performerFee: number
    orderItems: OrderItem[]
  }


export interface OrderItem {
    productName: string
    options: string
    productLink: string
    unitPrice: number
    units: number
  }