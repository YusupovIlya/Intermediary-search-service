import { IOrder, IOrderItem } from "../models";

export function getOrderImg(order: IOrder): string {
    const ordersWithImages = order.orderItems.filter(item => item.images.length > 0);
    if(ordersWithImages.length > 0)
      return ordersWithImages[0].images[0].imageLink;
    else
      return process.env.PUBLIC_URL + "/orderWithoutImg.jpg";
}

export function getOrderItemImg(orderItem: IOrderItem): string {
  if(orderItem.images.length > 0)
      return orderItem.images[0].imageLink;
  else
      return process.env.PUBLIC_URL + "/orderWithoutImg.jpg";
}