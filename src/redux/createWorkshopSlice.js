import {createSlice} from '@reduxjs/toolkit';
import {CreateWorkshopApi} from '../services/councillorWardApi';
const createWorkshopSlice = createSlice({
  name: 'CreateWorkshopApi',
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
      .addCase(CreateWorkshopApi.pending, state => {
        state.isLoading = true;
        state.statusCode = null;
      })
      .addCase(CreateWorkshopApi.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('fulfilled');
        console.log(action.payload);
        state.items = action.payload;
        state.error = action.payload.message;
        state.statusCode = action.payload.statusCode;
      })
      .addCase(CreateWorkshopApi.rejected, (state, action) => {
        state.isLoading = false;
        console.log('rejected');
        console.log(action.error);
        state.error = action.error.message;
        state.statusCode = action.payload.statusCode;
      });
  },
});

export const createWorkshopActions = createWorkshopSlice.actions;

export default createWorkshopSlice;
