import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { INewOrder, ICreateOrderResponse, ILoginResponse, ILoginRequest, IOrder } from '../models'
import { RootState } from '.'

export const intermediarySearchServiceApi = createApi({
    reducerPath: 'intermediarySearchServiceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://localhost:44349/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token
            if (token) {
              headers.set('authorization', `Bearer ${token}`)
            }
            return headers
          },
    }),
    endpoints: builder => ({
        login: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (credentials) => ({
              url: '/auth/login',
              method: 'POST',
              body: credentials,
            }),
        }),
        createOrder: builder.mutation<ICreateOrderResponse, INewOrder>({
            query: (payload) => ({
                url: "/order/create",
                method: 'POST',
                body: payload,
            }),
        }),
        allOrders: builder.query<IOrder[], null>({
            query: () => ({
                url: "/order/all",
                method: 'GET',
            }),
        }),
        getOrderById: builder.query<IOrder, string>({
            query: (id) => ({
                url: `/order/${id}`,
                method: 'GET',
            }),
        })
    })
})

export const { useLoginMutation, useCreateOrderMutation, useAllOrdersQuery, useGetOrderByIdQuery} = intermediarySearchServiceApi