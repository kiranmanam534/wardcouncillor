import { createSlice } from '@reduxjs/toolkit';
import { getCouncillorWardDashboardApi } from '../services/councillorWardApi';

const councillorWardDashboardSlice = createSlice({
  name: 'ward-dashboard',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    statusCode: null
  },
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(getCouncillorWardDashboardApi.pending, state => {
        state.isLoading = true;
        state.statusCode = null;
      })
      .addCase(getCouncillorWardDashboardApi.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log(action.payload);
        state.items = action.payload.data;
        state.error = action.payload.message
        state.statusCode = action.payload.statusCode
      })
      .addCase(getCouncillorWardDashboardApi.rejected, (state, action) => {
        state.isLoading = false;
        console.log("rejected",action.error.message)
        state.error = action.error.message;
        state.statusCode = action.payload.statusCode
      });
  },
});

export default councillorWardDashboardSlice;
