import { useState } from "react";
import { Modal } from "../components/Modal"
import OrderInHistory from "../components/OrderInHistory"
import OrderModal from "../components/OrderModal";
import { IOrder } from "../models";
import { useAllOrdersQuery } from "../store/intermediarysearchservice.api"


export default function OrderHistory() {
    const [modalActive, setModalActive] = useState(false);
    const [orderInModal, setOrderInModal] = useState<IOrder>(
        {
            id: 0,
            siteName: "",
            siteLink: "",
            orderItems: [],
            statesOrder: [],
            performerFee: 0,
            address: {
                postalCode: "",
                label: "",
                country: "",
                region: "",
            }
        }
    );
    const {
        data: orders,
        isFetching,
        isLoading,
      } = useAllOrdersQuery(null)

    return(
    <div>
        <Modal active={modalActive} setActive={setModalActive} content={<OrderModal order={orderInModal}/>}/>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-center text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Image</span>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Магазин
                        </th>
                        <th scope="col" className="px-6 py-3 w-36">
                            Товаров в заказе
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Стоимость
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Action</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="text-center">
                {orders?.map((item, index) => (
                <OrderInHistory 
                    order={item} 
                    key={index} 
                    setOrderInModal={setOrderInModal}
                    setModalActive={setModalActive}
                />))}
                </tbody>
            </table>
        </div>        
    </div>
    )
}