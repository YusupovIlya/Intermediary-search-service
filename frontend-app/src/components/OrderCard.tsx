import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getOrderImg } from "../hooks/getImage";
import { IOrder } from "../models";

interface OrderCardProps {
    order: IOrder
  }

export default function OrderCard({order}: OrderCardProps) {
    const { t } = useTranslation('order');

    return(
      <div className="rounded-lg p-2 bg-white shadow-lg hover:bg-slate-100">
        <Link to={`/orders/${order.id}`}>
            <div className="w-full overflow-hidden rounded-lg h-3/5">
              <img
                src={getOrderImg(order)}
                alt="Order image"
                className="h-full w-full object-cover object-center bg-gray-200 group-hover:opacity-75"
              />
            </div>
            <p className="mt-3 text-sm text-slate-600 not-italic font-medium font-sans">{order.orderItems.length > 1 && t("orderCard.numItems", {numItems: order.orderItems.length-1})}</p>
            <p className="mt-2 text-base text-gray-700">{t("orderCard.shop", {shop: order.siteName})}</p>
            <p className="mb-2 mt-1 text-base font-semibold text-gray-900">{t("orderCard.performerFee", {performerFee: order.performerFee})}</p>
            <p className="mb-3 text-sm text-slate-600 not-italic font-medium font-sans">{t("orderCard.from", {from: order.statesOrder[0].date})}</p>
        </Link>
      </div>
    );
}