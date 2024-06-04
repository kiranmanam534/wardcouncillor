import { createSlice } from '@reduxjs/toolkit';
import { DeleteAnnouncementApi } from '../services/announcementApis';
const AnnouncementDeleteSlice = createSlice({
    name: 'AnnouncementDeleteSlice',
    initialState: {
        isDeleteLoading: false,
        error: null,
        message: null,
        statusCode: null
    },
    reducers: {
        clearAnnouncementDeleteData: (state, action) => {
            state.isDeleteLoading = false;
            state.message = null;
            state.statusCode = null;
        },
    },

    extraReducers: builder => {
        builder
            .addCase(DeleteAnnouncementApi.pending, state => {
                state.isDeleteLoading = true;
                state.statusCode = null;
            })
            .addCase(
                DeleteAnnouncementApi.fulfilled,
                (state, action) => {
                    state.isDeleteLoading = false;
                    console.log("fulfilled")
                    console.log(action.payload.data);

                    state.items = action.payload.data;
                    state.message = action.payload.message;
                    state.statusCode = action.payload.statusCode
                },
            )
            .addCase(
                DeleteAnnouncementApi.rejected,
                (state, action) => {
                    console.log("rejected")
                    console.log(action.error)
                    console.log(action.payload)
                    state.isDeleteLoading = false;
                    state.error = action.error.message;
                    state.message = null;
                    state.statusCode = action.error.message
                },
            );
    },
});

export const AnnouncementDeleteActions = AnnouncementDeleteSlice.actions;
export default AnnouncementDeleteSlice;
