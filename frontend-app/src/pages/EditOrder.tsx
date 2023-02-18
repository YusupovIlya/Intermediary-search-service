import { toast } from 'react-toastify';

import { useForm, useFieldArray } from "react-hook-form";
import { INewOrder } from "../models";
import { MdDeleteForever } from "react-icons/md";
import { ReactTinyLink } from 'react-tiny-link';
import { useScrapper } from 'react-tiny-link'
import { useEffect, useState } from "react";
import { useUpdateOrderMutation, useGetOrderByIdQuery, useGetUserAddressesQuery } from "../store/intermediarysearchservice.api";
import { useParams } from 'react-router-dom';
import history from '../hooks/history';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { API_KEY_CORS, CORS_URL } from '../authConst';

export default function EditOrder() {
  const auth = useAuth();
  const { id } = useParams();
  const { t } = useTranslation(['validation_messages', 'buttons', 'order', 'toast_messages']);
  const {data: order} = useGetOrderByIdQuery(id!);
  const [updateOrder] = useUpdateOrderMutation();
  const {data: response} = useGetUserAddressesQuery({id: auth.user.id!});
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [itemLinks, setItemLinks] = useState<string[]>([""]);
  const [source, setSource] = useState(-1);

  const [result, loading, error] = useScrapper({
    url: itemLinks[source],
    proxyUrl: CORS_URL,
    requestHeaders: {"x-cors-api-key":API_KEY_CORS},
    onSuccess: 
              (response:any) => {
                if(response != undefined){
                  let imgLink = "";
                  if(response.image[0] != undefined) imgLink = response.image[0];
                  setImages([
                    ...images.slice(0, source),
                    imgLink,
                    ...images.slice(source+1)
                  ]);                
                }
              },
  });

  useEffect(() => {
    order && setItemLinks(order.orderItems.map(item => {
                return item.productLink
            }));
    order && setImages(order.orderItems.map(item => item.imageLink));
  }, [order]);

  useEffect(() => {
    response?.data && setSelectedAddress(order?.address.label!);
  }, [response]);

  const {register, control, handleSubmit, formState: { errors }} = useForm<INewOrder>({
    mode: "onBlur",
    defaultValues: {
      siteName: order?.siteName,
      siteLink: order?.siteLink,
      performerFee: order?.performerFee,
      address: order?.address,
      orderItems: order?.orderItems
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "orderItems",
    control
  });

  const onSubmit = async (data: INewOrder) => {
    images.map((item, index) => data.orderItems[index] == undefined ? "": data.orderItems[index].imageLink = item);
    data.address = response?.data!.find(a => a.label == selectedAddress)!;
    const promise = updateOrder({id: order?.id!, data: data}).unwrap();
    await toast.promise(
      promise,
      {
        pending: t("toastEditOrder.pending", {ns: 'toast_messages'}),
        success: t("toastEditOrder.success", {id: id, ns: 'toast_messages'})!,
        error: t("toastEditOrder.error", {ns: 'toast_messages'})
      }
    );
    history.push("/user/orders");
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
          <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
            <h2 className="leading-relaxed">{t("orderForm.editTitle", {id: order?.id, from: order?.statesOrder[0].date, ns: "order"})}</h2>
            <p className="text-sm text-gray-500 font-normal leading-relaxed">{t("orderForm.editInfo", {ns: 'order'})}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 pt-6">
            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div className="flex flex-col">
                <label className="leading-loose">{t("orderForm.siteName", {ns: 'order'})}</label>
                <input
                {...register("siteName", { required: t("nameRequired")!, maxLength: 100 })}
                type="text" 
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
              <p className="text-red-600 inline">
                {errors?.siteName && errors.siteName.message}
              </p>              
              </div>
              <div className="flex flex-col">
                <label className="leading-loose">{t("orderForm.siteLink", {ns: 'order'})}</label>
                <input
                {...register("siteLink", 
                { required: t("linkRequired")!,
                  pattern: {
                    value: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
                    message: t("linkRegex"),
                  }})
                }
                type="text" 
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />            
                <p className="text-red-600 inline">
                  {errors?.siteLink && errors.siteLink.message}
                </p>
              </div>
              <div className="flex flex-col md:w-1/2">
                <label className="leading-loose">{t("orderForm.performerFee", {ns: 'order'})}</label>
                <input
                {...register("performerFee",
                { 
                  required: t("feeRequired")!,
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: t("feeRule"),
                }, max: 99999999.99 })}
                type="number"
                step="any"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" 
                placeholder={t("feePlaceholder")!} />
                <p className="text-red-600 inline">
                  {errors?.performerFee && errors.performerFee.message}
                </p>                
              </div>

              <div className="flex flex-col md:w-1/3">
                <label className="leading-loose">{t("orderForm.place", {ns: 'order'})}</label>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {response && response?.data != null && 
                  response?.data.map((addr) => (
                    <option 
                      onClick={() => setSelectedAddress(addr.label)} 
                      value={addr.label}>
                      {addr.label}
                    </option>))
                }
                </select>              
              </div>

                {fields.map((field, index) => {
                return (
                <div key={field.id}>
                  <div className="flex flex-col space-y-2 shadow-lg p-2 bg-slate-100 lg:flex-row lg:space-x-5">
                    <div className="flex flex-col lg:w-2/12 lg:justify-end">
                      <label className="leading-loose">{t("orderForm.productName", {ns: 'order'})}</label>
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.productName ? "error" : ""}`}
                        {...register(`orderItems.${index}.productName` as const, {
                          required: t("producNameRequired")!
                        })}
                      />                   
                    </div>
                    <div className="flex flex-col lg:w-3/12 lg:justify-end">
                      <label className="leading-loose">{t("orderForm.options", {ns: 'order'})}</label>
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.options ? "error" : ""}`}
                        placeholder={t("optionPlaceholder")!}
                        {...register(`orderItems.${index}.options` as const, {
                          required: t("optionsRequired")!
                        })}
                      />
                    </div>
                    <div className="flex flex-col lg:w-3/12 lg:justify-end">
                      <label className="leading-loose">{t("orderForm.productLink", {ns: 'order'})}</label>
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.productLink ? "error" : ""}`}
                        {...register(`orderItems.${index}.productLink` as const, {
                          required: t("productLinkRequired")!,
                          pattern: {
                            value: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
                            message: t("productLinkRegex"),
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
                      <label className="leading-loose">{t("orderForm.unitPrice", {ns: 'order'})}</label>                        
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.unitPrice ? "error" : ""}`}
                        placeholder="unitPrice"
                        type="number"
                        step="any"
                        {...register(`orderItems.${index}.unitPrice` as const, {
                          valueAsNumber: true,
                          required: t("unitPriceRequired")!,
                          min: {
                            value: 0.1,
                            message: t("unitPriceRule"),
                          }
                        })}
                      />
                    </div>
                    <div className="flex flex-col lg:w-2/12 lg:justify-end">
                      <label className="leading-loose">{t("orderForm.units", {ns: 'order'})}</label>
                      <input
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        type="number"
                        {...register(`orderItems.${index}.units` as const,
                        {
                          valueAsNumber: true,
                          required: t("unitsRequired")!,
                          min: {
                            value: 1,
                            message: t("unitsRule"),
                          }
                        })}
                      />
                    </div>
                    <div className="flex items-end justify-center">
                      {fields.length > 1 &&
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
                      proxyUrl={CORS_URL}
                      requestHeaders={{"x-cors-api-key": API_KEY_CORS}}
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
                    imageLink: ""
                  });

                  setImages([ ...images, "" ]);
                  setItemLinks([ ...itemLinks, "" ]);
                }
              }
              >
              {t("addItem", {ns: 'buttons'})}
              </button>
            </div>
            <div className="pt-4 flex items-start space-x-4">
              <button
                type="submit"
                className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline text-base">
                {t("save", {ns: 'buttons'})}
              </button>
              <button
                className="border border-gray-200 bg-gray-200 text-gray-700 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-300 focus:outline-none focus:shadow-outline text-base"
                onClick={(e) => {
                  e.preventDefault();
                  history.back();
                }}
                >     
                {t("back", {ns: 'buttons'})}
              </button>              
            </div>
        </form>
      </div>
    </div>
  </div>
</div>
  );
}