import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { INewOffer, IOrder, IResponse } from "../models";
import { useCreateOfferMutation, useGetOrderByIdQuery } from "../store/intermediarysearchservice.api";
import OrderItemSummary from "../components/OrderItemSummary";
import { useTranslation } from "react-i18next";
import { toast, ToastContentProps } from "react-toastify";
import history from '../hooks/history';

export default function OrderSummary() {
    const { id } = useParams();
    const { t } = useTranslation(['order', 'buttons', 'validation_messages', 'toast_messages', 'user', 'titles']);
    document.title = t("orderSummary", {ns: 'titles', id: id});
    const [showForm, setShowForm] = useState(false);
    const [btnText, setbtnText] = useState(t("open", {ns: 'buttons'}));
    const [createOffer] = useCreateOfferMutation();
    const {register, handleSubmit, formState: { errors }} = useForm<INewOffer>({
      mode: "onBlur"
    });
    const {data: order} = useGetOrderByIdQuery(id!);


    const onSubmit = async (data: INewOffer) => {
      try {
          data.orderId = order?.id!;
          const promise = createOffer(data).unwrap();
          await toast.promise(
            promise,
            {
              pending: t("toastCreateOffer.pending", {ns: 'toast_messages'}),
              success: {
                render(response: ToastContentProps<IResponse>){
                  history.push("/user/offers");
                  return t("toastCreateOffer.success", {id: response.data?.id, ns: 'toast_messages'})!
                }
              },
              error: {
                render(response: ToastContentProps<number>){
                  if(response.data == 409) return t("toastCreateOffer.errorWhenOwner", {ns: 'toast_messages'})!
                  else return t("toastCreateOffer.error", {ns: 'toast_messages'})!
                }
              },
            }
          );
        } catch (err) {
          console.log(err);
        }
    }

    return(
        <div className="px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">

  <div className="flex justify-start item-start space-y-2 flex-col">
    <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">{t("orderSummary.title", {id: order?.id})}</h1>
    <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">{t("orderCard.from", {from: order?.statesOrder[0].date})}</p>
  </div>
  <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
      <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">

        <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">{t("orderSummary.details")}</p>
        <a href={order?.siteLink} target="_blank" className="mt-2 font-medium text-blue-600 dark:text-blue-500 hover:underline text-base">{t("orderCard.shop", {shop: order?.siteName})}</a>
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


        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-1">
          <div className="flex justify-between items-start w-full">
            <div className="flex justify-center items-center space-x-4">
              <div className="flex flex-col justify-start items-start space-y-2">
                <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">{t("orderSummary.offerYourself")}<br /></p>
                <button 
                  type="button" 
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  onClick={() => {
                    setShowForm(!showForm);
                    setbtnText((btnText) => {
                      if(btnText == t("open", {ns: 'buttons'}))
                        return t("close", {ns: 'buttons'})
                      else
                        return t("send", {ns: 'buttons'})
                    })
                  }}
                >{btnText}</button>
              </div>
            </div>
          </div>

          {showForm &&
          <div className="w-3/4">
            <form className="text-sm" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col mb-4">
                    <label className="text-gray-700">{t("orderSummary.total")}</label>
                    <input
                      {...register("itemsTotalCost",
                      { 
                        required: t("requredField", {ns: 'validation_messages'})!,
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message: t("offerRule", {ns: 'validation_messages'})
                      }, max: 99999999.99 })}
                      type="number"
                      step="any"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    />
                    <p className="text-red-600 inline">
                      {errors?.itemsTotalCost && errors.itemsTotalCost.message}
                    </p>           
                </div>

                <div className="flex flex-col my-4">
                    <label className="text-gray-700">{t("orderSummary.delivery")}</label>
                    <input
                      {...register("deliveryCost",
                      { 
                        required: t("requredField", {ns: 'validation_messages'})!,
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message: t("offerRule", {ns: 'validation_messages'})
                      }, max: 99999999.99 })}
                      type="number"
                      step="any"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    />
                    <p className="text-red-600 inline">
                      {errors?.deliveryCost && errors.deliveryCost.message}
                    </p> 
                </div>

                <div className="flex flex-col my-4">
                    <label className="text-gray-700">{t("orderSummary.expenses")}</label>
                    <input
                      {...register("expenses",
                      {
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message: t("offerRule", {ns: 'validation_messages'})
                      }, max: 99999999.99 })}
                      type="number"
                      step="any"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    />
                    <p className="text-red-600 inline">
                      {errors?.expenses && errors.expenses.message}
                    </p> 
                </div>

                <div className="flex flex-col my-4">
                    <label className="text-gray-700">{t("orderSummary.comment")}</label>
                    <textarea
                      {...register("comment",
                      { 
                        required: false,
                      })}
                      className="mt-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      placeholder="Your message..."
                      />               
                </div>
                <div className="w-full flex justify-center items-center">
                  <button type="submit" className="hover:bg-black dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">{t("send", {ns: 'buttons'})}</button>
                </div>
            </form>           
          </div>          
          }
        </div>


      </div>
    </div>
    <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
      <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">{t("orderSummary.contacts")}</h3>
      <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
        <div className="flex flex-col justify-start items-start flex-shrink-0">
          <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 7L12 13L21 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Link to={`/user/profile/${order?.userName}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{t("offer.toUserProfile", {ns: 'user'})}</Link>
          </div>
        </div>
        <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
          <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
            <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">{t("orderSummary.place")}</p>
              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{order?.address.label}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    )
}