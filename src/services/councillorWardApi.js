import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from './api';

export const getCouncillorWardDashboardApi = createAsyncThunk(
  'api/getCouncillorWardDashboard',
  async wardNo => {
    // console.log(wardNo);
    try {
      const response = await AxiosInstance.post(`api/CouncillorWard/${wardNo}`);
      return response.data;
    } catch (error) {
      console.log('Error:', error.response.data);
      return error.response.data;
    }
  },
);

export const GetCouncillorWardDetailsIfoByAllWardsApi = createAsyncThunk(
  'api/CouncillorWard/GetCouncillorWardDetailsIfoByAllWardsApi',
  async () => {
    try {
      const response = await AxiosInstance.post(
        'api/CouncillorWard/GetCouncillorWardDetailsIfoByAllWards',
      );
      return response.data;

    } catch (error) {
      console.log('Error:', error.response.data);
      return error.response.data;
    }
  },
);

export const GetCouncillorWardDetailsIfoByWardNo = createAsyncThunk(
  'api/GetCouncillorWardDetailsIfoByWardNo',
  async params => {
    const { wardNo, wardType } = params;
    console.log(wardNo, wardType);
    console.log( `api/CouncillorWard/GetCouncillorWardDetailsIfoByWardNo?WardNo=${wardNo}&type=${wardType}`)
    try {
      const response = await AxiosInstance.post(
        `api/CouncillorWard/GetCouncillorWardDetailsIfoByWardNo?WardNo=${wardNo}&type=${wardType}`,
      );
      return response.data;

    } catch (error) {
      console.log('Error:', error.response.data);
      return error.response.data;
    }
  },
);

export const GetCouncillorWardTownshipIfoByWardNo = createAsyncThunk(
  'api/CouncillorWard/GetCouncillorWardTownshipIfoByWardNo',
  async params => {
    const { wardNo, wardType, name, search } = params;
    console.log(wardNo, wardType, name, search);
    console.log(
      `api/CouncillorWard/GetCouncillorWardTownshipIfoByWardNo?WardNo=${wardNo}&type=${wardType}&name=${name}&search=${search}`,
    );
    try {
      const response = await AxiosInstance.post(
        `api/CouncillorWard/GetCouncillorWardTownshipIfoByWardNo?WardNo=${wardNo}&type=${wardType}&name=${name}&search=${search}`,
      );

      return response.data;
    } catch (error) {
      console.log('Error:', error.response.data);
      return error.response.data;
    }
  },
);

export const GetCouncillorWardTownshipMemberInfo = createAsyncThunk(
  'api/CouncillorWard/GetCouncillorWardTownshipMemberInfo',
  async params => {
    try {
      const { wardNo, wardType, name, search, township, page, limit } = params;
      console.log(wardNo, wardType, name, township, page, limit);
      const encodedName = encodeURIComponent(name);
      const encodedtownship = encodeURIComponent(township);
      let URL = '';
      if (wardType == 'Outstanding') {
        URL = `api/Outstanding/get-outstanding-township-members-data?wardNo=${wardNo}&outstandingsDays=${encodedName}&township=${encodedtownship}&search=${search}&page=${page}&limit=${limit}`;
      } else if (wardType == 'Interims') {
        URL = `api/Interims/get-interims-township-members-data?wardNo=${wardNo}&category=${encodedName}&township=${encodedtownship}&search=${search}&page=${page}&limit=${limit}`;
      } else if (wardType == 'IMS') {
        URL = `api/IMS/get-ims-township-members-data?wardNo=${wardNo}&department=${encodedName}&township=${encodedtownship}&search=${search}&page=${page}&limit=${limit}`;
      } else if (wardType == 'Meter') {
        URL = `api/Meters/get-meters-members-data?wardNo=${wardNo}&service=${encodedName}&township=${encodedtownship}&search=${search}&page=${page}&limit=${limit}`;
      } else if (wardType == 'Customer') {
        URL = `api/Customers/get-customer-category-members-data?wardNo=${wardNo}&category=${encodedName}&search=${search}&page=${page}&limit=${limit}`;
      } else if (wardType == 'Property') {
        URL = `api/Properties/get-property-category-members-data?wardNo=${wardNo}&category=${encodedName}&search=${search}&page=${page}&limit=${limit}`;
      } else if (wardType == 'MetersNotRead') {
        URL = `api/Meters/get-not-read-meters-members-data?wardNo=${wardNo}&service=${encodedName}&township=${encodedtownship}&search=${search}&page=${page}&limit=${limit}`;
      }
      console.log(URL);

      const response = await AxiosInstance.get(URL);

      return response.data;
    } catch (error) {
      console.log('Error:', error.response.data);
      return error.response.data;
    }
  },
);

export const CreateHotspotApi = createAsyncThunk(
  'api/CreateHotspotApi',
  async formData => {
    console.log('api/CreateHotspotApi', formData);
    try {
      const response = await AxiosInstance.post(
        `/api/Create/save-hotspot`,
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

export const CreateRoadClosureApi = createAsyncThunk(
  'api/CreateRoadClosureApi',
  async formData => {
    console.log('api/CreateRoadClosureApi', formData);
    try {
      const response = await AxiosInstance.post(
        `/api/Create/save-road-clouser`,
        formData,
      );

      console.log('response', response.status);

      return response.data;
    } catch (error) {
      console.log('Error:', error);
      console.log('Error1:', error.response.data);
      return error.response.data;
      // Handle error here
      //   Alert.alert(
      //     'Error',
      //     'An error occurred while submitting the form. Please try again.',
      //   );
    }
  },
);

export const CreateMeetingsApi = createAsyncThunk(
  'api/CreateMeetingsApi',
  async formData => {
    console.log('api/CreateMeetingsApi', formData);
    try {
      const response = await AxiosInstance.post(
        `/api/Create/save-meeting`,
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


export const CreateWorkshopApi = createAsyncThunk(
  'api/CreateWorkshopApi',
  async formData => {
    console.log('api/CreateWorkshopApi', formData);
    try {
      const response = await AxiosInstance.post(
        `/api/Create/save-workshop`,
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



export const CreateMissingPersonApi = createAsyncThunk(
  'api/CreateMissingPersonApi',
  async formData => {
    console.log('api/CreateMissingPersonApi', formData);
    try {
      const response = await AxiosInstance.post(
        `/api/Create/save-missing-person`,
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



export const CreateWarningsApi = createAsyncThunk(
  'api/CreateWarningsApi',
  async formData => {
    console.log('api/CreateWarningsApi', formData);
    try {
      const response = await AxiosInstance.post(
        `/api/Create/save-warning`,
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



export const CreateHealthCareApi = createAsyncThunk(
  'api/CreateHealthCareApi',
  async formData => {
    console.log('api/CreateHealthCareApi', formData);
    try {
      const response = await AxiosInstance.post(
        `/api/Create/save-healthcare`,
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





export const getMeterImageApi = createAsyncThunk(
  'api/getMeterImageApi',
  async (meterId, { rejectWithValue }) => {
    console.log(`api/Meters/get-meter-read-image?ID=${meterId}`);
    try {
      const response = await AxiosInstance.post(
        `api/Meters/get-meter-read-image?ID=${meterId}`
      );

      // console.log('response', response);

      return response.data;
    } catch (error) {
      // console.log('Error:', error);
      // console.log('Error:', error.response.data);
      throw error.response.status;
    }
  },
);