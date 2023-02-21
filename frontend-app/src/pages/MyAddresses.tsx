import { toast } from 'react-toastify';

import { useState } from "react"
import { useForm } from "react-hook-form"
import Address from "../components/Address"
import { Modal } from "../components/Modal"
import { useDebounce } from "../hooks/useDebounce"
import { IPlace, useGeoCoder } from "../hooks/useGeoCoder"
import { useAddAddressMutation, useRemoveAddressMutation, useGetUserAddressesQuery } from "../store/intermediarysearchservice.api"
import { IAddress } from '../models';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export default function MyAddresses() {
    const auth = useAuth();
    const { t } = useTranslation(['user', 'buttons', 'toast_messages', 'order', 'titles']);
    document.title = t("addresses", {ns: 'titles'});
    const {data: response ,isLoading, refetch} = useGetUserAddressesQuery({id: auth.user.id!});
    const [deleteAddress] = useRemoveAddressMutation();
    const [addAddress] = useAddAddressMutation();

    const [modalActive, setModalActive] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [query, setQuery] = useState("");
    const debounced = useDebounce(query);
    const { places, loading } = useGeoCoder(debounced);
    const [selectedPlace, setSelectedPlace] = useState("");
    const [addressInModal, setAddressInModal] = useState<IAddress>(
        {
            id: 0,
            postalCode: "",
            country: "",
            city: "",
            label: ""
        }
    );

    const { handleSubmit, setValue, reset} = useForm<IAddress>({
        mode: "onBlur"
      });


  const clickOnPlaceHandler = (place: IPlace) => {
        setSelectedPlace(place.label);
        setDropdown(false);
        setValue("id", 0);
        setValue("country", place.country);
        setValue("postalCode", place.postal_code);
        setValue("city", place.region);
        setValue("label", place.label);
  }

  const onSubmit = async (data: IAddress) => {
    try {
        const promise = addAddress({id: auth.user.id!, data: data}).unwrap();
        setSelectedPlace("");
        setShowAddForm(false);
        reset();
        await toast.promise(
            promise,
            {
              pending: t("toastAddAddress.pending", {ns: 'toast_messages'}),
              success: t("toastAddAddress.success", {ns: 'toast_messages'})!,
              error: t("toastAddAddress.error", {ns: 'toast_messages'})
            }
        );
        refetch();
      } catch (err) {
        console.log(err);
      }
  }

  const onDeleteAddressHandler = async () => {
    try {
        setModalActive(false);
        const promise = deleteAddress({id: addressInModal.id, userId: auth.user.id!}).unwrap();
        await toast.promise(
          promise,
          {
            pending: t("toastDeleteAddress.pending", {ns: 'toast_messages'}),
            success: t("toastDeleteAddress.success", {ns: 'toast_messages'})!,
            error: t("toastDeleteAddress.error", {ns: 'toast_messages'})
          }
        );
        refetch();
      } catch (err) {
        console.log(err);
      }
}

    return(
        <div className="mx-auto max-w-2xl px-4 sm:py-15 sm:px-6 lg:max-w-7xl lg:px-8" onClick={() => setDropdown(false)}>
            <Modal active={modalActive} setActive={setModalActive} content={
                <div className="p-4">
                    <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("addresses.country", {country: addressInModal.country})}</p>
                    <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("addresses.city", {city: addressInModal.city})}</p>
                    <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("addresses.postCode", {postCode: addressInModal.postalCode})}</p>
                    <p className="mt-2 mb-2 text-lg text-slate-600 not-italic font-semibold font-sans">{addressInModal.label}</p>
                    <button 
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    onClick={() => onDeleteAddressHandler()}
                    >{t("remove", {ns: 'buttons'})}</button>
                </div>
            }/>
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {isLoading && <p className="text-center font-medium text-gray-800">{t("load", {ns: "order"})}</p>}
                {response?.status == 204 &&
                <div className="flex justify-center items-center">
                    <div className="mt-6 flex flex-col space-y-4 justify-center items-center">
                        <p className="font-medium text-gray-800">{t("noAddresses", {ns: "order"})}</p>
                    </div>                            
                </div>
                }
                {response && response?.data != null && 
                    response?.data.map((item, index) => (
                        <Address 
                        address={item} 
                        key={index}
                        setAddressInModal={setAddressInModal}
                        setModalActive={setModalActive}
                    />
                ))}
            </div>
            {!showAddForm &&
            <button 
                className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={() => setShowAddForm(true)}>
                {t("add", {ns: 'buttons'})}
            </button>}
            {showAddForm && 
            <form className="mt-6 flex flex-col space-y-2 sm:w-3/4" onSubmit={handleSubmit(onSubmit)}>   
                <div>
                    <input                   
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder={t("addresses.addPlaceholder")!}
                        onClick={(e) => {
                            setDropdown(true);
                            e.stopPropagation();
                        }}
                        onChange={(e) => {
                            setQuery(e.target.value); 
                            setSelectedPlace(e.target.value);
                        }}
                        value={selectedPlace}
                        required
                    />                   
                    { dropdown && <ul className="list-none max-h-[200px] overflow-y-scroll shadow-md bg-white">
                    { loading && <p className="text-center text-slate-600">Loading...</p> }
                    { places?.filter(p => p.postal_code != null).map((place, index) => (
                        <li
                            key={index}
                            onClick={() => clickOnPlaceHandler(place)}
                            className="py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer text-slate-600">
                            { place.label }
                        </li>
                    )) }
                    </ul>}                    
                    <div className="mt-3 flex flex-row space-x-2">
                        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">{t("save", {ns: 'buttons'})}</button>
                        <button 
                            className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            onClick={() => setShowAddForm(false)}>
                            {t("cancel", {ns: 'buttons'})}
                        </button>                        
                    </div>
                </div>
            </form>
            }
        </div>
    )
}