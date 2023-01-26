import { useState } from "react";
import MultiRangeSlider, { ChangeResult } from "multi-range-slider-react";

interface Pl{
  name: string,
  in: number
}

const placec: Pl[] = [
  {
    name: "Мой профиль",
    in: 1
  },
  {
    name: "Мои адреса",
    in: 2
  },
  {
    name: "Мой профиль",
    in: 1
  },
  {
    name: "Мои адреса",
    in: 2
  },
  {
    name: "Мой профиль",
    in: 1
  },
  {
    name: "Мои адреса",
    in: 2
  },
]

export default function Filters() {

    const [sortActive, setSortActive] = useState(false);
    const [placeActive, setPlaceActive] = useState(false);
    const [shopActive, setShopActive] = useState(true);
    const [amountOrderItemsActive, setAmountOrderItemsActive] = useState(false);
    const [amountOrderItems, setAmountOrderItems] = useState("1");
    const [orderPriceActive, setOrderPriceActive] = useState(false);
    const [minValue, setMinValue] = useState(100);
    const [maxValue, setMaxValue] = useState(500);
    const handleInput = (e: ChangeResult ) => {
      setMinValue(e.minValue);
      setMaxValue(e.maxValue);
    };

      return(
      <div className="bg-white w-3/4">
        <div>
          {/* <!--
            Mobile filter dialog
      
            Off-canvas filters for mobile, show/hide based on off-canvas filters state.
          --> */}
          <div className="relative z-40 lg:hidden" role="dialog" aria-modal="true">
            {/* <!--
              Off-canvas menu backdrop, show/hide based on off-canvas menu state.
      
              Entering: "transition-opacity ease-linear duration-300"
                From: "opacity-0"
                To: "opacity-100"
              Leaving: "transition-opacity ease-linear duration-300"
                From: "opacity-100"
                To: "opacity-0"
            --> */}
            <div className="fixed inset-0 bg-black bg-opacity-25"></div>
      
            <div className="fixed inset-0 z-40 flex">
              {/* <!--
                Off-canvas menu, show/hide based on off-canvas menu state.
      
                Entering: "transition ease-in-out duration-300 transform"
                  From: "translate-x-full"
                  To: "translate-x-0"
                Leaving: "transition ease-in-out duration-300 transform"
                  From: "translate-x-0"
                  To: "translate-x-full"
              --> */}
              <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button type="button" className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400">
                    <span className="sr-only">Close menu</span>
                    {/* <!-- Heroicon name: outline/x-mark --> */}
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
      
                {/* <!-- Filters --> */}
                <form className="mt-4 border-t border-gray-200">
                  <h3 className="sr-only">Categories</h3>
                  <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                    <li>
                      <a href="#" className="block px-2 py-3">Totes</a>
                    </li>
      
                    <li>
                      <a href="#" className="block px-2 py-3">Backpacks</a>
                    </li>
      
                    <li>
                      <a href="#" className="block px-2 py-3">Travel Bags</a>
                    </li>
      
                    <li>
                      <a href="#" className="block px-2 py-3">Hip Bags</a>
                    </li>
      
                    <li>
                      <a href="#" className="block px-2 py-3">Laptop Sleeves</a>
                    </li>
                  </ul>
      
                  <div className="border-t border-gray-200 px-4 py-6">
                    <h3 className="-mx-2 -my-3 flow-root">
                      {/* <!-- Expand/collapse section button --> */}
                      <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500" aria-controls="filter-section-mobile-0" aria-expanded="false">
                        <span className="font-medium text-gray-900">Color</span>
                        <span className="ml-6 flex items-center">
                          {/* <!--
                            Expand icon, show/hide based on section open state.
      
                            Heroicon name: mini/plus
                          --> */}
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                          </svg>
                          {/* <!--
                            Collapse icon, show/hide based on section open state.
      
                            Heroicon name: mini/minus
                          --> */}
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    {/* <!-- Filter section, show/hide based on section state. --> */}
                    <div className="pt-6" id="filter-section-mobile-0">
                      <div className="space-y-6">
                        <div className="flex items-center">
                          <input id="filter-mobile-color-0" name="color[]" value="white" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-color-0" className="ml-3 min-w-0 flex-1 text-gray-500">White</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-color-1" name="color[]" value="beige" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-color-1" className="ml-3 min-w-0 flex-1 text-gray-500">Beige</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-color-2" name="color[]" value="blue" type="checkbox" checked className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-color-2" className="ml-3 min-w-0 flex-1 text-gray-500">Blue</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-color-3" name="color[]" value="brown" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-color-3" className="ml-3 min-w-0 flex-1 text-gray-500">Brown</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-color-4" name="color[]" value="green" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-color-4" className="ml-3 min-w-0 flex-1 text-gray-500">Green</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-color-5" name="color[]" value="purple" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-color-5" className="ml-3 min-w-0 flex-1 text-gray-500">Purple</label>
                        </div>
                      </div>
                    </div>
                  </div>
      
                  <div className="border-t border-gray-200 px-4 py-6">
                    <h3 className="-mx-2 -my-3 flow-root">
                      {/* <!-- Expand/collapse section button --> */}
                      <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500" aria-controls="filter-section-mobile-1" aria-expanded="false">
                        <span className="font-medium text-gray-900">Category</span>
                        <span className="ml-6 flex items-center">
                          {/* <!--
                            Expand icon, show/hide based on section open state.
      
                            Heroicon name: mini/plus
                          --> */}
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                          </svg>
                          {/* <!--
                            Collapse icon, show/hide based on section open state.
      
                            Heroicon name: mini/minus
                          --> */}
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    {/* <!-- Filter section, show/hide based on section state. --> */}
                    <div className="pt-6" id="filter-section-mobile-1">
                      <div className="space-y-6">
                        <div className="flex items-center">
                          <input id="filter-mobile-category-0" name="category[]" value="new-arrivals" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-category-0" className="ml-3 min-w-0 flex-1 text-gray-500">New Arrivals</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-category-1" name="category[]" value="sale" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-category-1" className="ml-3 min-w-0 flex-1 text-gray-500">Sale</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-category-2" name="category[]" value="travel" type="checkbox" checked className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-category-2" className="ml-3 min-w-0 flex-1 text-gray-500">Travel</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-category-3" name="category[]" value="organization" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-category-3" className="ml-3 min-w-0 flex-1 text-gray-500">Organization</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-category-4" name="category[]" value="accessories" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-category-4" className="ml-3 min-w-0 flex-1 text-gray-500">Accessories</label>
                        </div>
                      </div>
                    </div>
                  </div>
      
                  <div className="border-t border-gray-200 px-4 py-6">
                    <h3 className="-mx-2 -my-3 flow-root">
                      {/* <!-- Expand/collapse section button --> */}
                      <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500" aria-controls="filter-section-mobile-2" aria-expanded="false">
                        <span className="font-medium text-gray-900">Size</span>
                        <span className="ml-6 flex items-center">
                          {/* <!--
                            Expand icon, show/hide based on section open state.
      
                            Heroicon name: mini/plus
                          --> */}
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                          </svg>
                          {/* <!--
                            Collapse icon, show/hide based on section open state.
      
                            Heroicon name: mini/minus
                          --> */}
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    {/* <!-- Filter section, show/hide based on section state. --> */}
                    <div className="pt-6" id="filter-section-mobile-2">
                      <div className="space-y-6">
                        <div className="flex items-center">
                          <input id="filter-mobile-size-0" name="size[]" value="2l" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-size-0" className="ml-3 min-w-0 flex-1 text-gray-500">2L</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-size-1" name="size[]" value="6l" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-size-1" className="ml-3 min-w-0 flex-1 text-gray-500">6L</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-size-2" name="size[]" value="12l" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-size-2" className="ml-3 min-w-0 flex-1 text-gray-500">12L</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-size-3" name="size[]" value="18l" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-size-3" className="ml-3 min-w-0 flex-1 text-gray-500">18L</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-size-4" name="size[]" value="20l" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-size-4" className="ml-3 min-w-0 flex-1 text-gray-500">20L</label>
                        </div>
      
                        <div className="flex items-center">
                          <input id="filter-mobile-size-5" name="size[]" value="40l" type="checkbox" checked className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                          <label htmlFor="filter-mobile-size-5" className="ml-3 min-w-0 flex-1 text-gray-500">40L</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
      
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">Заказы пользователей</h1>
      
              <div className="flex items-center">
                <div className="relative inline-block text-left">
                  <div>
                    <button 
                        className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => setSortActive(!sortActive)}>
                      Sort
                      {/* <!-- Heroicon name: mini/chevron-down --> */}
                      <svg className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
      
                  {sortActive && 
                    <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                        <div className="py-1" role="none">
                            {/* <!--
                            Active: "bg-gray-100", Not Active: ""
            
                            Selected: "font-medium text-gray-900", Not Selected: "text-gray-500"
                            --> */}
                            <a href="#" className="font-medium text-gray-900 block px-4 py-2 text-sm" role="menuitem" id="menu-item-0">Новые</a>
            
                            <a href="#" className="text-gray-500 block px-4 py-2 text-sm" role="menuitem" id="menu-item-1">Стоимость заказа max-min</a>
            
                            <a href="#" className="text-gray-500 block px-4 py-2 text-sm" role="menuitem" id="menu-item-2">Стоимость заказа min-max</a>      
                        </div>
                    </div>                  
                  }
                </div>
      
                <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                  <span className="sr-only">View grid</span>
                  {/* <!-- Heroicon name: mini/squares-2x2 --> */}
                  <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button type="button" className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
                  <span className="sr-only">Filters</span>
                  {/* <!-- Heroicon name: mini/funnel --> */}
                  <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
      
            <section aria-labelledby="products-heading" className="pt-6 pb-24">
              <h2 id="products-heading" className="sr-only">Products</h2>
      
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                <div className="hidden lg:block">

                  <div className="border-b border-gray-200 py-6">
                      <h3 className="-my-3 flow-root">
                        <button 
                          className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                          onClick={() => (setShopActive(!shopActive))}>
                          <span className="font-medium text-gray-900">Магазин</span>
                          <span className="ml-6 flex items-center">
                              {shopActive ?                           
                                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
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
                              <div className="space-y-4 max-h-[150px] overflow-y-scroll">
                                {placec.map((item, index) => {
                                  return(
                                      <div className="flex items-center pl-2">
                                        <input value="white" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                        <label className="ml-3 text-sm text-gray-600">White</label>
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
                                    <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
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
                            <div className="space-y-4 max-h-[150px] overflow-y-scroll">
                              {placec.map((item, index) => {
                                return(
                                    <div className="flex items-center pl-2">
                                      <input value="white" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                      <label className="ml-3 text-sm text-gray-600">White</label>
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
                        onClick={() => (setAmountOrderItemsActive(!amountOrderItemsActive))}>
                        <span className="font-medium text-gray-900">Кол-во товаров в заказе</span>
                        <span className="ml-6 flex items-center">
                            {amountOrderItemsActive ?                           
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
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
                                min="1"
                                max="10"
                                step="1"
                                value={amountOrderItems}
                                onChange={(e) => setAmountOrderItems(e.target.value)}
                              />
                              <label className="ml-3 text-sm text-gray-600">До {amountOrderItems} шт.</label>
                            </div>

                          </div>
                        </div>                    
                    }
                  </div>

                  <div className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                      <button 
                        className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                        onClick={() => (setOrderPriceActive(!orderPriceActive))}>
                        <span className="font-medium text-gray-900">Стоимость заказа</span>
                        <span className="ml-6 flex items-center">
                            {orderPriceActive ?                           
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
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
                              minValue={minValue}
                              maxValue={maxValue}
                              ruler={false}
                              style={{ border: 'none', boxShadow: 'none' }}
                              onInput={(e) => {
                                handleInput(e);
                              }}
		                        />
                              <label className="ml-3 text-sm text-gray-600">От {minValue}$ до {maxValue}$</label>
                            </div>

                          </div>
                        </div>                    
                    }
                  </div>

                </div>
      
                {/* <!-- Product grid --> */}
                <div className="lg:col-span-3">
                  {/* <!-- Replace with your content --> */}
                  <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 lg:h-full"></div>
                  {/* <!-- /End replace --> */}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
      
      )
}