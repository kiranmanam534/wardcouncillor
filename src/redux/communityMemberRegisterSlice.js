import {createSlice} from '@reduxjs/toolkit';
import { CommunityMemberRegisterApi } from '../services/communityMemberApi';

const communityMemberRegisterSlice = createSlice({
  name: 'communityMemberRegisterApi',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
    statusCode:null
  },
  reducers: { },

  extraReducers: builder => {
    builder
      .addCase(CommunityMemberRegisterApi.pending, state => {
        state.isLoading = true;
        state.statusCode=null
      })
      .addCase(CommunityMemberRegisterApi.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('fulfilled');
        console.log(action.payload);
        state.items = action.payload;
        state.error=action.payload.message
        state.statusCode=action.payload.statusCode
      })
      .addCase(CommunityMemberRegisterApi.rejected, (state, action) => {
        state.isLoading = false;
        console.log('rejected');
        console.log(action.error)
        state.error = action.error.message;
        state.statusCode=action.payload.statusCode
      });
  },
});


export default communityMemberRegisterSlice;
