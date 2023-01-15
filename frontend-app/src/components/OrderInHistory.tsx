import { useState } from "react";
import { useImgLinkForOrder } from "../hooks/useImgLinkForOrder";
import { IOrder } from "../models";

interface OrderInHistoryProps {
    order: IOrder,
    setOrderInModal: (option: IOrder) => void,
    setModalActive: (option: boolean) => void
}


export default function OrderInHistory({order, setOrderInModal, setModalActive}: OrderInHistoryProps) {
    const orderPreview = useImgLinkForOrder(order);
    
    return(
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            onClick={() => {
                setOrderInModal(order);
                setModalActive(true);
            }}>
        <td className="w-48 p-4">
            <img src={orderPreview} alt="Не удалось загрузить изображение товара"/>
        </td>
        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
        <a href={order?.siteLink} className="mt-2 font-medium text-blue-600 dark:text-blue-500 hover:underline text-base">{order?.siteName}</a>
        </td>
        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
            {order.orderItems.length}
        </td>
        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
        ${order?.orderItems.reduce((totalOrderPrice, item) => 
        totalOrderPrice + (item.unitPrice * item.units), 0)}
        </td>
        <td className="px-6 py-4">
            <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline"
            onClick={e => e.stopPropagation()}
            >Remove</a>
        </td>
    </tr>

    )

}