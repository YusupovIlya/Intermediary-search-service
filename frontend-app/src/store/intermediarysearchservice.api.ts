import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { INewOrder, ILoginResponse, ILoginRequest, IOrder, INewOffer, IResponse, IAddress } from '../models'
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
            transformErrorResponse: (
                response: { status: number, data: ILoginResponse }
              ) => response.data,
        }),
        createOrder: builder.mutation<IResponse, INewOrder>({
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
        }),
        createOffer: builder.mutation<IResponse, INewOffer>({
            query: (payload) => ({
                url: "/offer/create",
                method: 'POST',
                body: payload,
            }),
        }),
        addAddress: builder.mutation<IResponse, IAddress>({
            query: (payload) => ({
                url: "/user/addresses/add",
                method: 'POST',
                body: payload,
            }),
        }),
        getUserAddresses: builder.query<IAddress[], null>({
            query: () => ({
                url: "/user/addresses",
                method: 'GET',
            }),
        }),
        deleteAddress: builder.mutation<IResponse, IAddress>({
            query: (payload) => ({
                url: "/user/addresses/delete",
                method: 'DELETE',
                body: payload,
            }),
        })
    })
})

export const { useLoginMutation, useCreateOrderMutation, 
               useAllOrdersQuery, useGetOrderByIdQuery,
               useCreateOfferMutation, useAddAddressMutation,
               useGetUserAddressesQuery, useDeleteAddressMutation} 
               
               = intermediarySearchServiceApi