import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const smsApi = createAsyncThunk('api/sms', async params => {
  // Define your request body data
  const { requestBody } = params;
  console.log(requestBody)

  // console.log(JSON.stringify(requestBody));
  const url = 'http://129.232.208.13/GrapeVine/api/sms/send'; // 'http://129.232.208.13/InfobipAPI/api/sms/send'
  const response = await axios(
    url,
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
