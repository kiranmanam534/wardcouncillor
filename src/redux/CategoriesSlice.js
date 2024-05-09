import { createSlice } from '@reduxjs/toolkit';
import { getCategoriesApi } from '../services/masterDataApi';

const CategoriesSlice = createSlice({
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
      .addCase(getCategoriesApi.pending, state => {
        state.isLoading = true;
        state.items = null;
        state.statusCode = null;
      })
      .addCase(
        getCategoriesApi.fulfilled,
        (state, action) => {
          state.isLoading = false;
          // console.log(action.payload);
          state.items = action.payload.data;
          state.error = action.payload.message
          state.statusCode = action.payload.statusCode
        },
      )
      .addCase(
        getCategoriesApi.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
          state.items = null;
          state.statusCode = action.payload.statusCode
        },
      );
  },
});

export const councillorWardsActions = CategoriesSlice.actions

export default CategoriesSlice;
