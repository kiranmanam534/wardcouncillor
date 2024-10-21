import {createAsyncThunk} from '@reduxjs/toolkit';
import {getIndegentConsumptionsByWardNo} from '../../../services/indegentApi';
import isAxiosErrorHandler from '../../../utility/isAxiosErrorHandler';

const actGetIndegentConsumptionsApi = createAsyncThunk(
  'get/getIndegentConsumptionsByWardNo',
  async (wardNo, thunkAPI) => {
    const {rejectWithValue, signal} = thunkAPI;
    console.log('wardNo', wardNo);

    try {
      const response = await getIndegentConsumptionsByWardNo(wardNo);
      // console.log('get/getIndegentConsumptionsByWardNo', response);
      return response.data;
    } catch (error) {
      console.log(JSON.stringify(error));
      return rejectWithValue(isAxiosErrorHandler(error));
    }
  },
);

export default actGetIndegentConsumptionsApi;
