import { createSlice } from '@reduxjs/toolkit';
import { GetAnnouncementVewInfoApi } from '../services/announcementApis';
const AnnouncementViewSlice = createSlice({
  name: 'councillorWardTownshipMemberNewSlice',
  initialState: {
    items: [],
    announcementCount: 0,
    isLoading: false,
    error: null,
    message: null,
    statusCode: null
  },
  reducers: {
    clearAnnouncementsData: (state, action) => {
      state.isLoggedIn = false;
      state.items = [];
      state.announcementCount = 0;
      state.message = null;
      state.statusCode = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(GetAnnouncementVewInfoApi.pending, state => {
        state.isLoading = true;
        // state.items = [];
        state.announcementCount = 0;
        state.statusCode = null;
      })
      .addCase(
        GetAnnouncementVewInfoApi.fulfilled,
        (state, action) => {
          state.isLoading = false;
          console.log("fulfilled")
          // console.log(action.payload.data);
          state.announcementCount = action.payload.data ? action.payload.data.length : 0;
          //   state.items = action.payload.data;
          if (action.payload.data && action.payload.data.length > 0) {
            // state.items = state.items.concat(action.payload.data);
            state.items = state.items.concat(action.payload.data);
          }
          console.log('state.items=>', state.items.length)
          state.message = state.items.length > 0 ? 'Data found' : 'Data Not found';

          state.error = state.items.length > 0 ? null : action.payload.message
          state.statusCode = state.items.length > 0 ? 200 : action.payload.statusCode
        },
      )
      .addCase(
        GetAnnouncementVewInfoApi.rejected,
        (state, action) => {
          console.log("rejected")
          console.log(action.error)
          console.log(action.payload)
          state.isLoading = false;
          state.error = action.error.message;
          state.announcementCount = 0;
          state.items = [];
          state.message = null;
          state.statusCode = action.error.message
        },
      );
  },
});

export const AnnounceViewActions = AnnouncementViewSlice.actions;
export default AnnouncementViewSlice;
