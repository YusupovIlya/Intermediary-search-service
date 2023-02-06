import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from '@reduxjs/toolkit/query/react'
import { INewOrder, ILoginResponse, ILoginRequest, IOrder, INewOffer, IResponse, IAddress, IPaginatedOrders, IOrdersFilter, IUserOrdersFilter } from '../models'
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
    toast.error("Вам необходимо авторизоваться!");
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
        removeOrder: builder.mutation<IResponse, {orderId: number}>({
            query: (payload) => ({
                url: `/orders/${payload.orderId}`,
                method: 'DELETE',
            }),
        }),
        editOrder: builder.mutation<IResponse, {orderId: number, data: INewOrder}>({
            query: (payload) => ({
                url: `/orders/${payload.orderId}`,
                method: 'PUT',
                body: payload.data,
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
                url: "/offer/create",
                method: 'POST',
                body: payload,
            }),
        }),
        selectOffer: builder.mutation<IResponse, {orderId: number, offerId: number}>({
            query: (payload) => ({
                url: `/orders/${payload.orderId}/offers/${payload.offerId}`,
                method: 'PUT',
            }),
        }),

        getUserOrders: builder.query<IOrder[], IUserOrdersFilter>({
            query: (payload) => ({
                url:"/user/orders",
                method: 'GET',
                params: {
                    orderStates: payload.orderStates.length == 0 ? undefined : payload.orderStates,
                    shops: payload.shops.length == 0 ? undefined : payload.shops,
                    sortBy: payload.sortBy
                },
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
               useGetUserAddressesQuery, useDeleteAddressMutation,
               useGetUserOrdersQuery, useSelectOfferMutation,
               useRemoveOrderMutation, useEditOrderMutation,
               useGetParamsForFilterQuery}
               
               = intermediarySearchServiceApi