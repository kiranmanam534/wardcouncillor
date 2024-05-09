import {createSlice} from '@reduxjs/toolkit';
import { getMeterImageApi } from '../services/councillorWardApi';

const MeterImageSlice = createSlice({
  name: 'auth/login',
  initialState: {
    isLoading: false,
    isSuccess: false,
    error: null,
    image: null,
  },
  reducers: {
    ClearImage: (state, action) => {
      console.log('Image Clear');
      state.error = null;
      state.image =null;      
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getMeterImageApi.pending, state => {
        console.log('getMeterImageApi.pending');
        state.image = null;        
        state.error = null;
        state.isSuccess=false;
        state.isLoading = true;
      })
      .addCase(getMeterImageApi.fulfilled, (state, action) => {
        console.log('getMeterImageApi.fulfilled');
        console.log(action.payload?.data[0]?.value);
        state.isLoading = false;        
        state.error =null;
        state.isSuccess=true;
        state.image = action.payload?.data[0]?.value
      })
      .addCase(getMeterImageApi.rejected, (state, action) => {
        console.log('getMeterImageApi.rejected');
        // console.log(action.payload);
        console.log(action.error.message);
        state.isLoading = false;
        state.message = null;
        state.isSuccess=false;
        state.error = action.error.message;
      });
  },
});

export const MeterImageActions = MeterImageSlice.actions;

export default MeterImageSlice;
