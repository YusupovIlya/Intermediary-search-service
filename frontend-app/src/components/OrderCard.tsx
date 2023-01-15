import { Link } from "react-router-dom";
import { useImgLinkForOrder } from "../hooks/useImgLinkForOrder";
import { IOrder } from "../models";

interface OrderCardProps {
    order: IOrder
  }

export default function OrderCard({order}: OrderCardProps) {
    const orderPreview = useImgLinkForOrder(order);

    return(
      <div className="rounded-lg p-3 bg-white shadow-lg hover:bg-slate-100">
        <Link to={`/order/${order.id}`}>
            <div className="w-full overflow-hidden rounded-lg h-3/5">
              <img
                src={orderPreview}
                alt="Не удалось загрузить изображение товара"
                className="h-full w-full object-cover object-center bg-gray-200 group-hover:opacity-75"
              />
            </div>
            <p className="mt-3 text-lg text-slate-600 not-italic font-medium font-sans">{order.orderItems.length > 1 && `и еще ${order.orderItems.length-1} ед. в этом заказе`}</p>
            <p className="mt-2 text-lg text-gray-700">Магазин: {order.siteName}</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">Вознограждение: {order.performerFee}$</p>
        </Link>
      </div>
    );
}