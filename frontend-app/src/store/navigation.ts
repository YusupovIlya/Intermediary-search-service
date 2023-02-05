export interface INav {
    text: string
    route: string
  }

export const unAuthRoutes: INav[] = [
    {
        text: "Заказать",
        route: "/orders/create"
    },
    {
        text: "Выполнить заказ",
        route: "/orders/all"
    },
]

export const authRoutes: INav[] = [
    {
        text: "Мой профиль",
        route: "/user/profile"
    },
    {
        text: "Мои адреса",
        route: "/user/addresses"
    },
    {
        text: "Мои заказы",
        route: "/user/orders"
    },
]