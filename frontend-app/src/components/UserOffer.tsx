import { IOffer } from "../models";
import { useState } from "react";
import { Link } from "react-router-dom";
import {getStateOffer} from "../hooks/getState";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddTrackToOrderMutation } from "../store/intermediarysearchservice.api";

interface UserOfferProps {
    offer: IOffer,
    setOfferInModal: (option: IOffer) => void,
    setOfferModalActive: (option: boolean) => void,
    updateFunc: () => void
  }

export default function UserOffer({offer, setOfferInModal, setOfferModalActive, updateFunc}
                                   : UserOfferProps) {

    const { register, handleSubmit, formState: { errors }} = useForm<{trackNumber: string}>({
        mode: "onBlur"
    });                                    
    const [showTrackForm, setShowTrackForm] = useState(false);
    const [addTrackNumber] = useAddTrackToOrderMutation();
    const { t, i18n } = useTranslation(['order', 'user', 'buttons', 'validation_messages']);

    const onSubmit = async (data: {trackNumber: string}) => {
        const promise = addTrackNumber(
            {
                id: offer.orderId, 
                trackNumber: data.trackNumber
            }).unwrap();
        await toast.promise(
          promise,
          {
            pending: t("toastAddTrack.pending", {ns: 'toast_messages'}),
            success: t("toastAddTrack.success", {ns: 'toast_messages'})!,
            error: t("toastAddTrack.error", {ns: 'toast_messages'})
          }
        );
        setShowTrackForm(false);
        updateFunc();
    }


    return(
        <div>
            <div 
                className="p-4 mt-3 flex justify-start flex-col md:flex-row items-start md:items-center space-y-4 md:space-x-6 xl:space-x-8 w-full shadow-md border-2 border-slate-300 hover:bg-slate-200"
                onClick={() => {
                    setOfferInModal(offer);
                    setOfferModalActive(true);
                }}>
                <div className="flex justify-between items-start w-full flex-col md:flex-row space-y-4 md:space-y-0">
                    <div className="w-full flex flex-col justify-start items-start space-y-8">
                        <p className="text-sm dark:text-white xl:text-base font-semibold leading-6 text-gray-800">{t("userOrder.offer", {id: offer.id})}</p>
                        <div className="flex justify-start items-start flex-col space-y-2">
                            <p className="text-sm dark:text-white leading-none text-gray-800">{t("orderCard.from", {from: offer.statesOffer[0].date})}</p>
                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-zinc-600"></span>
                                {offer.statesOffer.length > 0 && 
                                i18n.language == "en" ? offer.statesOffer.slice(-1)[0].state
                                : getStateOffer(offer.statesOffer.slice(-1)[0].id)}
                            </p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col justify-center items-center space-y-8">
                        <Link to={`/orders/${offer.orderId}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline text-base">{t("offer.goToOrder", { ns: 'user' })}</Link>
                    </div>

                    {offer.isNeedTrackNumber &&
                        <div className="w-full flex flex-col justify-center items-center pt-6">
                            <button 
                                className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowTrackForm(!showTrackForm);
                                }}
                                >{t("addTrack", { ns: 'buttons' })}
                            </button>
                        </div>                
                    }
                </div>
            </div>
            {showTrackForm &&
                <form className="mt-6 flex flex-col space-y-2 sm:w-3/4" onSubmit={handleSubmit(onSubmit)}>   
                    <input                   
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder={t("offer.trackPlaceholder", { ns: 'user' })!}
                        {...register("trackNumber", {
                            required: t("requredField", {ns: "validation_messages"})!,
                            pattern: {
                              value: /((\d{4})(\s?\d{4}){4}\s?\d{2})|((\d{2})(\s?\d{3}){2}\s?\d{2})|((\D{2})(\s?\d{3}){3}\s?\D{2})/,
                              message: t("trackRegex", {ns: "validation_messages"}),
                            }
                        })}
                    />
                    <p className="text-red-600 inline">
                        {errors?.trackNumber && errors.trackNumber.message}
                    </p>                                  
                    <div className="mt-3 flex flex-row space-x-2">
                        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">{t("save", {ns: 'buttons'})}</button>
                        <button 
                            className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            onClick={() => setShowTrackForm(false)}>
                            {t("cancel", {ns: 'buttons'})}
                        </button>                        
                    </div>
                </form>                
            }         
        </div>
    );
}