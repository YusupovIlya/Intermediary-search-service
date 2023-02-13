import { useParams } from "react-router-dom";
import { useCloseOrderMutation, useGetOrderByIdQuery, useRemoveOrderMutation } from "../store/intermediarysearchservice.api";
import OrderItemSummary from "../components/OrderItemSummary";
import { toast } from 'react-toastify';
import history from '../hooks/history';
import { Modal } from "../components/Modal";
import { useState } from "react";
import { CgArrowLongDownR } from "react-icons/cg";
import {getStateOrder} from "../hooks/getState";
import { useTranslation } from "react-i18next";

export default function OrderSummaryForOwner() {
    const { id } = useParams();
    const { t, i18n } = useTranslation(['order', 'buttons', 'toast_messages']);
    const {data: order, refetch} = useGetOrderByIdQuery(id!, {refetchOnMountOrArgChange: true});
    const [removeOrder] = useRemoveOrderMutation();
    const [closeOrder] = useCloseOrderMutation();
    const [modalDeleteActive, setModalDeleteActive] = useState(false);
    const [modalRecievedActive, setModalRecievedActive] = useState(false);

    const onDeleteHandler = async () => {
        try {
          const promise =  removeOrder({id: order!.id}).unwrap();
          await toast.promise(
            promise,
            {
              pending: t("toastDeleteOrder.pending", {ns: 'toast_messages'}),
              success: t("toastDeleteOrder.success", {id: order?.id, ns: 'toast_messages'})!,
              error: t("toastDeleteOrder.error", {ns: 'toast_messages'}),
            }
          );
          history.push("/user/orders");
        } catch (err) {
          console.log(err);
        }
    }

    const onEditHandler = () => {
      history.push(`/user/orders/${order?.id}/edit`);
    }

    const onRecievedHandler = async () => {
      try {
        const promise =  closeOrder({id: order!.id}).unwrap();
        await toast.promise(
          promise,
          {
            pending: t("toastCloseOrder.pending", {ns: 'toast_messages'}),
            success: t("toastCloseOrder.success", {ns: 'toast_messages'})!,
            error: t("toastCloseOrder.error", {ns: 'toast_messages'}),
          }
        );
        refetch();
      } catch (err) {
        console.log(err);
      }
  }

    return(
        <div className="w-10/12">
          <Modal 
            active={modalDeleteActive} 
            setActive={setModalDeleteActive} 
            content={
              <div className="p-4">
                <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("orderSummary.confirmRemove", {id: order?.id})}</p>
                <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("orderSummary.removeWarn")}</p>
                <button 
                className="mt-2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => {
                  setModalDeleteActive(false);
                  onDeleteHandler();
                }}
                >{t("confirm", {ns: 'buttons'})}</button>
              </div>
            }/>
          <Modal 
            active={modalRecievedActive} 
            setActive={setModalRecievedActive} 
            content={
              <div className="p-4">
                <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("orderSummary.confirmRecived", {id: order?.id})}</p>
                <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("orderSummary.removeWarn")}</p>
                <button 
                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={() => {
                  setModalRecievedActive(false);
                  onRecievedHandler();
                }}
                >{t("confirm", {ns: 'buttons'})}</button>
              </div>
            }/>            
          <div className="px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
          <div className="flex justify-start item-start space-y-4 flex-col">
            <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">{t("orderSummary.title", {id: order?.id})}</h1>
            <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">{t("orderCard.from", {from: order?.statesOrder[0].date})}</p>
            {order?.statesOrder.map((item, index) => {
              return(
                <div className="flex flex-col space-y-2 justify-center">
                  {i18n.language == "en" ? 
                    <p className="text-base dark:text-white leading-4 text-gray-800">{item.date} - {item.state}</p>
                    :
                    <p className="text-base dark:text-white leading-4 text-gray-800">{item.date} - {getStateOrder(item.id)}</p>
                  }
                  {index != order?.statesOrder!.length! - 1 && <CgArrowLongDownR size={35} color="black"/>}
                </div>
              );
            })}
            {order?.isEditable &&
              <button 
                className="w-36 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={() => onEditHandler()}
                >{t("edit", {ns: 'buttons'})}
              </button>
            }
            {order?.isDeletable &&
              <button 
                className="w-36 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => setModalDeleteActive(true)}
                >{t("remove", {ns: 'buttons'})}
              </button>            
            }
            {order?.canBeClosed &&
              <button 
                className="w-36 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
                onClick={() => setModalRecievedActive(true)}
                >{t("received", {ns: 'buttons'})}
              </button>             
            }
          </div>
          <div className="mt-6 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
            <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
              <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">

                <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">{t("orderSummary.details")}</p>
                <a href={order?.siteLink} className="mt-2 font-medium text-blue-600 dark:text-blue-500 hover:underline text-base">{t("orderCard.shop", {shop: order?.siteName})}</a>
                {order?.trackCode != null &&
                  <a href={`https://www.ordertracker.com/track/${order?.trackCode}`} target="_blank" className="mt-2 font-medium text-blue-600 dark:text-blue-500 hover:underline text-base">{t("orderCard.trackText", {track: order?.trackCode})}</a>
                }
                {order?.orderItems.map((val, index) => <OrderItemSummary orderItem={val} key={index} />)}
              </div>
              <div className="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                  <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">{t("orderSummary.resultTitle")}</h3>
                  <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                    <div className="flex justify-between w-full">
                      <p className="text-base dark:text-white leading-4 text-gray-800">{t("orderSummary.totalTitle")}</p>
                      <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                        ${order?.totalPrice}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base dark:text-white leading-4 text-gray-800">{t("orderForm.performerFee")}</p>
                      <p className="text-base dark:text-gray-300 leading-4 text-gray-600">${order?.performerFee}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
    )
}