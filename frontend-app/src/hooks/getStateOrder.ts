import { TypesSort } from "../pages/AllOrders";

export function getStateOrder(state: number): string {
    switch(state){
        case 0: return "В поиске исполнителя";
        case 1: return "Ожидает отправки";
        case 2: return "В пути";
        case 3: return "Получено";
        default: return "Не известно!"
    }
}

export const statesOrder: TypesSort[] =[
    {
        value: 0,
        text: "В поиске исполнителя",  
    },
    {
        value: 1,
        text: "Ожидает отправки",  
    },
    {
        value: 2,
        text: "В пути",  
    },
    {
        value: 3,
        text: "Получено",  
    },
]