import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { resetStateAction } from '../hooks/resetState';


export const unauthenticatedMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {

    if (isRejectedWithValue(action) && action.payload.status === 401) {
        console.log("401 code!!!");
        api.dispatch(resetStateAction());
    }
    return next(action)
  }