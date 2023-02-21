import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta} from '@reduxjs/toolkit/query/react'
import { INewOrder, ILoginResponse, ILoginRequest, IOrder, INewOffer, IResponse, IAddress, IPaginatedOrders, IOrdersFilter, IUserOrdersFilter, IOffer, IUserOffersFilter, IUserProfile, INewUser } from '../models'
import { RootState } from '.'
import history from '../hooks/history';

import queryString from 'query-string';
import { clearCredentials } from './authSlice';

const myParamsSerializer = (params:any) => {
  return queryString.stringify(params);
};

const baseQuery = fetchBaseQuery({
    baseUrl: "api/v1",
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
    api.dispatch(clearCredentials());
    history.push(`/auth/login/?returnUrl=${history.location.pathname}`);
  }
  if (result.meta?.response?.status === 404) {
    history.push("/notfound");
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
        registration: builder.mutation<{data: IResponse, status: number}, INewUser>({
            query: (credentials) => ({
              url: '/auth/registration',
              method: 'POST',
              body: credentials,
            }),
            transformResponse: (response: IResponse, meta: FetchBaseQueryMeta) => {
                return {data: response, status: meta.response?.status!}
            },
            transformErrorResponse: (response: FetchBaseQueryError) => response.status
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
            })
        }),

        createOffer: builder.mutation<IResponse, INewOffer>({
            query: (payload) => ({
                url: "/offers",
                method: 'POST',
                body: payload,
            }),
            transformErrorResponse: (response: { status: 'PARSING_ERROR';originalStatus: number;data: string;error: string; }) => response.originalStatus,
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
        getUserOffers: builder.query<{data: IOffer[], status: number}, {id: string, param: IUserOffersFilter}>({
            query: (payload) => ({
                url: `/users/${payload.id}/offers`,
                method: 'GET',
                params: {
                    offerStates: payload.param.offerStates.length == 0 ? undefined : payload.param.offerStates,
                    sortBy: payload.param.sortBy
                },
            }),
            transformResponse: (response: IOffer[], meta: FetchBaseQueryMeta) => {
                return {data: response, status: meta.response?.status!}
            }
        }),

        getUserOrders: builder.query<{data: IOrder[], status: number}, {id: string, param: IUserOrdersFilter}>({
            query: (payload) => ({
                url: `/users/${payload.id}/orders`,
                method: 'GET',
                params: {
                    orderStates: payload.param.orderStates.length == 0 ? undefined : payload.param.orderStates,
                    shops: payload.param.shops.length == 0 ? undefined : payload.param.shops,
                    sortBy: payload.param.sortBy
                },
            }),
            transformResponse: (response: IOrder[], meta: FetchBaseQueryMeta) => {
                return {data: response, status: meta.response?.status!}
            }
        }),
        addAddress: builder.mutation<IResponse, {id: string, data: IAddress}>({
            query: (payload) => ({
                url: `/users/${payload.id}/addresses`,
                method: 'POST',
                body: payload.data,
            }),
        }),
        getUserAddresses: builder.query<{data: IAddress[], status: number}, {id: string}>({
            query: (payload) => ({
                url: `/users/${payload.id}/addresses`,
                method: 'GET',
            }),
            transformResponse: (response: IAddress[], meta: FetchBaseQueryMeta) => {
                return {data: response, status: meta.response?.status!}
            }
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
        getUserProfile: builder.query<IUserProfile, {email: string}>({
            query: (payload) => ({
                url: `/users/${payload.email}`,
                method: 'GET',
            }),
        }),
        updateUserProfile: builder.mutation<IResponse, {id: string, data: IUserProfile}>({
            query: (payload) => ({
                url: `/users/${payload.id}`,
                method: 'PUT',
                body: payload.data,
            }),
        }),
        removeUserProfile: builder.mutation<IResponse, {id: string}>({
            query: (payload) => ({
                url: `/users/${payload.id}`,
                method: 'DELETE',
            }),
        }),
        getAllUsers: builder.query<IUserProfile[], null>({
            query: () => ({
                url: "/users",
                method: 'GET',
            }),
        }),
        lockUser: builder.mutation<IResponse, {id: string}>({
            query: (payload) => ({
                url: `/users/${payload.id}/lock`,
                method: 'PUT',
            }),
        }),
        unlockUser: builder.mutation<IResponse, {id: string}>({
            query: (payload) => ({
                url: `/users/${payload.id}/unlock`,
                method: 'PUT',
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
               useCloseOrderMutation, useGetUserProfileQuery,
               useUpdateUserProfileMutation, useRegistrationMutation,
               useRemoveUserProfileMutation, useGetAllUsersQuery,
               useLockUserMutation, useUnlockUserMutation}
               
               = intermediarySearchServiceApi