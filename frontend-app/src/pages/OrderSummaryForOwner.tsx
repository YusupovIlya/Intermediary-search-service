import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery, useRemoveOrderMutation } from "../store/intermediarysearchservice.api";
import OrderItemSummary from "../components/OrderItemSummary";
import { toast } from 'react-toastify';
import history from '../hooks/history';
import { Modal } from "../components/Modal";
import { useState } from "react";
import { CgArrowLongDownR } from "react-icons/cg";
import {getStateOrder} from "../hooks/getStateOrder";

export default function OrderSummaryForOwner() {
    const { id } = useParams();    
    const {data: order} = useGetOrderByIdQuery(id!, {refetchOnMountOrArgChange: true});
    const [removeOrder] = useRemoveOrderMutation();
    const [modalActive, setModalActive] = useState(false);

    const onDeleteHandler = async () => {
      if(order?.isDeletable){
          try{
            const promise =  removeOrder({orderId:order.id}).unwrap();
            await toast.promise(
              promise,
              {
                pending: 'Удаление заказа...',
                success: `Заказ #${order.id} был успешно удален!`,
                error: 'Возникла ошибка при удалении...',
              }
            );
            history.push("/user/orders");
        } catch (err) {
          console.log(err);
        }
      }
      else{
        toast.info("Заказ нельзя удалить, так как он уже в работе!");
      }
    }

    const onEditHandler = () => {
      if(order?.isEditable)
        history.push(`/user/orders/${order?.id}/edit`)
      else
        toast.info("Заказ нельзя редактировать, так как он уже в работе!");
    }

    return(
        <div className="w-10/12">
          <Modal 
            active={modalActive} 
            setActive={setModalActive} 
            content={
              <div className="p-4">
                <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">Подтвердите удаление заказа #{order?.id}</p>
                <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">Это действие нельзя будет отменить</p>
                <button 
                className="mt-2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => {
                  setModalActive(false);
                  onDeleteHandler();
                }}
                >Подтвердить</button>
              </div>
            }/>
          <div className="px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
          <div className="flex justify-start item-start space-y-4 flex-col">
            <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">Заказ #{order?.id}</h1>
            <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">От {order?.statesOrder[0].date}</p>
            {order?.statesOrder.map((item, index) => {
              return(
                <div className="flex flex-col space-y-2 justify-center">
                  <p className="text-base dark:text-white leading-4 text-gray-800">{item.date} - {getStateOrder(item.id)}</p>
                  {index != order?.statesOrder!.length! - 1 && <CgArrowLongDownR size={35} color="black"/>}
                </div>
              );
            })}             
            <button 
              className="w-36 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={() => onEditHandler()}
              >Редактировать</button>
            <button 
              className=" w-36 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={() => setModalActive(true)}
              >Удалить</button>
          </div>
          <div className="mt-6 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
            <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
              <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">

                <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Детали заказа</p>
                <a href={order?.siteLink} className="mt-2 font-medium text-blue-600 dark:text-blue-500 hover:underline text-base">Магазин: {order?.siteName}</a>
                {order?.orderItems.map((val, index) => <OrderItemSummary orderItem={val} key={index} />)}
              </div>
              <div className="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                  <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Итог</h3>
                  <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                    <div className="flex justify-between w-full">
                      <p className="text-base dark:text-white leading-4 text-gray-800">Общая стоимость заказа</p>
                      <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                        ${order?.totalPrice}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base dark:text-white leading-4 text-gray-800">Вознограждение</p>
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