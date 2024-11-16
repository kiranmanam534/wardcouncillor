import {AxiosInstance} from './api';

export const getIndegentConsumptionsByWardNo = async (wardNo, search) => {
  return await AxiosInstance.get(
    `/api/Indigent/get-indigent-consumption-data?wardNo=${wardNo}&page=1&limit=1000&search=${search}`,
  );
};
