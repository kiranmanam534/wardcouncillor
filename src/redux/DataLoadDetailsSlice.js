import { createSlice } from '@reduxjs/toolkit';
import { GetDataLoadDetailsApi } from '../services/councillorWardApi';

const DataLoadDetailsSlice = createSlice({
    name: 'DataLoadDetailsSlice',
    initialState: {
        items: null,
        isLoading: false,
        error: null,
        isDataLoaded:false
    },
    reducers: {
        // login: (state, action) => {
        //   state.isLoggedIn = true;
        //   state.items = action.payload;
        // },
        // getUserName: (state, action) => {
        //   state.loggedUserName = action.payload;
        // },
        // logout: state => {
        //   state.isLoggedIn = false;
        //   state.items = null;
        //   state.error=null
        // },
    },

    extraReducers: builder => {
        builder
            .addCase(GetDataLoadDetailsApi.pending, state => {
                state.isLoading = true;
                state.items = null;
                state.error = null;
                state.isDataLoaded=false;

            })
            .addCase(GetDataLoadDetailsApi.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log(state.items)
                state.items =action.payload.data;
                // state.items =[{"name": "loading", "value": "05/10/2024 17:11:25"}];
                state.error = null
                state.isDataLoaded=true;
            })
            .addCase(GetDataLoadDetailsApi.rejected, (state, action) => {
                state.isLoading = false;
                console.log('rejected');
                console.log(action.error)
                state.error = action.error?.message;
                state.items = null;
                state.isDataLoaded=false;
            });
    },
});

export const DataLoadDetailsActions = DataLoadDetailsSlice.actions;

export default DataLoadDetailsSlice;
