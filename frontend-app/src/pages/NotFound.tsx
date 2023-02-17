import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


export default function NotFound(){
    const { t } = useTranslation(['user', 'buttons']);
    return(
        <section className="flex items-center h-full p-16 bg-gray-200 text-gray-100">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl text-gray-600">
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl text-gray-600">{t("notFoundMsg1")}</p>
                    <p className="mt-4 mb-8 text-gray-400 text-gray-600">{t("notFoundMsg2")}</p>
                    <Link to="/orders/all" className="px-8 py-3 font-semibold rounded bg-violet-400 text-gray-900">{t("open", {ns: "buttons"})}</Link>
                </div>
            </div>
        </section>
    )
}