import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from '@reduxjs/toolkit/query/react'
import { INewOrder, ILoginResponse, ILoginRequest, IOrder, INewOffer, IResponse, IAddress, IPaginatedOrders, IOrdersFilter, IUserOrdersFilter, IOffer, IUserOffersFilter } from '../models'
import { RootState } from '.'
import history from '../hooks/history';
import { resetStateAction } from '../hooks/resetState';
import { toast } from 'react-toastify';
import queryString from 'query-string';

const myParamsSerializer = (params:any) => {
  return queryString.stringify(params);
};

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:44349/api/v1',
    paramsSerializer: myParamsSerializer,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token
        if (token) {
          headers.set('authorization', `Bearer ${token}`)
        }
        return headers
      },
});

const baseQueryWithRedir: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    api.dispatch(resetStateAction());
    history.push('/auth/login');
  }
  return result
}


export const intermediarySearchServiceApi = createApi({
    reducerPath: 'intermediarySearchServiceApi',
    baseQuery: baseQueryWithRedir,
    endpoints: builder => ({
        login: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (credentials) => ({
              url: '/auth/login',
              method: 'POST',
              body: credentials,
            }),
            transformErrorResponse: (response: { status: number, data: ILoginResponse }) => response.data,
        }),

        createOrder: builder.mutation<IResponse, INewOrder>({
            query: (payload) => ({
                url: "/orders",
                method: 'POST',
                body: payload,
            }),
        }),
        removeOrder: builder.mutation<null, {id: number}>({
            query: (payload) => ({
                url: `/orders/${payload.id}`,
                method: 'DELETE',
            }),
        }),
        updateOrder: builder.mutation<IResponse, {id: number, data: INewOrder}>({
            query: (payload) => ({
                url: `/orders/${payload.id}`,
                method: 'PUT',
                body: payload.data,
            }),
        }),
        addTrackToOrder: builder.mutation<IResponse, {id: number, trackNumber: string}>({
            query: (payload) => ({
                url: `/orders/${payload.id}/tracknumber/${payload.trackNumber}`,
                method: 'PUT'
            }),
        }),
        closeOrder: builder.mutation<IResponse, {id: number}>({
            query: (payload) => ({
                url: `/orders/${payload.id}/close`,
                method: 'PUT'
            }),
        }),
        filteredOrders: builder.query<IPaginatedOrders, IOrdersFilter>({
            query: (payload) => ({
                url: "/orders",
                method: 'GET',
                params: {
                    page: payload.page,
                    pageSize: payload.pageSize,
                    shops: payload.shops.length == 0 ? undefined : payload.shops,
                    countries: payload.countries.length == 0 ? undefined : payload.countries,
                    numOrderItems: payload.numOrderItems == -1 ? undefined: payload.numOrderItems,
                    minOrderPrice: payload.minOrderPrice == -1 ? undefined: payload.minOrderPrice,
                    maxOrderPrice: payload.maxOrderPrice == -1 ? undefined: payload.maxOrderPrice,
                    sortBy: payload.sortBy
                },
            })
        }),
        getOrderById: builder.query<IOrder, string>({
            query: (id) => ({
                url: `/orders/${id}`,
                method: 'GET',
            }),
        }),

        createOffer: builder.mutation<IResponse, INewOffer>({
            query: (payload) => ({
                url: "/offers",
                method: 'POST',
                body: payload,
            }),
        }),
        updateOffer: builder.mutation<IResponse, {id: number, data: INewOffer}>({
            query: (payload) => ({
                url: `/offers/${payload.id}`,
                method: 'PUT',
                body: payload.data,
            }),
        }),
        removeOffer: builder.mutation<null, {id: number}>({
            query: (payload) => ({
                url: `/offers/${payload.id}`,
                method: 'DELETE',
            }),
        }),
        selectOffer: builder.mutation<IResponse, {orderId: number, offerId: number}>({
            query: (payload) => ({
                url: `/orders/${payload.orderId}/offers/${payload.offerId}`,
                method: 'PUT',
            }),
        }),
        changeStateOffer: builder.mutation<IResponse, {id: number, state: number}>({
            query: (payload) => ({
                url: `/offers/${payload.id}/states/${payload.state}`,
                method: 'PUT',
            }),
        }),
        getUserOffers: builder.query<IOffer[], {id: string, param: IUserOffersFilter}>({
            query: (payload) => ({
                url: `/users/${payload.id}/offers`,
                method: 'GET',
                params: {
                    offerStates: payload.param.offerStates.length == 0 ? undefined : payload.param.offerStates,
                    sortBy: payload.param.sortBy
                },
            }),
        }),

        getUserOrders: builder.query<IOrder[], {id: string, param: IUserOrdersFilter}>({
            query: (payload) => ({
                url: `/users/${payload.id}/orders`,
                method: 'GET',
                params: {
                    orderStates: payload.param.orderStates.length == 0 ? undefined : payload.param.orderStates,
                    shops: payload.param.shops.length == 0 ? undefined : payload.param.shops,
                    sortBy: payload.param.sortBy
                },
            }),
        }),
        addAddress: builder.mutation<IResponse, {id: string, data: IAddress}>({
            query: (payload) => ({
                url: `/users/${payload.id}/addresses`,
                method: 'POST',
                body: payload.data,
            }),
        }),
        getUserAddresses: builder.query<IAddress[], {id: string}>({
            query: (payload) => ({
                url: `/users/${payload.id}/addresses`,
                method: 'GET',
            }),
        }),
        removeAddress: builder.mutation<IResponse, {id: number, userId: string}>({
            query: (payload) => ({
                url: `/users/${payload.userId}/addresses/${payload.id}`,
                method: 'DELETE',
            }),
        }),
        getParamsForFilter: builder.query<string[], number>({
            query: (type) => ({
                url: `/orders/params/${type}`,
                method: 'GET',
            }),
        }),
    })
})

export const { useLoginMutation, useCreateOrderMutation, 
               useGetOrderByIdQuery, useCreateOfferMutation, 
               useAddAddressMutation, useFilteredOrdersQuery,
               useGetUserAddressesQuery, useRemoveAddressMutation,
               useGetUserOrdersQuery, useSelectOfferMutation,
               useRemoveOrderMutation, useUpdateOrderMutation,
               useGetParamsForFilterQuery, useGetUserOffersQuery,
               useUpdateOfferMutation, useRemoveOfferMutation,
               useChangeStateOfferMutation, useAddTrackToOrderMutation,
               useCloseOrderMutation}
               
               = intermediarySearchServiceApi