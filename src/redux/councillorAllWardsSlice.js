import { createSlice } from '@reduxjs/toolkit';
import { GetCouncillorWardDetailsIfoByAllWardsApi } from '../services/councillorWardApi';

const councillorAllWardsSlice = createSlice({
  name: 'councillorAllWards',
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
      .addCase(GetCouncillorWardDetailsIfoByAllWardsApi.pending, state => {
        state.isLoading = true;
        state.items = null;
        state.statusCode = null;
      })
      .addCase(
        GetCouncillorWardDetailsIfoByAllWardsApi.fulfilled,
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
        GetCouncillorWardDetailsIfoByAllWardsApi.rejected,
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

export const councillorAllWardsActions = councillorAllWardsSlice.actions

export default councillorAllWardsSlice;
