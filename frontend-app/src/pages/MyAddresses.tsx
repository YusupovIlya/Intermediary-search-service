import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Address from "../components/Address"
import { Modal } from "../components/Modal"
import { useDebounce } from "../hooks/useDebounce"
import { IPlace, useGeoCoder } from "../hooks/useGeoCoder"
import { useAddAddressMutation, useGetUserAddressesQuery } from "../store/intermediarysearchservice.api"

export interface IAddress {
    postalCode: string
    country: string
    region: string
    label: string
  }

export const placesData: IAddress[] = [
    {
        postalCode: "000000",
        country: "USA",
        region: "New York",
        label: "././/././"
    },
    {
        postalCode: "000000",
        country: "USA",
        region: "New York",
        label: "/././.."
    },
]

export default function MyAddresses() {
    const {
        data: addresses,
        isFetching,
        isLoading,
        refetch
      } = useGetUserAddressesQuery(null);
    const [addAddress, response] = useAddAddressMutation();
    const [modalActive, setModalActive] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [query, setQuery] = useState("");
    const debounced = useDebounce(query);
    const { places, loading } = useGeoCoder(debounced);
    const [selectedPlace, setSelectedPlace] = useState("");
    const [addressInModal, setAddressInModal] = useState<IAddress>(
        {
            postalCode: "",
            country: "",
            region: "",
            label: ""
        }
    );
    const { handleSubmit, setValue} = useForm<IAddress>({
        mode: "onBlur"
      });
    

  useEffect(() => {
    setDropdown(debounced.length > 3 && places?.length! > 0)
  }, [debounced, places]);


  const clickOnPlaceHandler = (place: IPlace) => {
        setSelectedPlace(place.label);
        setDropdown(false);
        setValue("country", place.country);
        setValue("postalCode", place.postal_code);
        setValue("region", place.region);
        setValue("label", place.label);
  }

  const onSubmit = async (data: IAddress) => {
    try {
        console.log(data);
        if(data.label == null) data.label = selectedPlace;
        const promise = addAddress(data).unwrap();
        setSelectedPlace("");
        setShowAddForm(false);
        await toast.promise(
          promise,
          {
            pending: 'Добавление адреса...',
            success: 'Адрес успешно добавлен!',
            error: 'Не удалось добавить адрес'
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
                    <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">Город: {addressInModal.region}</p>
                    <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">Страна: {addressInModal.country}</p>
                    <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">Индекс: {addressInModal.postalCode}</p>
                    <p className="mt-2 mb-2 text-lg text-slate-600 not-italic font-semibold font-sans">{addressInModal.label}</p>
                    <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Удалить</button>
                </div>
            }/>
            <ToastContainer />
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {addresses?.map((item, index) => (
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
                Добавить
            </button>}
            {showAddForm && 
            <form className="mt-6 flex flex-col space-y-2 sm:w-3/4" onSubmit={handleSubmit(onSubmit)}>   
                <div>
                    <input                   
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Страна, город или почтовый индекс..."
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
                    { places?.map((place, index) => (
                        <li
                            key={index}
                            onClick={() => clickOnPlaceHandler(place)}
                            className="py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer text-slate-600">
                            { place.label }
                        </li>
                    )) }
                    </ul>}                    
                    <div className="mt-3 flex flex-row space-x-2">
                        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Сохранить</button>
                        <button 
                            className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            onClick={() => setShowAddForm(false)}>
                            Отмена
                        </button>                        
                    </div>
                </div>
            </form>
            }
        </div>
    )
}