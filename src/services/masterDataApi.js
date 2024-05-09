
import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosInstance} from './api';

export const getCategoriesApi = createAsyncThunk(
    'api/getCategoriesApi',
    async (category) => {
        console.log(`api/Master/GetCategoryData?Category=${category}`);
        try {
            const response = await AxiosInstance.post(
                `api/Master/GetCategoryData?Category=${category}`
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
