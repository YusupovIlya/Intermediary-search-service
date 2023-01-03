import {configureStore} from '@reduxjs/toolkit'
import { intermediarySearchServiceApi } from './intermediarysearchservice.api'

export const store = configureStore({
    reducer: {
        [intermediarySearchServiceApi.reducerPath]: intermediarySearchServiceApi.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(intermediarySearchServiceApi.middleware)
})