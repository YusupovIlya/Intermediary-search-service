import { IOrder, IOrderItem } from "../models";

export function getOrderImg(order: IOrder): string {
    const ordersWithImages = order.orderItems.filter(item => item.imageLink != "");
    if(ordersWithImages.length > 0)
      return ordersWithImages[0].imageLink;
    else
      return process.env.PUBLIC_URL + "/orderWithoutImg.jpg";
}

export function getOrderItemImg(orderItem: IOrderItem): string {
  if(orderItem.imageLink != "")
      return orderItem.imageLink;
  else
      return process.env.PUBLIC_URL + "/orderWithoutImg.jpg";
}