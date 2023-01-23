import { ToastContainer, toast, ToastContentProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { useForm, useFieldArray } from "react-hook-form";
import { IResponse, INewOrder, IOrderItemImage } from "../models";
import { MdDeleteForever } from "react-icons/md";
import { ReactTinyLink } from 'react-tiny-link';
import { useScrapper } from 'react-tiny-link'
import { useState } from "react";
import { useCreateOrderMutation, useGetUserAddressesQuery } from "../store/intermediarysearchservice.api";

export default function CreateOrder() {
  const [createOrder] = useCreateOrderMutation();
  const {data: addresses} = useGetUserAddressesQuery(null);
  const [selectedAddress, setSelectedAddress] = useState<string>(addresses ? addresses[0].label : "");
  const [images, setImages] = useState<string[][]>([[]]);
  const [itemLinks, setItemLinks] = useState<string[]>([""]);
  const [source, setSource] = useState(-1);

  const [result, loading, error] = useScrapper({
    url: itemLinks[source],
    onSuccess: 
              (response:any) => {

                if(response != undefined){

                  setImages([
                      ...images.slice(0, source),
                      response.image,
                      ...images.slice(source+1)
                    ]);                  
                }
              },
  });

  const {register, control, handleSubmit, formState: { errors }, reset} = useForm<INewOrder>({
    mode: "onBlur",
    defaultValues: {
      orderItems: [{
        productName: "",
        options: "",
        productLink: "",
        unitPrice: 0,
        units: 0,
        images: []
      }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "orderItems",
    control
  });

  const onSubmit = (data: INewOrder) => {
    images.map((value, index) => {
      const imagesObj: IOrderItemImage[] = value.map(i => {return  {imageLink: i}});
      data.orderItems[index].images = imagesObj;
    });
    data.address = addresses?.find(a => a.label == selectedAddress);
    const promise = createOrder(data).unwrap();
    reset();
    setItemLinks([]);
    toast.promise(
      promise,
      {
        pending: 'Создание заказа...',
        success: {
          render(response: ToastContentProps<IResponse>){
            return `Заказ №${response.data?.id} успешно создан!`
          }
        },
        error: 'Не удалось создать заказ'
      }
    );
  };

  const checkValidUrl = (url: string) => {
    const regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return regex.test(url);
  }

  return (
<div className="xl:w-4/5 xl:py-6 flex flex-col justify-center w-full">
  <div className="relative py-3">
    <div className="relative px-4 py-10 bg-white shadow rounded-3xl sm:p-10">
      <div className="mx-auto">
        <div className="flex items-center space-x-5">
          <div className="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">i</div>
          <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
            <h2 className="leading-relaxed">Форма создания заказа</h2>
            <p className="text-sm text-gray-500 font-normal leading-relaxed">Пожалуйста заполните основную информацию</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 pt-6">
            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div className="flex flex-col">
                <ToastContainer />
                <label className="leading-loose">Название сайта</label>
                <input
                {...register("siteName", { required: "Введите название сайта!", maxLength: 100 })}
                type="text" 
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
              <p className="text-red-600 inline">
                {errors?.siteName && errors.siteName.message}
              </p>              
              </div>
              <div className="flex flex-col">
                <label className="leading-loose">Ссылка на сайт</label>
                <input
                {...register("siteLink", 
                { required: 'Введите ссылку на сайт!',
                  pattern: {
                    value: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
                    message: 'Неверный формат ссылки!',
                  }})
                }
                type="text" 
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />            
                <p className="text-red-600 inline">
                  {errors?.siteLink && errors.siteLink.message}
                </p>
              </div>
              <div className="flex flex-col md:w-1/2">
                <label className="leading-loose">Вознограждение</label>
                <input
                {...register("performerFee",
                { 
                  required: 'Введите размер вознограждения!',
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "Вознограждение должно быть не менее 1 ден.ед.!"
                }, max: 99999999.99 })}
                type="number"
                step="any"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" 
                placeholder="Укажите размер вознограждения в $" />
                <p className="text-red-600 inline">
                  {errors?.performerFee && errors.performerFee.message}
                </p>                
              </div>

              <div className="flex flex-col md:w-1/3">
                <label className="leading-loose">Куда доставить?</label>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  {addresses?.map(addr => 
                  <option onClick={() => 
                    setSelectedAddress(addr.label)} value={addr.label}>{addr.label}
                  </option>)}
                </select>              
              </div>

                {fields.map((field, index) => {
                return (
                <div key={field.id}>
                  <div className="flex flex-col space-y-2 shadow-lg p-2 bg-slate-100 lg:flex-row lg:space-x-5">
                    <div className="flex flex-col lg:w-2/12 lg:justify-end">
                      <label className="leading-loose">Название товара</label>
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.productName ? "error" : ""}`}
                        {...register(`orderItems.${index}.productName` as const, {
                          required: "Введите название товара!"
                        })}
                      />                   
                    </div>
                    <div className="flex flex-col lg:w-3/12 lg:justify-end">
                      <label className="leading-loose">Опции товара</label>
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.options ? "error" : ""}`}
                        placeholder="Размер, цвет, вес и т.д."
                        {...register(`orderItems.${index}.options` as const, {
                          required: "Введите характеристики товара!"
                        })}
                      />
                    </div>
                    <div className="flex flex-col lg:w-3/12 lg:justify-end">
                      <label className="leading-loose">Ссылка на товар</label>
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.productLink ? "error" : ""}`}
                        {...register(`orderItems.${index}.productLink` as const, {
                          required: "Введите ссылку на товар!",
                          pattern: {
                            value: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
                            message: 'Неверный формат ссылки!',
                          }
                        })}
                        onBlur={(e) => {
                          setItemLinks(itemLinks => {
                            itemLinks[index] = e.target.value;
                            return itemLinks;
                          });
                          setSource(index);
                        }}
                      />
                    </div>
                    <div className="flex flex-col lg:w-2/12 lg:justify-end">
                      <label className="leading-loose">Цена за единицу</label>                        
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.unitPrice ? "error" : ""}`}
                        placeholder="unitPrice"
                        type="number"
                        step="any"
                        {...register(`orderItems.${index}.unitPrice` as const, {
                          valueAsNumber: true,
                          required: "Укажите стоимость за ед. товара!",
                          min: {
                            value: 0.001,
                            message: "Минимальная стоимость ед. товара составляет 0.001 ден. ед.!"
                          }
                        })}
                      />
                    </div>
                    <div className="flex flex-col lg:w-2/12 lg:justify-end">
                      <label className="leading-loose">Количество</label>
                      <input
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="units"
                        type="number"
                        {...register(`orderItems.${index}.units` as const,
                        {
                          valueAsNumber: true,
                          required: "Укажите количество товара!",
                          min: {
                            value: 1,
                            message: "Минимальное количество товара составляет 1 ед."
                          }
                        })}
                      />
                    </div>
                    <div className="flex items-end justify-center">
                      {index != 0 &&
                      <button type="button" onClick={() => {
                        remove(index);
                        setImages([ ...images.slice(0, index), ...images.slice(index+1) ]);
                        setItemLinks([ ...itemLinks.slice(0, index), ...itemLinks.slice(index+1) ]);
                      }}>
                        <MdDeleteForever size={35} />
                      </button>
                    }
                    </div>
                  </div>
                  <div className="flex flex-row mt-4">
                    {(itemLinks[index] != "" && itemLinks[index] != undefined && checkValidUrl(itemLinks[index])) &&
                      <ReactTinyLink
                      cardSize="small"
                      showGraphic={true}
                      maxLine={2}
                      minLine={1}
                      url={itemLinks[index]}
                      />                       
                    }
                  </div>
                  <div className="flex flex-col">
                    <p className="text-red-600 inline">
                      {errors?.orderItems?.[index]?.productName && errors?.orderItems?.[index]?.productName?.message}
                    </p>
                    <p className="text-red-600 inline">
                      {errors?.orderItems?.[index]?.options && errors?.orderItems?.[index]?.options?.message}
                    </p>
                    <p className="text-red-600 inline">
                      {errors?.orderItems?.[index]?.productLink && errors?.orderItems?.[index]?.productLink?.message}
                    </p>
                    <p className="text-red-600 inline">
                      {errors?.orderItems?.[index]?.unitPrice && errors?.orderItems?.[index]?.unitPrice?.message}
                    </p>
                    <p className="text-red-600 inline">
                      {errors?.orderItems?.[index]?.units && errors?.orderItems?.[index]?.units?.message}
                    </p>                                                                   
                  </div>
                </div>
              );
            })}
            </div>
            <div className="flex flex-col">
              <button
                type="button"
                className="bg-yellow-300 px-5 py-3 text-base shadow-sm font-semibold tracking-wider  text-yellow-600 rounded-full hover:shadow-2xl hover:bg-yellow-400"
                onClick={() => {
                  append({
                    productName: "",
                    options: "",
                    productLink: "",
                    unitPrice: 0,
                    units: 0,
                    images: []
                  });

                  setImages([ ...images, [] ]);
                  setItemLinks([ ...itemLinks, "" ]);
                }
              }
              >
              Добавить товар
              </button>
            </div>
            <div className="pt-4 flex items-start space-x-4">
              <button
                type="submit"
                className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline text-base">
                Создать
              </button>            
              <button
                className="border border-gray-200 bg-gray-200 text-gray-700 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-300 focus:outline-none focus:shadow-outline text-base">
                Вернуться назад
              </button>
            </div>
        </form>
      </div>
    </div>
  </div>
</div>
  );
}