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
import Registration from "./pages/Registration";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";
import PublicRoute from "./components/PublicRoute";
import AllUsers from "./pages/AllUsers";
import Instruction from "./pages/Instruction";


const App = () => {

  return (
    <div className="p-2">     
      <Navbar/>
      <div className="flex items-center justify-center text-gray-300 m-2 sm:m-8">
      <ToastContainer autoClose={1200}/>
        <Routes>

          <Route path="/" element={ <PublicRoute><Login /></PublicRoute>}/>
          <Route path="/auth/login" element={ <PublicRoute><Login /></PublicRoute>}/>
          <Route path="/auth/registration" element={ <PublicRoute><Registration /></PublicRoute>}/>
          <Route path="/instruction/:lng" element={ <Instruction />}/>

          <Route path="/orders/create" element={ <PrivateRoute><CreateOrder /></PrivateRoute>}/>
          <Route path="/orders/all" element={ <AllOrders /> } />
          <Route path="/orders/:id" element={ <OrderSummary /> } />

          <Route path="/user/profile/:email" element={ <PrivateRoute><UserProfile isEditable={false}/></PrivateRoute>}/>
          <Route path="/user/profile" element={ <PrivateRoute><UserProfile isEditable={true}/></PrivateRoute>}/>
          <Route path="/user/addresses" element={ <PrivateRoute><MyAddresses /></PrivateRoute>}/>
          <Route path="/user/orders" element={ <PrivateRoute><UserOrders /></PrivateRoute>}/>
          <Route path="/user/offers" element={ <PrivateRoute><UserOffers /></PrivateRoute>}/>
          <Route path="/admin/users" element={ <PrivateRoute><AllUsers /></PrivateRoute>}/>

          <Route path="/user/orders/:id" element={ <PrivateRoute><OrderSummaryForOwner /></PrivateRoute>}/>
          <Route path="/user/orders/:id/edit" element={ <PrivateRoute><EditOrder /></PrivateRoute>}/>

          <Route path="*" element={ <NotFound /> } />
        </Routes>
      </div>
    </div>
  )
}
export default App;