import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '.'
import { intermediarySearchServiceApi } from './intermediarysearchservice.api'


export type AuthState = {
  token: string | null
  id: string | null
  role: string | null
  email: string | null
}

const slice = createSlice({
  name: 'auth',
  initialState: { id: null, token: null, role: null, email: null} as AuthState,
  reducers: {
    resetState: (state: AuthState) => {
      state.id = null;
      state.token = null;
      state.role = null;
      state.email = null;
   }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      intermediarySearchServiceApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.id = payload.id;
        state.token = payload.token;
        state.role = payload.role;
        state.email = payload.email;
      }
    )
  },
})

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth;
export const clearCredentials = slice.actions.resetState;