import {createSlice} from '@reduxjs/toolkit';
import {CreateWarningsApi} from '../services/councillorWardApi';
const createWarningsSlice = createSlice({
  name: 'CreateWarningsApi',
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
      .addCase(CreateWarningsApi.pending, state => {
        state.isLoading = true;
        state.statusCode = null;
      })
      .addCase(CreateWarningsApi.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('fulfilled');
        console.log(action.payload);
        state.items = action.payload;
        state.error = action.payload.message;
        state.statusCode = action.payload.statusCode;
      })
      .addCase(CreateWarningsApi.rejected, (state, action) => {
        state.isLoading = false;
        console.log('rejected');
        console.log(action.error);
        state.error = action.error.message;
        state.statusCode = action.payload.statusCode;
      });
  },
});

export const createWarningsActions = createWarningsSlice.actions;

export default createWarningsSlice;
