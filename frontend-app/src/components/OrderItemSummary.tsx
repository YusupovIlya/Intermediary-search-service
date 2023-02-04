import { IOrderItem } from "../models";
import {getOrderItemImg} from "../hooks/getImage";

interface OrderItemSummaryProps {
    orderItem: IOrderItem,
  }

export default function OrderItemSummary({orderItem}: OrderItemSummaryProps) {

    return(
        <a href={orderItem.productLink} target="_blank" className="w-full">
            <div className="p-4 mt-3 flex justify-start flex-col md:flex-row items-start md:items-center space-y-4 md:space-x-6 xl:space-x-8 w-full shadow-md border-2 border-slate-300 hover:bg-slate-200">
                    <div className="w-full md:w-40">
                        <img className="w-full hidden md:block" src={getOrderItemImg(orderItem)} alt="dress" />
                        <img className="w-full md:hidden" src={getOrderItemImg(orderItem)} alt="dress" />
                    </div>
                    <div className="flex justify-between items-start w-full flex-col md:flex-row space-y-4 md:space-y-0">
                        <div className="w-full flex flex-col justify-start items-start space-y-8">
                            <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">{orderItem.productName}</h3>
                            <div className="flex justify-start items-start flex-col space-y-2">
                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-zinc-600">Параметры: </span> {orderItem.options}</p>
                            </div>
                        </div>
                        <div className="flex justify-between space-x-8 items-start w-full">
                            <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">${orderItem.unitPrice}</p>
                            <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">{orderItem.units} шт.</p>
                            <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">${orderItem.unitPrice * orderItem.units}</p>
                        </div>
                    </div>                
            </div>
        </a>
    );
}