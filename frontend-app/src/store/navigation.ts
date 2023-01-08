export interface INav {
    text: string
    route: string
  }

export const navigationData: INav[] = [
    {
        text: "Заказать",
        route: "/order/create"
    },
    {
        text: "Выполнить",
        route: "/offer/search"
    },
    {
        text: "Логин",
        route: "/auth/login"
    }
]