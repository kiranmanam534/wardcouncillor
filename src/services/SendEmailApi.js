import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosInstance} from './api';
import {useDispatch} from 'react-redux';

const dispatch = useDispatch();

export const SendEmailApi = createAsyncThunk(
  'api/SendEmailApi',
  async queryParams => {
    // Accept query parameters
    try {
      const response = await AxiosInstance.post(
        'api/Notification/send-email-notification',
        {}, // POST body (empty if not needed)
        {
          params: queryParams, // Query string parameters
        },
      );
      return response.data;
    } catch (error) {
      console.log('Error:', error.response?.data);
      return error.response?.data;
    }
  },
);
