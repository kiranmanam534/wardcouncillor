import { createSlice } from '@reduxjs/toolkit';


const MayorSelectedWardSlice = createSlice({
    name: 'MayorSelectedWardSlice',
    initialState: {
        wardNo: null,
    },
    reducers: {
        selectedWardNo: (state, action) => {
            state.wardNo = action.payload;
        },
        clearSelectedWardNo: (state, action) => {
            state.wardNo = null;
        }
    },

});

export const MayorSelectedWardActions = MayorSelectedWardSlice.actions

export default MayorSelectedWardSlice;
