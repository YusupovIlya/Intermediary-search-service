import { IOrder } from "../models";

export function useImgLinkForOrder(order: IOrder) {
    const ordersWithImages = order.orderItems.filter(item => item.images.length > 0);
    if(ordersWithImages.length > 0)
      return ordersWithImages[0].images[0].imageLink;
    else
      return process.env.PUBLIC_URL + "/orderWithoutImg.jpg";
}