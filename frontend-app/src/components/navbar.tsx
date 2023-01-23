import classNames from "classnames";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { INav } from "../store/navigation";


export interface NavbarProps {
  unAuthRoutes: INav[]
  authRoutes: INav[]
  currentRoute: string
  setCurrentRoute: (option: any) => void
}


export default function Navbar({ unAuthRoutes, authRoutes, currentRoute, setCurrentRoute }: NavbarProps) {
    const auth = useAuth()
    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5">
                    <Link to="/" className="flex items-center">
                        <img src={process.env.PUBLIC_URL + "/app_logo.png"} className="h-6 mr-3 sm:h-9"/>
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Заказ доставки</span>
                    </Link>
                    <div className="flex items-center">
                        {auth.user
                         ? <Link to="/user/profile" className="mr-6 text-sm font-medium text-gray-500 dark:text-white hover:underline">Мой профиль</Link>
                         : <a href="tel:5541251234" className="mr-6 text-sm font-medium text-gray-500 dark:text-white hover:underline">...</a>
                        }
                        {auth.user
                         ? <Link to="/auth/logout" className="text-base font-medium text-blue-600 dark:text-blue-500 hover:underline">Выйти</Link>
                         : <Link to="/auth/login" className="text-base font-medium text-blue-600 dark:text-blue-500 hover:underline">Войти</Link>
                        }
                    </div>
                </div>
            </nav>
            <nav className="bg-gray-50 dark:bg-gray-700 rounded-b-3xl">
                <div className="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
                    <div className="flex items-center justify-between">
                        <ul className="flex flex-row mt-0 mr-6 space-x-8 text-base font-medium">
                            {unAuthRoutes.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => setCurrentRoute(item.text)}>
                                <Link 
                                to={item.route}
                                className={classNames([
                                    "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide text-base flex items-start justify-center pb-3",
                                    currentRoute === item.text && "text-gray-700 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100",
                                ])}>
                                {item.text}
                                </Link>
                            </li>           
                            ))}
                        </ul>
                        {authRoutes.length > 0 &&
                        <ul className="flex flex-row mt-0 mr-6 space-x-8 text-base font-medium">
                            {authRoutes.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => setCurrentRoute(item.text)}>
                                <Link 
                                to={item.route}
                                className={classNames([
                                    "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide text-base flex items-start justify-center pb-3",
                                    currentRoute === item.text && "text-gray-700 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100",
                                ])}>
                                {item.text}
                                </Link>
                            </li>           
                            ))}
                        </ul>                        
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}