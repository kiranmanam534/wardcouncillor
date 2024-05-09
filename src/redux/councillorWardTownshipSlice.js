import {createSlice} from '@reduxjs/toolkit';
import {GetCouncillorWardTownshipIfoByWardNo} from '../services/councillorWardApi';

const councillorWardTownshipSlice = createSlice({
  name: 'councillor-ward',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    statusCode: null
  },
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(GetCouncillorWardTownshipIfoByWardNo.pending, state => {
        state.isLoading = true;
        state.items=[];
        state.statusCode = null;
      })
      .addCase(GetCouncillorWardTownshipIfoByWardNo.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload.data);
        state.items = action.payload.data;
        state.error = action.payload.message
        state.statusCode = action.payload.statusCode
      })
      .addCase(GetCouncillorWardTownshipIfoByWardNo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.items=[];
        state.statusCode = action.payload.statusCode
      });
  },
});

export default councillorWardTownshipSlice;
