import { createSlice } from '@reduxjs/toolkit';
import { GetCouncillorWardDetailsIfoByWardNo } from '../services/councillorWardApi';

const councillorWardsSlice = createSlice({
  name: 'councillor-ward',
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
      .addCase(GetCouncillorWardDetailsIfoByWardNo.pending, state => {
        state.isLoading = true;
        state.items = null;
        state.statusCode = null;
      })
      .addCase(
        GetCouncillorWardDetailsIfoByWardNo.fulfilled,
        (state, action) => {
          state.isLoading = false;
          // console.log(action.payload);
          state.items = action.payload.data;
          state.error = action.payload.message
          state.statusCode = action.payload.statusCode
        },
      )
      .addCase(
        GetCouncillorWardDetailsIfoByWardNo.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
          state.items = null;
          state.statusCode = action.payload.statusCode
        },
      );
  },
});

export const councillorWardsActions = councillorWardsSlice.actions

export default councillorWardsSlice;
