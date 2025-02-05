import {createAsyncThunk} from '@reduxjs/toolkit';
import {getIndegentConsumptionsByWardNo} from '../../../services/indegentApi';
import isAxiosErrorHandler from '../../../utility/isAxiosErrorHandler';

const actIndegentMapConsumption = createAsyncThunk(
  'get/getIndegentMapConsumption sByWardNo',
  async (formData, thunkAPI) => {
    const {rejectWithValue, signal} = thunkAPI;
    const {wardNo, search, type, startConsumption, endConsumption} = formData;
    console.log(
      'get/getIndegentMapConsumption ByWardNo',
      wardNo,
      search,
      type,
      startConsumption,
      endConsumption,
    );

    try {
      const response = await getIndegentConsumptionsByWardNo(
        wardNo,
        search,
        type,
        startConsumption,
        endConsumption,
      );
      // console.log('get/getIndegentConsumptionsByWardNo', response);
      return response.data;
    } catch (error) {
      // console.log(JSON.stringify(error));
      return rejectWithValue(isAxiosErrorHandler(error));
    }
  },
);

export default actIndegentMapConsumption;
