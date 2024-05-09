import {createSlice} from '@reduxjs/toolkit';
import {CreateHealthCareApi} from '../services/councillorWardApi';
const createHealthCareSlice = createSlice({
  name: 'CreateHealthCareApi',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
    statusCode: null,
  },
  reducers: {
    clear: (state, action) => {
      state.error = null;
      state.statusCode = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(CreateHealthCareApi.pending, state => {
        state.isLoading = true;
        state.statusCode = null;
      })
      .addCase(CreateHealthCareApi.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('fulfilled');
        console.log(action.payload);
        state.items = action.payload;
        state.error = action.payload.message;
        state.statusCode = action.payload.statusCode;
      })
      .addCase(CreateHealthCareApi.rejected, (state, action) => {
        state.isLoading = false;
        console.log('rejected');
        console.log(action.error);
        state.error = action.error.message;
        state.statusCode = action.payload.statusCode;
      });
  },
});

export const createHealthCareActions = createHealthCareSlice.actions;

export default createHealthCareSlice;
