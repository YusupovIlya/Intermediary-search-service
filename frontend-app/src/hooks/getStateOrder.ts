
export function getStateOrder(state: number): string {
    switch(state){
        case 0: return "В поиске исполнителя";
        case 1: return "Ожидает отправки";
        case 2: return "В пути";
        case 3: return "Получено";
        default: return "Не известно!"
    }
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