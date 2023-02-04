import { useEffect, useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import { useFilteredOrdersQuery, useGetCountriesForFilterQuery, useGetShopsForFilterQuery } from "../store/intermediarysearchservice.api";
import OrderCard from "../components/OrderCard";
import { IOrdersFilter } from "../models";
import classNames from "classnames";
import { useDebounce } from "../hooks/useDebounce";

interface TypesSortList{
  type: string,
  text: string,
}


const sortList: TypesSortList[] = [
  {
    type: "newest",
    text: "Новые",  
  },
  {
    type: "oldest",
    text: "Старые",  
  },
  {
    type: "maxmin",
    text: "Стоимость заказа Max --> Min",  
  },
  {
    type: "minmax",
    text: "Стоимость заказа Min --> Max",  
  }
]

export default function AllOrders() {
    const [filter, setFilter] = useState<IOrdersFilter>({
      page: 1,
      pageSize: 5,
      shops: [],
      countries: [],
      numOrderItems: -1,
      maxOrderPrice: -1,
      minOrderPrice: -1,
      sortBy: "newest"
    });
    const { data: countries, isLoading: isLoadingCountries } = useGetCountriesForFilterQuery(null);
    const { data: shops, isLoading: isLoadingShops } = useGetShopsForFilterQuery(null);
    const { data: allOrdersResponse, isLoading } = useFilteredOrdersQuery(filter);
    const [mobileFilter, setMobileFilter] = useState(false);
    const [sortActive, setSortActive] = useState(false);
    const [placeActive, setPlaceActive] = useState(false);
    const [shopActive, setShopActive] = useState(false);
    const [amountOrderItemsActive, setAmountOrderItemsActive] = useState(false);
    const [orderPriceActive, setOrderPriceActive] = useState(false);
    const [isNextActive, setNextActive] = useState(false);
    const [isPreviousActive, setPreviousActive] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [minPrice, setMinPrice] = useState(1);
    const [maxPrice, setMaxPrice] = useState(500);
    const [numOrderItems, setNumOrderItems] = useState(1);
    const [typeSort, setTypeSort] = useState("newest");
    const debouncedItems = useDebounce(numOrderItems, 500);
    const debouncedMin = useDebounce(minPrice, 500);
    const debouncedMax = useDebounce(maxPrice, 500);

    useEffect(() => {
      setNextActive(allOrdersResponse?.paginationMeta.hasNext!);
      setPreviousActive(allOrdersResponse?.paginationMeta.hasPrevious!);
    }, [allOrdersResponse?.paginationMeta]);

    useEffect(() => {
      setFilter(filter => {
        return {
          ...filter,
          minOrderPrice: debouncedMin,
          maxOrderPrice: debouncedMax,
        }});
    }, [debouncedMin, debouncedMax]);

    useEffect(() => {
      setFilter(filter => {
        return {
          ...filter,
          numOrderItems: debouncedItems,
        }});
    }, [debouncedItems]);

    useEffect(() => {
      setFilter(filter => {
        return {
          ...filter,
          sortBy: typeSort,
        }});
    }, [typeSort]);


    useEffect(() => {
      if(!orderPriceActive)
        setFilter(filter => {
          return {
            ...filter,
            minOrderPrice: -1,
            maxOrderPrice: -1,
          }});
      else
        setFilter(filter => {
          return {
            ...filter,
            minOrderPrice: debouncedMin,
            maxOrderPrice: debouncedMax,
          }});
    }, [orderPriceActive]);

    useEffect(() => {
      if(!amountOrderItemsActive)
        setFilter(filter => {
          return {
            ...filter,
            numOrderItems: -1,
          }});
      else
        setFilter(filter => {
          return {
            ...filter,
            numOrderItems: debouncedItems,
          }});
    }, [amountOrderItemsActive]);



    const paginationText = () => {
      const startIndex = (allOrdersResponse?.paginationMeta.pageSize!*(allOrdersResponse?.paginationMeta.currentPage!-1))+1;
      const endIndex = startIndex + allOrdersResponse?.orders.length!-1;
      return `${startIndex} - ${endIndex}`;
    }

      return(
      <div className="bg-white w-10/12" onClick={() => setSortActive(false)}>
        <div>
          <div className="relative z-40 lg:hidden">
            {mobileFilter &&
            <div className="fixed inset-0 z-40 flex">
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Фильтры</h2>
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
                    onClick={() => (setShopActive(!shopActive))}
                    >
                      <span className="font-medium text-gray-900">Магазин</span>
                      <span className="ml-6 flex items-center">
                        {shopActive ?
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
                  {shopActive &&
                    <div className="pt-6" id="filter-section-mobile-0">
                      <div className="space-y-6">
                        {shops?.map((item, index) => {
                            return(
                                <div className="flex items-center" key={index}>
                                  <input 
                                  value={item} 
                                  type="checkbox" 
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  onChange={(e) =>
                                    e.target.checked ? 
                                      setFilter(filter => {
                                        return {
                                          ...filter,
                                          shops: [...filter.shops!, e.target.value]
                                        }
                                      })
                                      :
                                      setFilter(filter => {
                                        return {
                                          ...filter,
                                          shops: filter.shops!.filter(v => v != e.target.value )
                                        }
                                    })}                                                                
                                  />
                                  <label className="ml-3 min-w-0 flex-1 text-gray-500">{item}</label>
                                </div> 
                            )                              
                        })}
                      </div>
                    </div>                    
                  }
                </div>

                <div className="border-t border-gray-200 px-4 py-6">
                  <h3 className="-mx-2 -my-3 flow-root">
                    <button 
                    className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500" 
                    onClick={() => (setPlaceActive(!placeActive))}
                    >
                      <span className="font-medium text-gray-900">Страна доставки</span>
                      <span className="ml-6 flex items-center">
                        {placeActive ?
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
                  {placeActive &&
                    <div className="pt-6" id="filter-section-mobile-0">
                      <div className="space-y-6">
                        {countries?.map((item, index) => {
                            return(
                                <div className="flex items-center" key={index}>
                                  <input 
                                  value={item} 
                                  type="checkbox" 
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  onChange={(e) =>
                                    e.target.checked ? 
                                      setFilter(filter => {
                                        return {
                                          ...filter,
                                          countries: [...filter.countries!, e.target.value]
                                        }
                                      })
                                      :
                                      setFilter(filter => {
                                        return {
                                          ...filter,
                                          countries: filter.countries!.filter(v => v != e.target.value )
                                        }
                                    })}                                                                  
                                  />
                                  <label className="ml-3 min-w-0 flex-1 text-gray-500">{item}</label>
                                </div> 
                            )                              
                        })}
                      </div>
                    </div>                    
                  }
                </div>

                <div className="border-t border-gray-200 px-4 py-6">
                  <h3 className="-mx-2 -my-3 flow-root">
                    <button 
                    className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500" 
                    onClick={() => (setAmountOrderItemsActive(!amountOrderItemsActive))}
                    >
                      <span className="font-medium text-gray-900">Кол-во товаров в заказе</span>
                      <span className="ml-6 flex items-center">
                        {amountOrderItemsActive ?
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
                  {amountOrderItemsActive &&
                    <div className="pt-6">
                      <div className="space-y-6">
                          <div className="flex-col justify-center">
                            <input 
                              type="range" 
                              className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                              min={1}
                              max={10}
                              step={1}
                              value={numOrderItems}
                              onChange={(e) =>setNumOrderItems(e.target.valueAsNumber)}
                            />
                            <label className="ml-3 text-sm text-gray-600">До {numOrderItems} шт.</label>
                          </div>
                      </div>
                    </div>                    
                  }
                </div>

                <div className="border-t border-gray-200 px-4 py-6">
                  <h3 className="-mx-2 -my-3 flow-root">
                    <button 
                    className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500" 
                    onClick={() => (setOrderPriceActive(!orderPriceActive))}
                    >
                      <span className="font-medium text-gray-900">Стоимость заказа</span>
                      <span className="ml-6 flex items-center">
                        {orderPriceActive ?
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
                  {orderPriceActive &&
                    <div className="pt-6">
                      <div className="space-y-6">
                        <div className="flex-col justify-center">
                            <MultiRangeSlider
                              min={1}
                              max={1000}
                              step={5}
                              minValue={minPrice}
                              maxValue={maxPrice}
                              ruler={false}
                              style={{ border: 'none', boxShadow: 'none' }}
                              onInput={(e) => {
                                setMinPrice(e.minValue);
                                setMaxPrice(e.maxValue);  
                              }}
                            />
                              <label className="ml-3 text-sm text-gray-600">От {minPrice}$ до {maxPrice}$</label>
                            </div>
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
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">Заказы пользователей</h1>
      
              <div className="flex items-center">
                <div className="relative inline-block text-left">
                  <div>
                    <button 
                        className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortActive(!sortActive);
                        }}>
                      Сортировка
                      <svg className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
      
                  {sortActive && 
                    <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {sortList.map((item, index) => {
                              return(
                                <button
                                  className={classNames([
                                    "text-gray-500 block px-4 py-2 text-sm",
                                    typeSort == item.type && "font-medium text-gray-900",
                                  ])} 
                                  onClick={() => setTypeSort(item.type)}
                                  key={index}
                                  >{item.text}
                                </button>
                              )
                            })}   
                        </div>
                    </div>                  
                  }
                </div>
                <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden" onClick={() => setMobileFilter(true)}>
                  <span className="sr-only">Filters</span>
                  {/* <!-- Heroicon name: mini/funnel --> */}
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
                          onClick={() => setShopActive(!shopActive)}
                          >
                          <span className="font-medium text-gray-900">Магазин</span>
                          <span className="ml-6 flex items-center">
                              {shopActive ?                           
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
                      {shopActive &&
                          <div className="pt-6">
                              {isLoadingShops && <p className="text-center text-slate-600">Loading...</p>}
                              <div className="space-y-4 max-h-[150px] overflow-y-scroll">
                                {shops?.map((item, index) => {
                                  return(
                                      <div className="flex items-center pl-2" key={index}>
                                        <input 
                                        value={item} 
                                        type="checkbox" 
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        onChange={(e) =>
                                          e.target.checked ? 
                                            setFilter(filter => {
                                              return {
                                                ...filter,
                                                shops: [...filter.shops!, e.target.value]
                                              }
                                            })
                                            :
                                            setFilter(filter => {
                                              return {
                                                ...filter,
                                                shops: filter.shops!.filter(v => v != e.target.value )
                                              }
                                          })}
                                        />
                                        <label className="ml-3 text-sm text-gray-600">{item}</label>
                                      </div> 
                                  )                              
                                })}
                              </div>
                          </div>                    
                      }
                    </div>
      
                  <div className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                      <button 
                        className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                        onClick={() => (setPlaceActive(!placeActive))}>
                        <span className="font-medium text-gray-900">Страна доставки</span>
                        <span className="ml-6 flex items-center">
                            {placeActive ?                           
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
                    {placeActive &&
                        <div className="pt-6">
                            {isLoadingCountries && <p className="text-center text-slate-600">Loading...</p>}
                            <div className="space-y-4 max-h-[150px] overflow-y-scroll">
                              {countries?.map((item, index) => {
                                return(
                                    <div className="flex items-center pl-2" key={index}>
                                      <input 
                                      value={item} 
                                      type="checkbox" 
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      onChange={(e) =>
                                        e.target.checked ? 
                                          setFilter(filter => {
                                            return {
                                              ...filter,
                                              countries: [...filter.countries!, e.target.value]
                                            }
                                          })
                                          :
                                          setFilter(filter => {
                                            return {
                                              ...filter,
                                              countries: filter.countries!.filter(v => v != e.target.value )
                                            }
                                        })}                                                                  
                                      />
                                      <label className="ml-3 text-sm text-gray-600">{item}</label>
                                    </div> 
                                )                              
                              })}
                            </div>
                        </div>                    
                    }
                  </div>

                  <div className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                      <button 
                        className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                        onClick={() => setAmountOrderItemsActive(!amountOrderItemsActive)}>
                        <span className="font-medium text-gray-900">Кол-во товаров в заказе</span>
                        <span className="ml-6 flex items-center">
                            {amountOrderItemsActive ?                           
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
                    {amountOrderItemsActive &&
                        <div className="pt-6">
                          <div className="space-y-4">
                            
                            <div className="flex-col justify-center">
                              <input 
                                type="range" 
                                className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                                min={1}
                                max={10}
                                step={1}
                                value={numOrderItems}
                                onChange={(e) =>setNumOrderItems(e.target.valueAsNumber)}
                              />
                              <label className="ml-3 text-sm text-gray-600">До {numOrderItems} шт.</label>
                            </div>

                          </div>
                        </div>                    
                    }
                  </div>

                  <div className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                      <button 
                        className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                        onClick={() => setOrderPriceActive(!orderPriceActive)}                                  
                        >
                        <span className="font-medium text-gray-900">Стоимость заказа</span>
                        <span className="ml-6 flex items-center">
                            {orderPriceActive ?                           
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
                    {orderPriceActive &&
                        <div className="pt-6">
                          <div className="space-y-4">
                            
                            <div className="flex-col justify-center">
                            <MultiRangeSlider
                              min={1}
                              max={1000}
                              step={5}
                              minValue={minPrice}
                              maxValue={maxPrice}
                              ruler={false}
                              style={{ border: 'none', boxShadow: 'none' }}
                              onInput={(e) => {
                                setMinPrice(e.minValue);
                                setMaxPrice(e.maxValue);  
                              }}
		                        />
                              <label className="ml-3 text-sm text-gray-600">От {minPrice}$ до {maxPrice}$</label>
                            </div>

                          </div>
                        </div>                    
                    }
                  </div>

                </div>
      
                {/* <!-- Product grid --> */}
                <div className="lg:col-span-3">
                  {/* <!-- Replace with your content --> */}
                  <div className="h-full rounded-lg border-4 border-dashed border-gray-200">
                    {isLoading && <p className="text-center text-slate-600">Loading...</p>}
                    <div className="py-2 mx-auto max-w-2xl px-4 sm:py-15 sm:px-6 lg:max-w-7xl lg:px-8">
                      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
                        {allOrdersResponse?.orders?.map((item, index) => (
                          <OrderCard order={item} key={index}/>
                        ))}
                      </div>
                    </div>                    
                  </div>
                  {/* <!-- /End replace --> */}
                </div>




              </div>
            </section>

            {!isLoading && 
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                  <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      На странице {paginationText()} заказов из {allOrdersResponse?.paginationMeta.totalCount}
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        className={classNames([
                            "relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20",
                            !isPreviousActive && "bg-gray-100 hover:bg-gray-100",
                        ])}
                        onClick={() => {
                          if(!isPreviousActive) return;
                          setActivePage(activePage-1);
                          setFilter(filter => {
                            return {
                              ...filter,
                              page: filter.page-1
                            }                          
                        })}}                     
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                        </svg>
                      </button>                      
                      {Array.from({length: allOrdersResponse?.paginationMeta.totalPages!}, (_, i) => i + 1).map(index => {
                        return(
                          <button
                            className={classNames([
                              "relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20",
                              index == activePage && "bg-sky-100 hover:bg-sky-200",
                            ])} 
                            onClick={() => {
                              setActivePage(index);
                              setFilter(filter => {
                                return {
                                  ...filter,
                                  page: index
                                }                          
                            })}}
                            >{index}</button>
                        )
                      })}
                      <button
                        className={classNames([
                            "relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20",
                            !isNextActive && "bg-gray-100 hover:bg-gray-100",
                        ])} 
                        onClick={() => {
                          if(!isNextActive) return;
                          setActivePage(activePage+1);
                          setFilter(filter => {
                            return {
                              ...filter,
                              page: filter.page+1
                            }                          
                        })}}  
                        >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                        </svg>
                      </button>                                         
                    </nav>
                  </div>
                </div>
              </div>            
            }

          </main>
        </div>
      </div>      
      )
}