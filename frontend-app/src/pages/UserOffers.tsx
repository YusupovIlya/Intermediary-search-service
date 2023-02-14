import { useEffect, useState } from "react";
import { useGetUserOffersQuery } from "../store/intermediarysearchservice.api";
import { IOffer, IUserOffersFilter } from "../models";
import classNames from "classnames";
import {statesOffer} from "../hooks/getState";
import UserOrder from "../components/UserOrder";
import { Modal } from "../components/Modal";
import OfferModal from "../components/OfferModal";
import { useTranslation } from "react-i18next";
import UserOffer from "../components/UserOffer";
import OfferOwnerModal from "../components/OfferOwnerModal";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function UserOffers() {

    const auth = useAuth();
    const [filter, setFilter] = useState<IUserOffersFilter>({
        offerStates: [],
        sortBy: "newest"
      });
      const { t, i18n } = useTranslation(['order', 'buttons']);
      const { data: response, isLoading, refetch } = useGetUserOffersQuery({id: auth.user.id!, param: filter}, {refetchOnMountOrArgChange: true});
      const [mobileFilter, setMobileFilter] = useState(false);
      const [sortActive, setSortActive] = useState(false);
      const [stateOfferActive, setStateOfferActive] = useState(false);
      const [offerModalActive, setOfferModalActive] = useState(false);
      const [typeSort, setTypeSort] = useState("newest");
      const [offerInModal, setOfferInModal] = useState<IOffer>({
          id: 0,
          orderId: 0,
          itemsTotalCost: 0,
          deliveryCost: 0,
          expenses: 0,
          isSelected: false,
          comment: "",
          statesOffer: [],
          userName: "",
          isEditable: false,
          isDeletable: false,
          isNeedConfirmation: false,
          isNeedTrackNumber: false,
          isCanceld: false,
          deleted: ""
      });
  
      useEffect(() => {
        setFilter(filter => {
          return {
            ...filter,
            sortBy: typeSort,
          }});
      }, [typeSort]);

      useEffect(() => {
        setFilter(filter => {
          return {
            ...filter,
            offerStates: []
          }});
      }, [stateOfferActive]);
  
        return(
        <div className="bg-white w-10/12" onClick={() => setSortActive(false)}>        
          <Modal 
            active={offerModalActive} 
            setActive={setOfferModalActive}
            content={
              <OfferOwnerModal 
                offer={offerInModal}
                modalActive={offerModalActive}
                setOfferModalActive={setOfferModalActive}
                updateFunc={refetch}
                />
            }/>
          <div>
            <div className="relative z-40 lg:hidden">
              {mobileFilter &&
              <div className="fixed inset-0 z-40 flex">
              <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">{t("allOrders.filters")}</h2>
                  <button 
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFilter(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
      
                {/* <!-- Filters --> */}
                <div className="mt-4 border-t border-gray-200">   
                
                <div className="border-t border-gray-200 px-4 py-6">
                    <h3 className="-mx-2 -my-3 flow-root">
                      <button 
                      className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500" 
                      onClick={() => setStateOfferActive(!stateOfferActive)}
                      >
                        <span className="font-medium text-gray-900">{t("allOrders.status")}</span>
                        <span className="ml-6 flex items-center">
                          {stateOfferActive ?
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                              </svg>                         
                              :
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                              </svg>                         
                          }
                        </span>
                      </button>
                    </h3>
                    {stateOfferActive &&
                      <div className="pt-6" id="filter-section-mobile-0">
                        <div className="space-y-6">
                          {statesOffer?.map((item, index) => {
                              return(
                                  <div className="flex items-center" key={index}>
                                    <input 
                                    value={item.value} 
                                    type="checkbox" 
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={(e) =>
                                      e.target.checked ? 
                                        setFilter(filter => {
                                          return {
                                            ...filter,
                                            offerStates: [...filter.offerStates, e.target.value]
                                          }
                                        })
                                        :
                                        setFilter(filter => {
                                          return {
                                            ...filter,
                                            offerStates: filter.offerStates.filter(v => v != e.target.value )
                                          }
                                      })}                                                                
                                    />
                                    <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                      {i18n.language == "en" ? item.textEn : item.textRu}
                                    </label>
                                  </div> 
                              )                              
                          })}
                        </div>
                      </div>                    
                    }
                  </div>
                </div>
              </div>
            </div>            
              }      
            </div>
  
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">{t("allOrders.titleUser")}</h1>
        
                <div className="flex items-center">
                  <div className="inline-block text-left">
                    <div>
                      <button 
                          className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSortActive(!sortActive);
                          }}>
                        {t("sort", {ns: 'buttons'})}
                        <svg className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
        
                    {sortActive && 
                      <div className="absolute right-125 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {
                            t<string, {text: string, value: string}[]>('sortTypes', { returnObjects: true }).map((item, index) => (
                            <button
                              key={index}
                              className={classNames([
                                "text-gray-500 block px-4 py-2 text-sm",
                                typeSort == item.value && "font-medium text-gray-900",
                              ])} 
                              onClick={() => setTypeSort(item.value)}
                              >{item.text}
                            </button>
                            ))
                          }                     
                        </div>
                      </div>                  
                    }
                  </div>
                  <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden" onClick={() => setMobileFilter(true)}>
                    <span className="sr-only">Filters</span>
                    <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
        
              <section className="pt-6 pb-10">
                <h2 id="products-heading" className="sr-only">Products</h2>
        
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                  <div className="hidden lg:block">

                  <div className="border-b border-gray-200 py-6">
                        <h3 className="-my-3 flow-root">
                          <button 
                            className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                            onClick={() => setStateOfferActive(!stateOfferActive)}
                            >
                            <span className="font-medium text-gray-900">{t("allOrders.status")}</span>
                            <span className="ml-6 flex items-center">
                                {stateOfferActive ?                           
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                                    </svg>
                                            :
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                    </svg>                             
                                }
                            </span>
                          </button>
                        </h3>
                        {stateOfferActive &&
                            <div className="pt-6">
                                <div className="space-y-4">
                                  {statesOffer?.map((item, index) => {
                                    return(
                                        <div className="flex items-center pl-2" key={index}>
                                          <input 
                                          value={item.value} 
                                          type="checkbox" 
                                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                          onChange={(e) =>
                                            e.target.checked ? 
                                              setFilter(filter => {
                                                return {
                                                  ...filter,
                                                  offerStates: [...filter.offerStates!, e.target.value]
                                                }
                                              })
                                              :
                                              setFilter(filter => {
                                                return {
                                                  ...filter,
                                                  offerStates: filter.offerStates!.filter(v => v != e.target.value )
                                                }
                                            })}
                                          />
                                          <label className="ml-3 text-sm text-gray-600">
                                            {i18n.language == "en" ? item.textEn : item.textRu}
                                          </label>
                                        </div> 
                                    )                              
                                  })}
                                </div>
                            </div>                    
                        }
                  </div>
      
                  </div>
                  <div className="lg:col-span-3">
                    <div className="h-full rounded-lg border-4 border-dashed border-gray-200">
                      {isLoading && <p className="text-center text-slate-600">{t("load")}</p>}
                      <div className="py-2 mx-auto max-w-2xl px-4 sm:py-15 sm:px-6 lg:max-w-7xl lg:px-8">
                          {isLoading && <p className="text-center font-medium text-gray-800">{t("load")}</p>}
                          {response?.status == 204 &&
                          <div className="flex justify-center items-center">
                            <div className="mt-6 flex flex-col space-y-4 justify-center items-center">
                              <p className="font-medium text-gray-800">{t("noOffers")}</p>
                              <Link to="/orders/all" className="mt-2 font-medium text-blue-600 dark:text-blue-500 hover:underline text-base">{t("goToOrders")}</Link>
                            </div>                            
                          </div>
                          }
                          {response && response?.data != null && 
                            response?.data.map((item, index) => (
                              <UserOffer 
                                offer={item} 
                                key={index} 
                                setOfferModalActive={setOfferModalActive}
                                setOfferInModal={setOfferInModal}
                                updateFunc={refetch}
                              />
                          ))}
                      </div>                    
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>      
        )
}