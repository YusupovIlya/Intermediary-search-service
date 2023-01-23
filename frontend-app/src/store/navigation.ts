export interface INav {
    text: string
    route: string
  }

export const unAuthRoutes: INav[] = [
    {
        text: "Заказать",
        route: "/order/create"
    },
    {
        text: "Выполнить заказ",
        route: "/order/all"
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
]