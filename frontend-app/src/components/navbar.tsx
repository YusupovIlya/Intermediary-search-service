import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import history from "../hooks/history";
import { useClearCredentials } from "../hooks/resetState";
import { useAuth } from "../hooks/useAuth";
import { authRoutes } from "../store/navigation";


export default function Navbar() {
    const auth = useAuth();
    const clearCredentials = useClearCredentials();
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
                        <div className="pr-4">
                            <NavLink to={`/instruction/${i18n.language}`}
                                className={({ isActive }) =>(isActive 
                                ? "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide flex items-start justify-center border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100"
                                : "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide flex items-start justify-center")}
                                >
                                {t("unAuthRoutes.howtouse")}
                            </NavLink>                               
                        </div>                        
                        <button 
                            className="bg-zinc-500 text-white active:bg-zinc-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                            onClick={()=> i18n.changeLanguage("ru")}
                            >ru
                        </button>
                        <button 
                            className="bg-zinc-500 text-white active:bg-zinc-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-5 mb-1 ease-linear transition-all duration-150" 
                            onClick={()=> i18n.changeLanguage("en")}
                            >en
                        </button>
                        {auth.user.id != null
                         ? <button 
                            className="text-base font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            onClick={() => {
                                clearCredentials();
                                history.push("/auth/login");
                            }}
                            >{t("unAuthRoutes.logout")}
                            </button>
                         : <button 
                                className="text-base font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                onClick={() => history.push("/auth/login")}
                                >{t("unAuthRoutes.login")}
                           </button>
                        }
                    </div>
                </div>
            </nav>
            <nav className="bg-gray-50 dark:bg-gray-700 rounded-b-3xl">
                <div className="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
                    <div className="flex flex-col space-y-2 sm:flex-row items-center justify-between text-sm md:text-base">
                        <ul className="flex flex-row mt-0 mr-6 space-x-8 font-medium">
                            <li>                               
                                <NavLink to="/orders/create"
                                    className={({ isActive }) =>(isActive 
                                    ? "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide flex items-start justify-center pb-3 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100"
                                    : "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide flex items-start justify-center pb-3")}
                                    >
                                    {t("unAuthRoutes.createOrder")}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/orders/all"
                                    className={({ isActive }) =>(isActive 
                                    ? "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide flex items-start justify-center pb-3 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100"
                                    : "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide flex items-start justify-center pb-3")}
                                    >
                                    {t("unAuthRoutes.findOrder")}
                                </NavLink>
                            </li>   
                        </ul>
                        {auth.user.id != null && auth.user.role == "User" &&
                        <ul className="flex flex-row mt-0 mr-6 space-x-8 font-medium">
                            {t<string, string[]>('authRoutes', { returnObjects: true }).map((item, index) => (
                                <li
                                    key={index}>
                                    <NavLink to={authRoutes[index]} 
                                        className={({ isActive }) =>(isActive 
                                        ? "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide flex items-start justify-center pb-3 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100"
                                        : "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide flex items-start justify-center pb-3")}
                                        >
                                        {item}
                                    </NavLink>
                                </li>                                
                            ))
                            }          
                        </ul>                        
                        }
                        {auth.user.id != null && auth.user.role == "Admin" &&
                        <ul className="flex flex-row mt-0 mr-6 space-x-8 font-medium">
                            <li>
                                <NavLink to="/admin/users"
                                    className={({ isActive }) =>(isActive 
                                    ? "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide flex items-start justify-center pb-3 border-b-4 border-gray-700 bg-gradient-to-b from-white to-gray-100"
                                    : "w-fit text-neutral-700 hover:text-gray-700 cursor-pointer font-medium tracking-wide flex items-start justify-center pb-3")}
                                    >
                                    {t("unAuthRoutes.allUsers")}
                                </NavLink>
                            </li> 
                        </ul>                        
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}