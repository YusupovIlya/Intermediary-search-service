import { FaDev } from "react-icons/fa";
import {useNavigation} from "./hooks/useNavigation";
import {navigationData} from "./data/navigation";
import {Navbar} from "./components/navbar";
import {Tabbar} from "./components/tabbar";
import CreateOrder from "./pages/CreateOrder";
import { Route, Routes } from "react-router-dom";


const App = () => {
  const { currentRoute, setCurrentRoute } = useNavigation();
  return (
    <div className="bg-gray-200 h-screen">
      <Navbar
        navigationData={navigationData}
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
      />
      <Tabbar
        navigationData={navigationData}
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
      />
      <div className="flex items-center justify-center text-5xl text-gray-300 h-5/6">
        <Routes>
          <Route path="/order/create" element={ <CreateOrder /> } />
        </Routes>
      </div>
    </div>
  )
}
export default App;