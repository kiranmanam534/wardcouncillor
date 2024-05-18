import { createSlice } from '@reduxjs/toolkit';
import { GetCustomer360DataApi } from '../services/councillorWardApi';

const customer360Slice = createSlice({
  name: 'customer360',
  initialState: {
    items: null,
    isLoading: false,
    error: null,
    statusCode: null
  },
  reducers: {
    clearWards: (state, action) => {
      state.items = null;
      state.statusCode = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(GetCustomer360DataApi.pending, state => {
        state.isLoading = true;
        state.items = null;
        state.statusCode = null;
      })
      .addCase(
        GetCustomer360DataApi.fulfilled,
        (state, action) => {
          state.isLoading = false;
          console.log("fulfilled");
          console.log(action.payload);
          state.items = action.payload.data;
          state.error = action.payload.message
          state.statusCode = action.payload.statusCode
        },
      )
      .addCase(
        GetCustomer360DataApi.rejected,
        (state, action) => {
          state.isLoading = false;
          console.log("fulfilled");
          console.log(action.payload);
          state.error = action.error.message;
          state.items = null;
          state.statusCode = action.payload.statusCode
        },
      );
  },
});

export const customer360Actions = customer360Slice.actions

export default customer360Slice;
