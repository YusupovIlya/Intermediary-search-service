import { Link } from "react-router-dom";
import { getOrderImg } from "../hooks/getImage";
import { IOrder } from "../models";

interface OrderCardProps {
    order: IOrder
  }

export default function OrderCard({order}: OrderCardProps) {

    return(
      <div className="rounded-lg p-2 bg-white shadow-lg hover:bg-slate-100">
        <Link to={`/order/${order.id}`}>
            <div className="w-full overflow-hidden rounded-lg h-3/5">
              <img
                src={getOrderImg(order)}
                alt="Не удалось загрузить изображение товара"
                className="h-full w-full object-cover object-center bg-gray-200 group-hover:opacity-75"
              />
            </div>
            <p className="mt-3 text-sm text-slate-600 not-italic font-medium font-sans">{order.orderItems.length > 1 && `и еще ${order.orderItems.length-1} ед. в этом заказе`}</p>
            <p className="mt-2 text-base text-gray-700">Магазин: {order.siteName}</p>
            <p className="mb-2 mt-1 text-base font-semibold text-gray-900">Вознограждение: {order.performerFee}$</p>
            <p className="mb-3 text-sm text-slate-600 not-italic font-medium font-sans">От {order.statesOrder[0].date}</p>
        </Link>
      </div>
    );
}