import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export interface NavbarProps {
  currentRoute: string
  setCurrentRoute: (option: any) => void
}


export default function Navbar({ currentRoute, setCurrentRoute }: NavbarProps) {
    const auth = useAuth()
    const { t, i18n } = useTranslation('navigation');
    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5">
                    <Link to="/" className="flex items-center">
                        <img src={process.env.PUBLIC_URL + "/app_logo.png"} className="h-6 mr-3 sm:h-9"/>
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">{t("title")}</span>
                    </Link>
                    <div className="flex items-center">
                        <button onClick={()=> i18n.changeLanguage("ru")}> ru </button>
                        <button onClick={()=> i18n.changeLanguage("en")}> en </button>
                        {auth.user
                         ? <Link to="/user/profile" className="mr-6 text-sm font-medium text-gray-500 dark:text-white hover:underline">Мой профиль</Link>
                         : <a href="tel:5541251234" className="mr-6 text-sm font-medium text-gray-500 dark:text-white hover:underline">...</a>
                        }
                        {auth.user
                         ? <Link to="/auth/logout" className="text-base font-medium text-blue-600 dark:text-blue-500 hover:underline">Выйти</Link>
                         : <Link to="/auth/login" className="text-base font-medium text-blue-600 dark:text-blue-500 hover:underline">{t("unAuthRoutes.login")}</Link>
                        }
                    </div>
                </div>
            </nav>
            <nav className="bg-gray-50 dark:bg-gray-700 rounded-b-3xl">
                <div className="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
                    <div className="flex items-center justify-between">
                        <ul className="flex flex-row mt-0 mr-6 space-x-8 text-base font-medium">
                            <li
                                onClick={() => setCurrentRoute("/orders/create")}>
                                <Link 
                                to="/orders/create"
                                className={classNames([
                                    "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide text-base flex items-start justify-center pb-3",
                                    currentRoute === "/orders/create" && "text-gray-700 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100",
                                ])}>
                                {t("unAuthRoutes.createOrder")}
                                </Link>
                            </li>           
                            <li
                                onClick={() => setCurrentRoute("/orders/all")}>
                                <Link 
                                to="/orders/all"
                                className={classNames([
                                    "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide text-base flex items-start justify-center pb-3",
                                    currentRoute === "/orders/all" && "text-gray-700 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100",
                                ])}>
                                {t("unAuthRoutes.findOrder")}
                                </Link>
                            </li>   
                        </ul>
                        {auth.user &&
                        <ul className="flex flex-row mt-0 mr-6 space-x-8 text-base font-medium">
                            <li
                                onClick={() => setCurrentRoute("/user/profile")}>
                                <Link 
                                to={"/user/profile"}
                                className={classNames([
                                    "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide text-base flex items-start justify-center pb-3",
                                    currentRoute === "/user/profile" && "text-gray-700 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100",
                                ])}>
                                {t("authRoutes.myProfile")}
                                </Link>
                            </li>
                            <li
                                onClick={() => setCurrentRoute("/user/addresses")}>
                                <Link 
                                to={"/user/addresses"}
                                className={classNames([
                                    "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide text-base flex items-start justify-center pb-3",
                                    currentRoute === "/user/addresses" && "text-gray-700 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100",
                                ])}>
                                {t("authRoutes.myAddresses")}
                                </Link>
                            </li> 
                            <li
                                onClick={() => setCurrentRoute("/user/orders")}>
                                <Link 
                                to={"/user/orders"}
                                className={classNames([
                                    "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide text-base flex items-start justify-center pb-3",
                                    currentRoute === "/user/orders" && "text-gray-700 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100",
                                ])}>
                                {t("authRoutes.myOrders")}
                                </Link>
                            </li>           
                        </ul>                        
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}