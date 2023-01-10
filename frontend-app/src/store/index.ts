import {configureStore} from '@reduxjs/toolkit'
import { intermediarySearchServiceApi } from './intermediarysearchservice.api'
import authReducer from './authSlice'

export const store = configureStore({
    reducer: {
        [intermediarySearchServiceApi.reducerPath]: intermediarySearchServiceApi.reducer,
        auth: authReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(intermediarySearchServiceApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch