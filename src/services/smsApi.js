import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const smsApi = createAsyncThunk('api/sms', async params => {
  // Define your request body data
  const { requestBody } = params;
  console.log(requestBody)

  // console.log(JSON.stringify(requestBody));
  const response = await axios(
    'http://129.232.208.13/InfobipAPI/api/sms/send',
    {
      method: 'POST',
      data: requestBody,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.status === 200) {
    return response.data;
  } else {
    console.log('error');
    return response;
  }
});
