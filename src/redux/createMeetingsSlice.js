import {createSlice} from '@reduxjs/toolkit';
import {CreateMeetingsApi} from '../services/councillorWardApi';
const createMeetingsSlice = createSlice({
  name: 'CreateMeetingsApi',
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
      .addCase(CreateMeetingsApi.pending, state => {
        state.isLoading = true;
        state.statusCode = null;
      })
      .addCase(CreateMeetingsApi.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('fulfilled');
        console.log(action.payload);
        state.items = action.payload;
        state.error = action.payload.message;
        state.statusCode = action.payload.statusCode;
      })
      .addCase(CreateMeetingsApi.rejected, (state, action) => {
        state.isLoading = false;
        console.log('rejected');
        console.log(action.error);
        state.error = action.error.message;
        state.statusCode = action.payload.statusCode;
      });
  },
});

export const createMeetingsActions = createMeetingsSlice.actions;

export default createMeetingsSlice;
