import { createSlice } from '@reduxjs/toolkit'
import { IUser } from '../models'
import type { RootState } from '.'
import { intermediarySearchServiceApi } from './intermediarysearchservice.api'

type AuthState = {
  user: IUser | null
  token: string | null
}

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null } as AuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      intermediarySearchServiceApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token
        state.user = payload.user
      }
    )
  },
})

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user