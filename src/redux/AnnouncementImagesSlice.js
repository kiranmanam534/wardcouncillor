import { createSlice } from '@reduxjs/toolkit';
import { GetAnnouncementImagesApi } from '../services/announcementApis';
const AnnouncementImagesSlice = createSlice({
    name: 'AnnouncementImagesSlice',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
        message: null,
        statusCode: null
    },
    reducers: {
        clearAnnouncementsImagesData: (state, action) => {
            state.isLoggedIn = false;
            state.items = [];
            state.message = null;
            state.statusCode = null;
        },
    },

    extraReducers: builder => {
        builder
            .addCase(GetAnnouncementImagesApi.pending, state => {
                state.isLoading = true;
                state.items = [];
                state.statusCode = null;
            })
            .addCase(
                GetAnnouncementImagesApi.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    console.log("fulfilled")
                    console.log(action.payload.data);

                    console.log('state.items=>', state.items.length)
                    state.items = action.payload.data;
                    state.message = state.items.length > 0 ? 'Data found' : 'Data Not found';

                    state.error = state.items.length > 0 ? null : action.payload.message
                    state.statusCode = action.payload.statusCode
                },
            )
            .addCase(
                GetAnnouncementImagesApi.rejected,
                (state, action) => {
                    console.log("rejected")
                    console.log(action.error)
                    console.log(action.payload)
                    state.isLoading = false;
                    state.error = action.error.message;
                    state.items = [];
                    state.message = null;
                    state.statusCode = action.error.message
                },
            );
    },
});

export const AnnouncementImagesActions = AnnouncementImagesSlice.actions;
export default AnnouncementImagesSlice;
