import {useNavigation} from "./hooks/useNavigation";
import {unAuthRoutes, authRoutes, INav} from "./store/navigation";

import CreateOrder from "./pages/CreateOrder";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AllOrders from "./pages/AllOrders";
import OrderSummary from "./pages/OrderSummary";
import UserProfile from "./pages/UserProfile";
import Navbar from "./components/Navbar";
import MyAddresses from "./pages/MyAddresses";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import UserOrders from "./pages/UserOrders";
import OrderSummaryForOwner from "./pages/OrderSummaryForOwner";
import EditOrder from "./pages/EditOrder";
import { useTranslation } from "react-i18next";


const App = () => {
  const { currentRoute, setCurrentRoute } = useNavigation();

  return (
    <div className="p-2">     
      <Navbar
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
      />
      <div className="flex items-center justify-center text-gray-300 m-2 sm:m-8">
      <ToastContainer />
        <Routes>

          <Route path="/orders/create" element={ <CreateOrder /> } />
          <Route path="/orders/all" element={ <AllOrders /> } />
          <Route path="/orders/:id" element={ <OrderSummary /> } />

          <Route path="/auth/login" element={ <Login /> } />

          <Route path="/user/:username" element={ <UserProfile /> } />
          <Route path="/user/profile" element={ <UserProfile /> } />
          <Route path="/user/addresses" element={ <MyAddresses /> } />
          <Route path="/user/orders" element={ <UserOrders /> } />
          <Route path="/user/orders/:id" element={ <OrderSummaryForOwner /> } />
          <Route path="/user/orders/:id/edit" element={ <EditOrder /> } />
        </Routes>
      </div>
    </div>
  )
}
export default App;