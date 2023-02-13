import { IOffer, IOrder } from "../models";

export function getStateOrder(state: number): string {
    switch(state){
        case 0: return "В поиске исполнителя";
        case 1: return "Ожидает отправки";
        case 2: return "В пути";
        case 3: return "Получено";
        default: return "Не известно!"
    }
}

export function getStateOffer(state: number): string {
    switch(state){
        case 0: return "Создано (отправлено заказчику)";
        case 1: return "Отменено заказчиком";
        case 2: return "Отменено мной";
        case 3: return "Выбрано заказчиком";
        case 4: return "Подтверждено мной";
        case 5: return "Заказ отправлен";
        case 6: return "Завершена";
        default: return "Не известно!"
    }
}

export function getStateOfferForCustomer(order: IOrder, item: IOffer, lng: string) {
    let res;
    if(item.statesOffer.slice(-1)[0].id == 6)
        lng == "en" ? res = "closed": res = "завершена";
    else if(item.deleted != "")
        lng == "en" ? res = `deleted by creator ${item.deleted}`: res = `удалена отправителем ${item.deleted}`;
    else if(order.hasConfirmedOffer && item.isSelected)
        lng == "en" ? res = `in progress`: res = `в работе`;
    else if(order.hasConfirmedOffer && !item.isSelected)
        lng == "en" ? res = "canceled automatically": res = "отменена автоматически";
    else if(!order.hasConfirmedOffer && item.isSelected)
        lng == "en" ? res = "awaiting sender confirmation": res = "ожидает подтверждения отправителем";
    else if(item.isCanceld)
        lng == "en" ? res = "canceld by sender": res = "отменена отправителем";
    else
        lng == "en" ? res = `from ${item.statesOffer[0].date}`: res = `от ${item.statesOffer[0].date}`;            
    return res;
}


interface TypeState{
    value: any,
    textRu: string,
    textEn: string
  }

export const statesOrder: TypeState[] =[
    {
        value: 0,
        textRu: "В поиске исполнителя",
        textEn: "In search performer",
    },
    {
        value: 1,
        textRu: "Ожидает отправки",
        textEn: "Awaiting shipment",
    },
    {
        value: 2,
        textRu: "В пути",
        textEn: "Shipped",
    },
    {
        value: 3,
        textRu: "Получено",
        textEn: "Received",
    },
]

export const statesOffer: TypeState[] =[
    {
        value: 0,
        textRu: "Создано (отправлено заказчику)",
        textEn: "Sent to the customer",
    },
    {
        value: 1,
        textRu: "Отменено заказчиком",
        textEn: "Canceled by the customer",
    },
    {
        value: 2,
        textRu: "Отменено мной",
        textEn: "Canceled by myself",
    },
    {
        value: 3,
        textRu: "Выбрано заказчиком",
        textEn: "Confirmed by the customer",
    },
    {
        value: 4,
        textRu: "Подтверждено мной",
        textEn: "Confirmed by the creator",
    },
    {
        value: 5,
        textRu: "Заказ отправлен",
        textEn: "Shipped",
    },
    {
        value: 6,
        textRu: "Завершена",
        textEn: "Completed",
    },
]