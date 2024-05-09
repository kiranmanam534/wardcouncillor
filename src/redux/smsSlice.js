import {createSlice} from '@reduxjs/toolkit';
import {smsApi} from '../services/smsApi';

const smsSlice = createSlice({
  name: 'auth/login',
  initialState: {
    isLoading: false,
    isSMSsent: false,
    statusCode: '',
    error: '',
    message: '',
  },
  reducers: {
    smsSent: (state, action) => {
      console.log('smsSent');
      state.isSMSsent = true;
      // state.items = action.payload;
    },
    smsClear: (state, action) => {
      console.log('smsClear');
      state.isSMSsent = false;
      state.message = "";       
      // state.items = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(smsApi.pending, state => {
        console.log('smsApi.pending');
        state.message = "";        
        state.error = "";
        state.isLoading = true;
      })
      .addCase(smsApi.fulfilled, (state, action) => {
        console.log('smsApi.fulfilled');
        // console.log(action.payload);
        state.isLoading = false;        
        state.error = "";
        state.message = "The message has been sent";
        //  dispatch(smdSliceActions.smsSent());
      })
      .addCase(smsApi.rejected, (state, action) => {
        console.log('rejected');
        console.log(action.error);
        state.isLoading = false;
        state.message = "";
        state.error = action.error.message;
      });
  },
});

export const smdSliceActions = smsSlice.actions;

export default smsSlice;
