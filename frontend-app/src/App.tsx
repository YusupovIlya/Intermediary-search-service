import { FaDev } from "react-icons/fa";
import {useNavigation} from "./hooks/useNavigation";
import {navigationData} from "./store/navigation";
import {Navbar} from "./components/navbar";
import {Tabbar} from "./components/tabbar";
import CreateOrder from "./pages/CreateOrder";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AllOrders from "./pages/AllOrders";


const App = () => {
  const { currentRoute, setCurrentRoute } = useNavigation();
  return (
    <div className="bg-gray-200">
      <Navbar
        navigationData={navigationData}
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
      />
      <div className="flex items-center justify-center text-5xl text-gray-300">
        <Routes>
          <Route path="/order/create" element={ <CreateOrder /> } />
          <Route path="/auth/login" element={ <Login /> } />
          <Route path="/order/all" element={ <AllOrders /> } />
        </Routes>
      </div>
    </div>
  )
}
export default App;