// import {createSlice} from '@reduxjs/toolkit';
// import { GetCouncillorWardTownshipMemberInfo } from '../services/councillorWardApi';

// const councillorWardTownshipMemberSlice = createSlice({
//   name: 'councillorWardTownshipMemberSlice',
//   initialState: {
//     items: null,
//     isLoading: false,
//     error: null,
//   },
//   reducers: {},

//   extraReducers: builder => {
//     builder
//       .addCase(GetCouncillorWardTownshipMemberInfo.pending, state => {
//         state.isLoading = true;
//       })
//       .addCase(GetCouncillorWardTownshipMemberInfo.fulfilled, (state, action) => {
//         state.isLoading = false;
//         console.log(action.payload);
//         state.items = action.payload.data;
//       })
//       .addCase(GetCouncillorWardTownshipMemberInfo.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default councillorWardTownshipMemberSlice;

import { createSlice } from '@reduxjs/toolkit';
import { GetCouncillorWardTownshipMemberInfo } from '../services/councillorWardApi';

const councillorWardTownshipMemberSlice = createSlice({
  name: 'councillorWardTownshipMemberNewSlice',
  initialState: {
    items: [],
    wardmembersCount: 0,
    isLoading: false,
    error: null,
    message: null,
    statusCode: null
  },
  reducers: {
    clearWardMemberData: (state, action) => {
      state.isLoggedIn = false;
      state.items = [];
      state.wardmembersCount = 0;
      state.message = null;
      state.statusCode = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(GetCouncillorWardTownshipMemberInfo.pending, state => {
        state.isLoading = true;
        // state.items = [];
        state.wardmembersCount = 0;
        state.statusCode = null;
      })
      .addCase(
        GetCouncillorWardTownshipMemberInfo.fulfilled,
        (state, action) => {
          state.isLoading = false;
          console.log("fulfilled")
          console.log(action.payload.data);
          state.wardmembersCount = action.payload.data ? action.payload.data.length : 0;
          //   state.items = action.payload.data;
          if (action.payload.data && action.payload.data.length > 0) {
            state.items = state.items.concat(action.payload.data);
          }
          console.log('state.items=>', state.items.length)
          state.message = state.items.length > 0 ? 'Data found' : 'Data Not found';

          state.error = state.items.length > 0 ? null : action.payload.message
          state.statusCode = state.items.length > 0 ? 200 : action.payload.statusCode
        },
      )
      .addCase(
        GetCouncillorWardTownshipMemberInfo.rejected,
        (state, action) => {
          console.log("rejected")
          state.isLoading = false;
          state.error = action.error.message;
          state.wardmembersCount = 0;
          state.items = [];
          state.message = null;
          state.statusCode = action.payload.statusCodeß
        },
      );
  },
});

export const WardMemberSliceActions = councillorWardTownshipMemberSlice.actions;
export default councillorWardTownshipMemberSlice;
