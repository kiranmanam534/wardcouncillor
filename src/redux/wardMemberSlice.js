import {createSlice} from '@reduxjs/toolkit';
import { wardMemberInfo } from '../services/loginApi';

const wardMemberSlice = createSlice({
  name: 'wardMemberInfo',
  initialState: {
    items: null,
    isLoading: false,
    error: null,
  },
  reducers: { },

  extraReducers: builder => {
    builder
      .addCase(wardMemberInfo.pending, state => {
        state.isLoading = true;
      })
      .addCase(wardMemberInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log('fulfilled');
        // console.log(action.payload);
        state.items = action.payload;
      })
      .addCase(wardMemberInfo.rejected, (state, action) => {
        state.isLoading = false;
        // console.log('rejected');
        // console.log(action.error)
        state.error = action.error.message;
      });
  },
});


export default wardMemberSlice;
