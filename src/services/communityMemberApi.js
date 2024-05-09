import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosInstance} from './api';

export const CommunityMemberRegisterApi = createAsyncThunk(
  'api/CommunityMemberRegisterApi',
  async formData => {
    console.log('api/CommunityMemberRegisterApi', formData);
    try {
      const response = await AxiosInstance.post(
        `/api/Create/save-community-member-registration`,
        formData,
      );

      console.log('response', response.status);

      return response.data;
    } catch (error) {
      //   console.error('Error:', error.response.data);
      return error.response.data;
      // Handle error here
      //   Alert.alert(
      //     'Error',
      //     'An error occurred while submitting the form. Please try again.',
      //   );
    }
  },
);
