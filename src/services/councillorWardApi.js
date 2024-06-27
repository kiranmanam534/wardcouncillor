import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from './api';
import axios from 'axios';

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


export const GetCouncillorWardDetailsIfoByCategoryApi = createAsyncThunk(
  'api/CouncillorWard/GetCouncillorWardDetailsIfoByCategoryApi',
  async () => {
    try {
      const response = await AxiosInstance.post(
        'api/CouncillorWard/GetCouncillorWardDetailsIfoByAllCategories',
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
    let url = `api/CouncillorWard/GetCouncillorWardDetailsIfoByWardNo?WardNo=${wardNo}&type=${wardType}`;
    if (wardType == 'OutstandingCategory') {
      const encodedwardNo = encodeURIComponent(wardNo);
      url = `api/CouncillorWard/GetCouncillorWardDetailsIfoByCategory?Category=${encodedwardNo}&type=${wardType}&search=''`;
    }
    console.log(url)
    try {
      const response = await AxiosInstance.post(
        url
      );
      return response.data;

    } catch (error) {
      console.log('Error:', error.response.data);
      return error.response.data;
    }
  },
);


// export const GetCouncillorWardDetailsIfoByCategoryByName = createAsyncThunk(
//   'api/GetCouncillorWardDetailsIfoByCategoryByName',
//   async params => {
//     const { category, wardType } = params;
//     console.log(category, wardType);
//     console.log( `api/CouncillorWard/GetCouncillorWardDetailsIfoByCategoryByName?Category=${category}&type=${wardType}`)
//     try {
//       const response = await AxiosInstance.post(
//         `api/CouncillorWard/GetCouncillorWardDetailsIfoByCategoryByName?Category=${category}&type=${wardType}`,
//       );
//       return response.data;

//     } catch (error) {
//       console.log('Error:', error.response.data);
//       return error.response.data;
//     }
//   },
// );


export const GetCouncillorWardTownshipIfoByWardNo = createAsyncThunk(
  'api/CouncillorWard/GetCouncillorWardTownshipIfoByWardNo',
  async params => {
    const { wardNo, wardType, name, search } = params;
    console.log(wardNo, wardType, name, search);
    let url = `api/CouncillorWard/GetCouncillorWardTownshipIfoByWardNo?WardNo=${wardNo}&type=${wardType}&name=${name}&search=${search}`;
    if (wardType == 'OutstandingCategory') {
      const encodedwardNo = encodeURIComponent(wardNo);
      url = `api/CouncillorWard/GetCouncillorWardTownshipIfoByCategory?Category=${encodedwardNo}&type=${wardType}&name=${name}&search=${search}`;
    }
    console.log(url)

    try {
      const response = await AxiosInstance.post(
        url,
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
      else if (wardType == 'OutstandingCategory') {
        const encodedwardNo = encodeURIComponent(wardNo);
        URL = `api/Outstanding/get-outstanding-category-township-members-data?category=${encodedwardNo}&outstandingsDays=${encodedName}&township=${encodedtownship}&search=${search}&page=${page}&limit=${limit}`;
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
  async params => {
    // console.log('api/CreateHotspotApi', formData);
    const { data, type } = params;
    console.log(data, type)
    try {
      let URL = '/api/Create/save-hotspot1';
      if (type == 'edit') {
        URL = '/api/hotspot/update-hotspot-data';
      }
      const response = await AxiosInstance.post(
        URL,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );


      console.log('response', response.status);

      return response.data;
    } catch (error) {
      console.log('Error:', error);
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
  async params => {
    // console.log('api/CreateHotspotApi', formData);
    const { data, type } = params;
    console.log(data, type)
    try {
      let URL = '/api/Create/save-road-clouser';
      if (type == 'edit') {
        URL = '/api/RoadClosure/update-road-closure-data';
      }
      const response = await AxiosInstance.post(
        URL,
        data,
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
  async params => {
    // console.log('api/CreateHotspotApi', formData);
    const { data, type } = params;
    console.log(data, type)
    try {
      let URL = '/api/Create/save-meeting';
      if (type == 'edit') {
        URL = '/api/Meeting/update-meeting-data';
      }
      const response = await AxiosInstance.post(
        URL,
        data,
      );
      console.log('response', response.status);

      return response.data;
    } catch (error) {
      console.error('Error:', error);
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
  async params => {
    // console.log('api/CreateHotspotApi', formData);
    const { data, type } = params;
    console.log(data, type)
    try {
      let URL = '/api/Create/save-workshop';
      if (type == 'edit') {
        URL = '/api/Workshop/update-workshop-data';
      }
      const response = await AxiosInstance.post(
        URL,
        data,
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
  async params => {
    // console.log('api/CreateHotspotApi', formData);
    const { data, type } = params;
    console.log(data, type)
    try {
      let URL = '/api/Create/save-missing-person';
      if (type == 'edit') {
        URL = '/api/MissingPerson/update-missing-person-data';
      }
      const response = await AxiosInstance.post(
        URL,
        data,
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
  async params => {
    // console.log('api/CreateHotspotApi', formData);
    const { data, type } = params;
    console.log(data, type)
    try {
      let URL = '/api/Create/save-warning';
      if (type == 'edit') {
        URL = '/api/Warning/update-warning-data';
      }
      const response = await AxiosInstance.post(
        URL,
        data,
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
  async params => {
    // console.log('api/CreateHealthCareApi', formData);

    const { data, type } = params;
    console.log(data, type)
    try {
      let URL = '/api/Create/save-healthcare';
      if (type == 'edit') {
        URL = '/api/Healthcare/update-healthcare-data';
      }
      const response = await AxiosInstance.post(
        URL,
        data,
      );

      console.log('response', response.status);

      return response.data;
    } catch (error) {
      console.log('Error:', error.response.data);
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




export const GetDataLoadDetailsApi = createAsyncThunk(
  'api/GetDataLoadDetails',
  async (meterId, { rejectWithValue }) => {
    console.log(`api/CouncillorWard/GetDataLoadDetails`);
    try {
      const response = await AxiosInstance.post(
        `api/CouncillorWard/GetDataLoadDetails`
      );
      return response.data;
    } catch (error) {
      // console.log('Error:', error);
      // console.log('Error:', error.response.data);
      throw error.response.status;
    }
  },
);



export const GetCustomer360DataApi = createAsyncThunk(
  'api/GetCustomer360DataApi',
  async params => {
    const { wardNo, accountNo } = params;
    console.log(wardNo, accountNo);
    let url = `api/Customer360/get-customer360-data?wardNo=${wardNo}&accountNo=${accountNo}`;
    console.log(url)
    try {
      const response = await AxiosInstance.get(
        url
      );
      return response.data;

    } catch (error) {
      console.log('Error:', error.response.data);
      throw error.response.status;
    }
  },
);



export const GetPaymentHistoryApi = createAsyncThunk(
  'api/GetPaymentHistoryApi',
  async (accountNo) => {
    console.log("GetPaymentHistoryApi", accountNo);
    try {

      // Your username and password
      const username = 'Jaykay';
      const password = 'c8P@ssw0rd1';

      // Encode the credentials in base64
      const credentials = btoa(`${username}:${password}`);
      console.log(credentials)
      // https://siyakhokha.ekurhuleni.gov.za/api/mobile/getaccounthistorybyaccountnumber?accountNumber=1709038356

      let url = `https://siyakhokha.ekurhuleni.gov.za/api/mobile/getaccounthistorybyaccountnumber?accountNumber=${accountNo}`;
      console.log(url)
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Basic ${credentials}`,
        }
      });

      return response.data;

    } catch (error) {
      console.log('Error:', error);
      throw error.response.status;
    }
  },
);
