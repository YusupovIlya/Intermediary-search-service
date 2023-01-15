import { FaDev } from "react-icons/fa";
import {useNavigation} from "./hooks/useNavigation";
import {navigationData} from "./store/navigation";

import CreateOrder from "./pages/CreateOrder";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AllOrders from "./pages/AllOrders";
import OrderSummary from "./pages/OrderSummary";
import UserProfile from "./pages/UserProfile";
import OrderHistory from "./pages/OrderHistory";
import Navbar from "./components/Navbar";


const App = () => {
  const { currentRoute, setCurrentRoute } = useNavigation();
  return (
    <div className="bg-gray-200 p-2">
      <Navbar
        navigationData={navigationData}
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
      />
      <div className="flex items-center justify-center text-gray-300 m-8">
        <Routes>
          <Route path="/order/create" element={ <CreateOrder /> } />
          <Route path="/auth/login" element={ <Login /> } />
          <Route path="/order/all" element={ <AllOrders /> } />
          <Route path="/order/:id" element={ <OrderSummary /> } />
          <Route path="/user/profile" element={ <UserProfile /> } />
          <Route path="/order/history" element={ <OrderHistory /> } />
        </Routes>
      </div>
    </div>
  )
}
export default App;