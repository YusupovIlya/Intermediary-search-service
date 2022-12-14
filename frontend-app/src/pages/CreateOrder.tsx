import ReactDOM from "react-dom";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { INewOrder, IOrderItem, IOrderItemImage } from "../models";
import { MdDeleteForever } from "react-icons/md";
import { ReactTinyLink } from 'react-tiny-link';
import { useScrapper } from 'react-tiny-link'
import { useState } from "react";
import { useCreateOrderMutation } from "../store/intermediarysearchservice.api";

export default function CreateOrder() {
  const [createOrder, response] = useCreateOrderMutation();
  const [images, setImages] = useState<string[][]>([[]]);
  const [itemLinks, setItemLinks] = useState<string[]>([""]);
  const [source, setSource] = useState(-1);

  const [result, loading, error] = useScrapper({
    url: itemLinks[source],
    onSuccess: 
              (response:any) => {

                console.log(response); //

                if(response != undefined){

                  setImages([
                      ...images.slice(0, source),
                      response.image,
                      ...images.slice(source+1)
                    ]);                  
                }
              },
  });

  const {register, control, handleSubmit, formState: { errors }} = useForm<INewOrder>({
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
    console.log(data);
    createOrder(data)
      .unwrap();
  };

  const checkValidUrl = (url: string) => {
    const regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return regex.test(url);
  }
  
  return (
<div className="py-6 flex flex-col justify-center">
  <div className="relative py-3">
    <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
      <div className="mx-auto">
        <div className="flex items-center space-x-5">
          <div className="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">i</div>
          <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
            <h2 className="leading-relaxed">?????????? ???????????????? ????????????</h2>
            <p className="text-sm text-gray-500 font-normal leading-relaxed">???????????????????? ?????????????????? ???????????????? ????????????????????</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 pt-6">
            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div className="flex flex-col">
                <label className="leading-loose">???????????????? ??????????</label>
                <input
                {...register("siteName", { required: "?????????????? ???????????????? ??????????!", maxLength: 100 })}
                type="text" 
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
              <p className="text-red-600 inline">
                {errors?.siteName && errors.siteName.message}
              </p>              
              </div>
              <div className="flex flex-col">
                <label className="leading-loose">???????????? ???? ????????</label>
                <input
                {...register("siteLink", 
                { required: '?????????????? ???????????? ???? ????????!',
                  pattern: {
                    value: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
                    message: '???????????????? ???????????? ????????????!',
                  }})
                }
                type="text" 
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />            
                <p className="text-red-600 inline">
                  {errors?.siteLink && errors.siteLink.message}
                </p>
              </div>
              <div className="flex flex-col w-1/2">
                <label className="leading-loose">????????????????????????????</label>
                <input
                {...register("performerFee",
                { 
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "???????????????????????????? ???????????? ???????? ???? ?????????? 1 ??????.????.!"
                }, max: 99999999.99 })}
                type="number"
                step="any"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" 
                placeholder="?????????????? ???????????? ???????????????????????????? ?? $" />
                <p className="text-red-600 inline">
                  {errors?.performerFee && errors.performerFee.message}
                </p>                
              </div>
                {fields.map((field, index) => {
                return (
                <div key={field.id}>
                  <div className="flex flex-row space-x-5">
                    <div className="flex flex-col w-2/12">
                      <label className="leading-loose">???????????????? ????????????</label>
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.productName ? "error" : ""}`}
                        {...register(`orderItems.${index}.productName` as const, {
                          required: "?????????????? ???????????????? ????????????!"
                        })}
                      />                   
                    </div>
                    <div className="flex flex-col w-3/12">
                      <label className="leading-loose">?????????? ????????????</label>
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.options ? "error" : ""}`}
                        placeholder="????????????, ????????, ?????? ?? ??.??."
                        {...register(`orderItems.${index}.options` as const, {
                          required: "?????????????? ???????????????????????????? ????????????!"
                        })}
                      />
                    </div>
                    <div className="flex flex-col w-3/12">
                      <label className="leading-loose">???????????? ???? ??????????</label>
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.productLink ? "error" : ""}`}
                        {...register(`orderItems.${index}.productLink` as const, {
                          required: "?????????????? ???????????? ???? ??????????!",
                          pattern: {
                            value: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
                            message: '???????????????? ???????????? ????????????!',
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
                    <div className="flex flex-col w-2/12">
                      <label className="leading-loose">???????? ???? ??????????????</label>                        
                      <input
                        className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${errors?.orderItems?.[index]?.unitPrice ? "error" : ""}`}
                        placeholder="unitPrice"
                        type="number"
                        step="any"
                        {...register(`orderItems.${index}.unitPrice` as const, {
                          valueAsNumber: true,
                          required: "?????????????? ?????????????????? ???? ????. ????????????!",
                          min: {
                            value: 0.001,
                            message: "?????????????????????? ?????????????????? ????. ???????????? ???????????????????? 0.001 ??????. ????.!"
                          }
                        })}
                      />
                    </div>
                    <div className="flex flex-col w-2/12">
                      <label className="leading-loose">????????????????????</label>
                      <input
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="units"
                        type="number"
                        {...register(`orderItems.${index}.units` as const,
                        {
                          valueAsNumber: true,
                          required: "?????????????? ???????????????????? ????????????!",
                          min: {
                            value: 1,
                            message: "?????????????????????? ???????????????????? ???????????? ???????????????????? 1 ????."
                          }
                        })}
                      />
                    </div>
                    <div className="flex items-end justify-center">
                      <button type="button" onClick={() => {
                        remove(index);
                        setImages([ ...images.slice(0, index), ...images.slice(index+1) ]);
                        setItemLinks([ ...itemLinks.slice(0, index), ...itemLinks.slice(index+1) ]);
                      }}>
                        <MdDeleteForever size={35} />
                      </button>
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
              ???????????????? ??????????
              </button>
            </div>
            <div className="pt-4 flex items-start space-x-4">
              <button
                type="submit"
                className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline text-base">
                ??????????????
              </button>            
              <button
                className="border border-gray-200 bg-gray-200 text-gray-700 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-300 focus:outline-none focus:shadow-outline text-base">
                ?????????????????? ??????????
              </button>
            </div>
        </form>
      </div>
    </div>
  </div>
</div>
  );
}