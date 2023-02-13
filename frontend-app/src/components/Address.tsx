import { useTranslation } from "react-i18next";
import { IAddress } from "../models";

interface AddressProps {
    address: IAddress,
    setAddressInModal: (option: IAddress) => void,
    setModalActive: (option: boolean) => void
}

export default function Address({address, setAddressInModal, setModalActive}: AddressProps) {

    const { t } = useTranslation('user');
    return(
      <div 
      className="rounded-lg p-3 bg-white shadow-lg hover:bg-slate-100"
      onClick={() => {
        setAddressInModal(address);
        setModalActive(true);
      }}>
            <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("addresses.country", {country: address.country})}</p>
            <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("addresses.city", {city: address.city})}</p>
            <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("addresses.postCode", {postCode: address.postalCode})}</p>
            <p className="mt-2 text-lg text-slate-600 not-italic font-semibold font-sans">{address.label}</p>
      </div>
    );
}