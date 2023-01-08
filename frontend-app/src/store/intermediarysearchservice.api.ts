import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { INewOrder, ICreateOrderResponse, UserResponse, LoginRequest } from '../models'
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
        login: builder.mutation<UserResponse, LoginRequest>({
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
            transformResponse: (response: { data: ICreateOrderResponse }, meta, arg) => response.data
        })
    })
})

export const { useLoginMutation, useCreateOrderMutation} = intermediarySearchServiceApi