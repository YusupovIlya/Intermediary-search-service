import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta} from '@reduxjs/toolkit/query/react'
import { INewOrder, ILoginResponse, ILoginRequest, IOrder, INewOffer, IResponse, IAddress, IPaginationOptions, IPaginatedOrders, IOrdersFilter } from '../models'
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
                url: "/order/create",
                method: 'POST',
                body: payload,
            }),
        }),
        allOrders: builder.query<IPaginatedOrders, IPaginationOptions>({
            query: (payload) => ({
                url: "/order/all/fdfd",
                method: 'GET',
                params: {
                    page: payload.page,
                    pageSize: payload.pageSize
                },
            })
        }),
        filteredOrders: builder.query<IPaginatedOrders, IOrdersFilter>({
            query: (payload) => ({
                url: "/order/all",
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
        }),
        getShopsForFilter: builder.query<string[], null>({
            query: () => ({
                url: "/order/shopslist",
                method: 'GET',
            }),
        }),
        getCountriesForFilter: builder.query<string[], null>({
            query: () => ({
                url: "/order/countrieslist",
                method: 'GET',
            }),
        }),
    })
})

export const { useLoginMutation, useCreateOrderMutation, 
               useAllOrdersQuery, useGetOrderByIdQuery,
               useCreateOfferMutation, useAddAddressMutation,
               useGetUserAddressesQuery, useDeleteAddressMutation,
               useGetCountriesForFilterQuery, useGetShopsForFilterQuery,
               useFilteredOrdersQuery} 
               
               = intermediarySearchServiceApi