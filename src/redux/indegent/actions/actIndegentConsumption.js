import {createAsyncThunk} from '@reduxjs/toolkit';
import {getIndegentConsumptionsByWardNo} from '../../../services/indegentApi';
import isAxiosErrorHandler from '../../../utility/isAxiosErrorHandler';

const actGetIndegentConsumptionsApi = createAsyncThunk(
  'get/getIndegentConsumptionsByWardNo',
  async (formData, thunkAPI) => {
    const {rejectWithValue, signal} = thunkAPI;
    const {wardNo, search, type} = formData;
    console.log('wardNo', wardNo, search, type);

    try {
      const response = await getIndegentConsumptionsByWardNo(
        wardNo,
        search,
        type,
      );
      // console.log('get/getIndegentConsumptionsByWardNo', response);
      return response.data;
    } catch (error) {
      console.log(JSON.stringify(error));
      return rejectWithValue(isAxiosErrorHandler(error));
    }
  },
);

export default actGetIndegentConsumptionsApi;
