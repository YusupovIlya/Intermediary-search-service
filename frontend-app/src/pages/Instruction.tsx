import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom"

export default function Instruction(){
    const {lng} = useParams();
    const { t } = useTranslation('titles');
    document.title = t("guide");
    return(
        <div>
            {lng == "ru" &&
            <div className="flex flex-col space-y-4">
                <iframe src={process.env.PUBLIC_URL + "/ru-order.pdf"} width="800" height="900"></iframe>
                <iframe src={process.env.PUBLIC_URL + "/ru-offer.pdf"} width="800" height="900"></iframe>             
            </div>   
            }
            {lng == "en" &&
            <div className="flex flex-col space-y-4">
                <iframe src={process.env.PUBLIC_URL + "/en-order.pdf"} width="800" height="900"></iframe>
                <iframe src={process.env.PUBLIC_URL + "/en-offer.pdf"} width="800" height="900"></iframe>             
            </div>   
            }     
        </div>
    )
}