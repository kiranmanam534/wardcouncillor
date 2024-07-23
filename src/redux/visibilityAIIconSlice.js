// src/features/visibility/visibilitySlice.js
import { createSlice } from '@reduxjs/toolkit';

const visibilityAIIconSlice = createSlice({
  name: 'visibility',
  initialState: {
    isVisible: true,
  },
  reducers: {
    showData: (state) => {
      state.isVisible = true;
    },
    hideData: (state) => {
      state.isVisible = false;
    },
  },
});

export const { showData, hideData } = visibilityAIIconSlice.actions;

export default visibilityAIIconSlice;
