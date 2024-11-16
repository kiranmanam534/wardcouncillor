import {createAsyncThunk} from '@reduxjs/toolkit';
import {getIndegentConsumptionsByWardNo} from '../../../services/indegentApi';
import isAxiosErrorHandler from '../../../utility/isAxiosErrorHandler';

const actGetIndegentConsumptionsApi = createAsyncThunk(
  'get/getIndegentConsumptionsByWardNo',
  async (formData, thunkAPI) => {
    const {rejectWithValue, signal} = thunkAPI;
    const {wardNo, search} = formData;
    console.log('wardNo', wardNo, search);

    try {
      const response = await getIndegentConsumptionsByWardNo(wardNo, search);
      // console.log('get/getIndegentConsumptionsByWardNo', response);
      return response.data;
    } catch (error) {
      console.log(JSON.stringify(error));
      return rejectWithValue(isAxiosErrorHandler(error));
    }
  },
);

export default actGetIndegentConsumptionsApi;
