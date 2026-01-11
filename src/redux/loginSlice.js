import {createSlice} from '@reduxjs/toolkit';
import {loginApi} from '../services/loginApi';
import {storeData} from '../session/session';
import {Alert} from 'react-native';

const loginSlice = createSlice({
  name: 'auth/login',
  initialState: {
    items: null,
    isLoading: false,
    isLoggedIn: false,
    statusCode: '',
    error: null,
    errorTimestamp: null,
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
    setLoggedUser: (state, action) => {
      state.isLoggedIn = true;
      state.items = action.payload;
      storeData('loggedUser', JSON.stringify(action.payload));
    },
    logout: state => {
      state.isLoggedIn = false;
      state.items = null;
      state.error = null;
      state.errorTimestamp = null;
    },
    clearError: state => {
      state.error = null;
      state.errorTimestamp = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(loginApi.pending, state => {
        console.log('loginApi.pending - clearing error and errorTimestamp');
        state.isLoading = true;
        state.error = null;
        state.errorTimestamp = null;
      })
      .addCase(loginApi.fulfilled, (state, action) => {
        console.log('loginApi.fulfilled - login successful');
        state.isLoading = false;
        state.error = null;
        state.errorTimestamp = null;
        state.items = action.payload.data;
        storeData('loggedUser', JSON.stringify(action.payload.data));
      })
      .addCase(loginApi.rejected, (state, action) => {
        const timestamp = Date.now();
        console.log(
          'loginApi.rejected - setting errorTimestamp to:',
          timestamp,
        );
        state.isLoading = false;
        console.log('rejected');
        console.log(action.error);
        state.error =
          action.error.code == 'ERR_NETWORK'
            ? 'Network error!'
            : action.error?.message;
        state.errorTimestamp = timestamp;
      });
  },
});

export const authSliceActions = loginSlice.actions;

export default loginSlice;
