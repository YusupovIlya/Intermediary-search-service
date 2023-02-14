import {useNavigation} from "./hooks/useNavigation";

import CreateOrder from "./pages/CreateOrder";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AllOrders from "./pages/AllOrders";
import OrderSummary from "./pages/OrderSummary";
import UserProfile from "./pages/UserProfile";
import Navbar from "./components/navbar";
import MyAddresses from "./pages/MyAddresses";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import UserOrders from "./pages/UserOrders";
import OrderSummaryForOwner from "./pages/OrderSummaryForOwner";
import EditOrder from "./pages/EditOrder";
import UserOffers from "./pages/UserOffers";


const App = () => {

  return (
    <div className="p-2">     
      <Navbar/>
      <div className="flex items-center justify-center text-gray-300 m-2 sm:m-8">
      <ToastContainer />
        <Routes>

          <Route path="/orders/create" element={ <CreateOrder /> } />
          <Route path="/orders/all" element={ <AllOrders /> } />
          <Route path="/orders/:id" element={ <OrderSummary /> } />

          <Route path="/auth/login" element={ <Login /> } />

          <Route path="/user/profile/:email" element={ <UserProfile isEditable={false}/> } />
          <Route path="/user/profile" element={ <UserProfile isEditable={true}/> } />
          <Route path="/user/addresses" element={ <MyAddresses /> } />
          <Route path="/user/orders" element={ <UserOrders /> } />
          <Route path="/user/offers" element={ <UserOffers /> } />
          <Route path="/user/orders/:id" element={ <OrderSummaryForOwner /> } />
          <Route path="/user/orders/:id/edit" element={ <EditOrder /> } />
        </Routes>
      </div>
    </div>
  )
}
export default App;