import {createFeatureSelector, createSelector} from '@ngrx/store'
import {USERS_FEATURE_KEY, UsersPartialState, UsersState} from './users.reducer'

// Lookup the 'Users' feature state managed by NgRx
export const getUsersState = createFeatureSelector<UsersState>(USERS_FEATURE_KEY)
export const getuser = createSelector(getUsersState, (state) => state.user)

export const getUserisAuth = createSelector(getUsersState, (state) => state.isAuthenticated)

