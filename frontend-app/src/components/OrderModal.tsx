import { IOrder } from "../models";
import OrderItemSummary from "./OrderItemSummary";


interface OrderModalProps {
    order: IOrder,
}

export default function OrderModal({order}: OrderModalProps) {
    return(
    <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-2 md:py-2 md:p-2 xl:p-2 w-full">
        <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Заказ #{order?.id}</p>
        <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600 mt-1">21st Mart 2021 at 10:34 PM</p>
        <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800 mt-1">Детали заказа</p>
        <a href={order?.siteLink} className="mt-2 font-medium text-blue-600 dark:text-blue-500 hover:underline text-base">Магазин: {order?.siteName}</a>
        {order?.orderItems.map((val, index) => <OrderItemSummary orderItem={val} key={index} />)}
        <div className="flex flex-col px-4 py-1 md:p-2 xl:p-2 w-full bg-gray-50 dark:bg-gray-800 space-y-4">
          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Итог</h3>
          <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
            <div className="flex justify-between w-full">
              <p className="text-base dark:text-white leading-4 text-gray-800">Общая стоимость заказа</p>
              <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                ${order?.orderItems.reduce((totalOrderPrice, item) => 
                totalOrderPrice + (item.unitPrice * item.units), 0)}
              </p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base dark:text-white leading-4 text-gray-800">Вознограждение</p>
              <p className="text-base dark:text-gray-300 leading-4 text-gray-600">${order?.performerFee}</p>
            </div>
          </div>
        </div>
    </div> 
    )
}