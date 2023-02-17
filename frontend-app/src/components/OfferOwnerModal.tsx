import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { INewOffer, IOffer } from "../models";
import { useChangeStateOfferMutation, useRemoveOfferMutation, useUpdateOfferMutation } from "../store/intermediarysearchservice.api";


interface OfferOwnerModalProps {
    offer: IOffer,
    modalActive: boolean,
    setOfferModalActive: (option: boolean) => void,
    updateFunc: () => void
}


export default function OfferOwnerModal({offer, modalActive, updateFunc, setOfferModalActive}: OfferOwnerModalProps) {

    const { t } = useTranslation(['user', 'buttons', 'validation_messages', 'order', 'toast_messages']);
    const [updateOffer] = useUpdateOfferMutation();
    const [removeOffer] = useRemoveOfferMutation();
    const [changeStateOffer] = useChangeStateOfferMutation();
    const [isEditing, setIsEditing] = useState(false);
    const {register, handleSubmit, formState: { errors }, setValue} = useForm<INewOffer>({
      mode: "onBlur"
    });
    
    const onSubmit = async (data: INewOffer) => {
      setOfferModalActive(false);
      const promise = updateOffer({id: offer.id, data: data}).unwrap();
      await toast.promise(
        promise,
        {
          pending: t("toastUpdateOffer.pending", {ns: 'toast_messages'}),
          success: t("toastUpdateOffer.success", {id: offer.id, ns: 'toast_messages'})!,
          error: t("toastUpdateOffer.error", {ns: 'toast_messages'})
        }
      );
      updateFunc();
    }

    const onDeleteHandler = async () => {
      setOfferModalActive(false);
      const promise = removeOffer({id: offer.id}).unwrap();
      await toast.promise(
        promise,
        {
          pending: t("toastDeleteOffer.pending", {ns: 'toast_messages'}),
          success: t("toastDeleteOffer.success", {id: offer.id, ns: 'toast_messages'})!,
          error: t("toastDeleteOffer.error", {ns: 'toast_messages'})
        }
      );
      updateFunc();
    }

    const onCancelHandler = async () => {
      setOfferModalActive(false);
      const promise = changeStateOffer({id: offer.id, state: 2}).unwrap();
      await toast.promise(
        promise,
        {
          pending: t("toastCancelOffer.pending", {ns: 'toast_messages'}),
          success: t("toastCancelOffer.success", {id: offer.id, ns: 'toast_messages'})!,
          error: t("toastCancelOffer.error", {ns: 'toast_messages'})
        }
      );
      updateFunc();
    }

    const onConfirmHandler = async () => {
      setOfferModalActive(false);
      const promise = changeStateOffer({id: offer.id, state: 4}).unwrap();
      await toast.promise(
        promise,
        {
          pending: t("toastConfirmOffer.pending", {ns: 'toast_messages'}),
          success: t("toastConfirmOffer.success", {id: offer.id, ns: 'toast_messages'})!,
          error: t("toastConfirmOffer.error", {ns: 'toast_messages'})
        }
      );
      updateFunc();
    }

    useEffect(() => {
      !modalActive && setIsEditing(false);
    }, [modalActive]);

    const setValues = () => {
      setValue("orderId", offer.orderId);
      setValue("itemsTotalCost", offer.itemsTotalCost);
      setValue("deliveryCost", offer.deliveryCost);
      setValue("expenses", offer.expenses);
      setValue("comment", offer.comment);
    }

    return(
        <div className="p-4 flex flex-col space-y-4">
            {!isEditing &&
              <div>
                <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("offer.total", {total: offer.itemsTotalCost})}</p>
                <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("offer.delivery", {delivery: offer.deliveryCost})}</p>
                <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("offer.expenses", {expenses: offer.expenses})}</p>
                <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("offer.comment", {comment: offer.comment})}</p>
                <Link to={`/user/profile/${offer.userName}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{t("offer.toUserProfile")}</Link>
                <div className="mt-2 flex flex-row">
                  {offer.isEditable &&
                    <button 
                      type="button" 
                      className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
                      onClick={() => {
                        setIsEditing(true);
                        setValues();
                      }}
                    >{t("edit", {ns: 'buttons'})}
                    </button>
                  }
                  {offer.isDeletable &&
                    <button 
                      type="button" 
                      className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      onClick={() => onDeleteHandler()}
                    >{t("remove", {ns: 'buttons'})}
                    </button>
                  }
                  {offer.isNeedConfirmation &&
                    <div>
                      <button 
                        type="button" 
                        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
                        onClick={() => onConfirmHandler()}
                        >{t("confirm", {ns: 'buttons'})}
                      </button>
                      <button 
                        type="button" 
                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        onClick={() => onCancelHandler()}
                        >{t("cancel", {ns: 'buttons'})}
                      </button>                
                    </div>                
                  }            
                </div>                
              </div>            
            }
            {isEditing &&
              <form className="text-sm" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col mb-4">
                    <label className="text-gray-700">{t("orderSummary.total", {ns: 'order'})}</label>
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
                    <label className="text-gray-700">{t("orderSummary.delivery", {ns: 'order'})}</label>
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
                    <label className="text-gray-700">{t("orderSummary.expenses", {ns: 'order'})}</label>
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
                    <label className="text-gray-700">{t("orderSummary.comment", {ns: 'order'})}</label>
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
                  <button 
                    type="submit"
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
                    >{t("send", {ns: 'buttons'})}
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    type="button"  
                    className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >{t("cancel", {ns: 'buttons'})}
                  </button>
                </div>
              </form>              
            }
        </div>
    );
}