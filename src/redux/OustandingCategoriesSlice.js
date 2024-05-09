import { createSlice } from '@reduxjs/toolkit';
import { GetCouncillorWardDetailsIfoByCategoryApi } from '../services/councillorWardApi';

const OustandingCategoriesSlice = createSlice({
  name: 'OustandingCategoriesSlice',
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
      .addCase(GetCouncillorWardDetailsIfoByCategoryApi.pending, state => {
        state.isLoading = true;
        state.items = null;
        state.statusCode = null;
      })
      .addCase(
        GetCouncillorWardDetailsIfoByCategoryApi.fulfilled,
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
        GetCouncillorWardDetailsIfoByCategoryApi.rejected,
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

export const OustandingCategoriesActions = OustandingCategoriesSlice.actions

export default OustandingCategoriesSlice;
