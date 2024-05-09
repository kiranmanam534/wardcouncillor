import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from './api';
import axios from 'axios';

export const loginApi = createAsyncThunk('api/auth/login', async data => {
  console.log('login.................', AxiosInstance.getUri());
  try {
    const response = await AxiosInstance.post('api/auth/login', data);
    return response.data;
  } catch (error) {
    console.log('Error:', error.response.data);
    throw error.response.data;
  }
});

export const wardMemberInfo = createAsyncThunk(
  'api/wardMemberInfo',
  async () => {
    const response = await axios.get(
      'http://196.41.72.201:8080/api/mobileapp/v1.0.0/ekurhuleni/GetCouncillors',
    );

    // console.log(response.data);
    if (response.status === 200) {
      console.log('wardMemberInfo');

      return response.data;
    } else {
      console.log('error');
      return response;
    }
  },
);
