import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { INewOrder, ICreateOrderResponse } from '../models'

export const intermediarySearchServiceApi = createApi({
    reducerPath: 'intermediarySearchServiceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://localhost:44349/api/v1'
    }),
    endpoints: build => ({
        createOrder: build.mutation({
            query: (payload: INewOrder) => ({
                url: "/order/create",
                method: 'POST',
                body: payload,
                // headers: {
                //     'Content-type': 'application/json; charset=UTF-8',
                //   },

            }),
            transformResponse: (response: { data: ICreateOrderResponse }, meta, arg) => response.data
        })
    })
})

export const {useCreateOrderMutation} = intermediarySearchServiceApi