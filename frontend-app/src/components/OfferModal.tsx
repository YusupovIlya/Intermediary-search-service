import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IOffer } from "../models";
import { useSelectOfferMutation } from "../store/intermediarysearchservice.api";


interface OfferModalProps {
    offer: IOffer,
    hasConfirmedOffer: boolean,
    setOfferModalActive: (option: boolean) => void,
    updateFunc: () => void
}


export default function OfferModal({offer, hasConfirmedOffer, setOfferModalActive, updateFunc}: OfferModalProps) {

    const [selectOffer] = useSelectOfferMutation();
    const { t } = useTranslation(['user', 'toast_messages']);
    const selectOfferHandler = async () => {
        try {
            setOfferModalActive(false);
            const promise = selectOffer({orderId: offer.orderId, offerId: offer.id}).unwrap();
            await toast.promise(
              promise,
              {
                pending: t("toastSelectOffer.pending", {ns: 'toast_messages'}),
                success: t("toastSelectOffer.success", {id: offer.id, ns: 'toast_messages'})!,
                error: t("toastSelectOffer.error", {ns: 'toast_messages'})
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
            <Link to={`/user/profile/${offer.userName}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{t("offer.toUserProfile")}</Link>
            {!offer.isSelected && !hasConfirmedOffer && !offer.isCanceld && offer.deleted == "" &&
            <button 
              className="w-48 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={() => selectOfferHandler()}
              >{t("offer.selectOffer")}
            </button>      
            }
        </div>
    );
}