import {configureStore} from '@reduxjs/toolkit'
import { intermediarySearchServiceApi } from './intermediarysearchservice.api'
import authReducer from './authSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    storage,
  }
  
const persistedReducer = persistReducer(persistConfig, authReducer)


export const store = configureStore({
    reducer: {
        [intermediarySearchServiceApi.reducerPath]: intermediarySearchServiceApi.reducer,
        auth: persistedReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat([intermediarySearchServiceApi.middleware])
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch