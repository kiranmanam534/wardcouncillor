import {createSlice} from '@reduxjs/toolkit';
import actGetIndegentConsumptionsApi from './actions/actIndegentConsumption';

const initialState = {
  indegentConsumptions: null,
  loading: 'idle',
  error: null,
};

const IndegentConsumptionSlice = createSlice({
  name: 'IndegentConsumptions',
  initialState,
  reducers: {
    clearErrorIndegentConsumptions(state) {
      state.error = null;
      state.indegentConsumptions = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(actGetIndegentConsumptionsApi.pending, state => {
      state.loading = 'pending';
      state.error = null;
    });
    builder.addCase(
      actGetIndegentConsumptionsApi.fulfilled,
      (state, action) => {
        state.loading = 'succeeded';
        console.log('actGetIndegentConsumptionsApi', action.payload);
        state.indegentConsumptions = action.payload?.data;
      },
    );
    builder.addCase(actGetIndegentConsumptionsApi.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload;
    });
  },
});

export const {clearErrorIndegentConsumptions} =
  IndegentConsumptionSlice.actions;

export default IndegentConsumptionSlice;
