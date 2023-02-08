import { IOffer, IOrder } from "../models";
import {getOrderImg} from "../hooks/getImage";
import { useState } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import {getStateOrder} from "../hooks/getStateOrder";
import { useTranslation } from "react-i18next";

interface UserOrderProps {
    order: IOrder,
    setOfferInModal: (option: IOffer) => void,
    setOfferModalActive: (option: boolean) => void,
  }

export default function UserOrder({order, setOfferInModal, setOfferModalActive}
                                   : UserOrderProps) {

    const [showOffers, setShowOffers] = useState(false);
    const { t, i18n } = useTranslation('order');
    return(
        <div>
            <Link to={`/user/orders/${order.id}`}>
                <div className="p-4 mt-3 flex justify-start flex-col md:flex-row items-start md:items-center space-y-4 md:space-x-6 xl:space-x-8 w-full shadow-md border-2 border-slate-300 hover:bg-slate-200">
                    <div className="w-full md:w-40">
                        <img className="w-full hidden md:block" src={getOrderImg(order)} alt="Order" />
                        <img className="w-full md:hidden" src={getOrderImg(order)} alt="Order" />
                    </div>
                    <div className="flex justify-between items-start w-full flex-col md:flex-row space-y-4 md:space-y-0">
                        <div className="w-full flex flex-col justify-start items-start space-y-8">
                            <a href={order?.siteLink} target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline text-base">{t("orderCard.shop", {shop: order.siteName})}</a>
                            <div className="flex justify-start items-start flex-col space-y-2">
                                <p className="text-sm dark:text-white leading-none text-gray-800">{t("orderCard.from", {from: order.statesOrder[0].date})}</p>
                                <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-zinc-600"></span>
                                    {order.statesOrder.length > 0 && 
                                    i18n.language == "en" ? order.statesOrder.slice(-1)[0].state
                                    : getStateOrder(order.statesOrder.slice(-1)[0].id)}
                                </p>
                            </div>
                        </div>

                        <div className="w-full flex flex-col justify-start items-start space-y-8">
                            <p className="text-sm dark:text-white xl:text-base leading-6 text-gray-800">{t("orderCard.numItemsAll", {numItemsAll: order.orderItems.length})}</p>
                            <p className="text-sm dark:text-white xl:text-base font-semibold leading-6 text-gray-800">{t("orderCard.totalPrice", {totalPrice: order.totalPrice})}</p>
                        </div>


                        <div className="w-full flex flex-col justify-center items-center pt-6">
                            <button 
                                className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowOffers(!showOffers);
                                }}
                                >{t("userOrder.offers")}</button>
                        </div>
                    </div> 
                </div>               
            </Link>
            {showOffers &&
                <ul className="mt-2 list-none border-2 bg-white w-full lg:w-1/2">
                    {order.offers.length > 0 ?
                        order.offers.map((item, index) => {
                            return(
                                <li 
                                    key={index}
                                    className={classNames([
                                        "py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer text-slate-600",
                                        item.isSelected && "border-2 border-green-600",
                                      ])}
                                    onClick={() => {
                                        setOfferInModal(item);
                                        setOfferModalActive(true);
                                    }}  
                                    >
                                    {t("userOrder.offer", {id: item.id})}
                                </li>
                            )
                        })
                        :
                        <p className="py-2 px-4 bg-gray-500 text-white">{t("userOrder.noneOffers")}</p>              
                    }
                </ul>
            }            
        </div>
    );
}