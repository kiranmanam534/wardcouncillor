import {createSlice} from '@reduxjs/toolkit';
import actIndegentMapConsumption from './actions/actIndegentMapConsumption';

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
    builder.addCase(actIndegentMapConsumption.pending, state => {
      state.loading = 'pending';
      state.error = null;
    });
    builder.addCase(actIndegentMapConsumption.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      // console.log('actIndegentMapConsumption', action.payload);
      state.allIndegentConsumptions = action.payload?.data;
    });
    builder.addCase(actIndegentMapConsumption.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload;
      state.allIndegentConsumptions = null;
    });
  },
});

export const {clearAllErrorIndegentConsumptions} =
  AllIndegentConsumptionSlice.actions;

export default AllIndegentConsumptionSlice;
