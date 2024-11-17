import {AxiosInstance} from './api';

export const getIndegentConsumptionsByWardNo = async (wardNo, search, type) => {
  let url = `/api/Indigent/get-indigent-consumption-data?wardNo=${wardNo}&page=1&limit=1000&search=${search}`;
  if (type === 'All') {
    url = `/api/Indigent/get-all-approved-indigent-consumption-data?wardNo=${wardNo}`;
  }
  console.log(url);
  return await AxiosInstance.get(url);
};
