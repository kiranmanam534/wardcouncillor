import { createSlice } from '@reduxjs/toolkit';
import { loginApi } from '../services/loginApi';
import { storeData } from '../session/session';

const loginSlice = createSlice({
  name: 'auth/login',
  initialState: {
    items: null,
    isLoading: false,
    isLoggedIn: false,
    statusCode: '',
    error: null,
    message: '',
    loggedUserName: '',
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.items = action.payload;
    },
    getUserName: (state, action) => {
      state.loggedUserName = action.payload;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.items = null;
      state.error = null
    },
  },

  extraReducers: builder => {
    builder
      .addCase(loginApi.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginApi.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log('fulfilled');
        // console.log(action.payload);
        state.items = action.payload.data;
        storeData('loggedUser', JSON.stringify(action.payload.data));
      })
      .addCase(loginApi.rejected, (state, action) => {
        state.isLoading = false;
        console.log('rejected');
        console.log(action.error)
        state.error = action.error.code == 'ERR_NETWORK' ? "Network error!" : action.error?.message;
      });
  },
});

export const authSliceActions = loginSlice.actions;

export default loginSlice;
