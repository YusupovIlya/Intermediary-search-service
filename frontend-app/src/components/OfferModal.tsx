import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IOffer } from "../models";
import { useSelectOfferMutation } from "../store/intermediarysearchservice.api";


interface OfferModalProps {
    offer: IOffer,
    setOfferModalActive: (option: boolean) => void,
    updateFunc: () => void
}


export default function OfferModal({offer, setOfferModalActive, updateFunc}: OfferModalProps) {

    const [selectOffer] = useSelectOfferMutation();
    const { t } = useTranslation('user');
    const selectOfferHandler = async () => {
        try {
            setOfferModalActive(false);
            const promise = selectOffer({orderId: offer.orderId, offerId: offer.id}).unwrap();
            await toast.promise(
              promise,
              {
                pending: t("offerTotas.pending"),
                success: t("offerTotas.success", {id: offer.id})!,
                error: t("offerTotas.error")
              }
            );
            updateFunc();
          } catch (err) {
            console.log(err);
          }
    }
    
    return(
        <div className="p-4 flex flex-col space-y-4">
            <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("offer.total", {total: offer.itemsTotalCost})}</p>
            <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("offer.delivery", {delivery: offer.deliveryCost})}</p>
            <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("offer.expenses", {expenses: offer.expenses})}</p>
            <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("offer.comment", {comment: offer.comment})}</p>
            <Link to={`/user/${offer.userName}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{t("offer.toUserProfile")}</Link>
            <button 
                className="w-48 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={() => selectOfferHandler()}
            >{t("offer.selectOffer")}</button>
        </div>
    );
}