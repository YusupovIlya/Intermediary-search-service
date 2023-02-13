import { createSlice } from '@reduxjs/toolkit'
import { IUser } from '../models'
import type { RootState } from '.'
import { intermediarySearchServiceApi } from './intermediarysearchservice.api'

type AuthState = {
  user: IUser | null
  token: string | null
  id: string | null
}

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, id: null} as AuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      intermediarySearchServiceApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.id = payload.id
        state.token = payload.token
        state.user = payload.user
      }
    )
  },
})

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth