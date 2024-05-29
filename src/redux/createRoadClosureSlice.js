import {createSlice} from '@reduxjs/toolkit';
import {CreateRoadClosureApi} from '../services/councillorWardApi';
const createRoadClosureSlice = createSlice({
  name: 'CreateRoadClosureApi',
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
      .addCase(CreateRoadClosureApi.pending, state => {
        state.isLoading = true;
        state.statusCode = null;  
      })
      .addCase(CreateRoadClosureApi.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('fulfilled');
        console.log(action.payload);
        if (action.payload.statusCode == 200) {
          state.data = action.payload;
          state.error = action.payload.message;
          state.statusCode = action.payload.statusCode;
        }
        else {
          console.log('====================================');
          console.log('error');
          console.log('====================================');
          state.data = null;
          state.error = "something went wrong!";
          state.statusCode = 400;
        }
      })
      .addCase(CreateRoadClosureApi.rejected, (state, action) => {
        state.isLoading = false;
        console.log('rejected');
        console.log(action.error);
        state.error = action.error.message;
        state.statusCode = action.payload.statusCode;
      });
  },
});

export const createRoadClosureActions = createRoadClosureSlice.actions;

export default createRoadClosureSlice;
