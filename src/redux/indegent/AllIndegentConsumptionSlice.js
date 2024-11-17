import {createSlice} from '@reduxjs/toolkit';
import actGetIndegentConsumptionsApi from './actions/actIndegentConsumption';

const initialState = {
  allIndegentConsumptions: null,
  loading: 'idle',
  error: null,
};

const AllIndegentConsumptionSlice = createSlice({
  name: 'IndegentConsumptions',
  initialState,
  reducers: {
    clearAllErrorIndegentConsumptions(state) {
      state.error = null;
      state.allIndegentConsumptions = null;
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
        // console.log('actGetIndegentConsumptionsApi', action.payload);
        state.allIndegentConsumptions = action.payload?.data;
      },
    );
    builder.addCase(actGetIndegentConsumptionsApi.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload;
    });
  },
});

export const {clearAllErrorIndegentConsumptions} =
  AllIndegentConsumptionSlice.actions;

export default AllIndegentConsumptionSlice;
