import { createSlice } from '@reduxjs/toolkit';
import { GetPaymentHistoryApi } from '../services/councillorWardApi';

const PaymentHistorySlice = createSlice({
  name: 'PaymentHistorySlice',
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
      .addCase(GetPaymentHistoryApi.pending, state => {
        state.isLoading = true;
        state.items = null;
        state.statusCode = null;
      })
      .addCase(
        GetPaymentHistoryApi.fulfilled,
        (state, action) => {
          state.isLoading = false;
          console.log("fulfilled");
          console.log(action.payload.paymentHistories);
          state.items = action.payload.paymentHistories;
          state.error = 'No error'
          state.statusCode = '200'
        },
      )
      .addCase(
        GetPaymentHistoryApi.rejected,
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

export const PaymentHistoryActions = PaymentHistorySlice.actions

export default PaymentHistorySlice;
