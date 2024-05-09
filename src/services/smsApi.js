import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const smsApi = createAsyncThunk('api/sms', async params => {
  // Define your request body data
  const {item, msg} = params;
  console.log(item.cellphonenumber)
  console.log(msg)
  const requestBody = {
    recipientNumber: '0739007893',
    message: msg.toString(),
    campaign: 'Outstanding Amount',
  };

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
