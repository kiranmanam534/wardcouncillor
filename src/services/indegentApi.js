import {AxiosInstance} from './api';

export const getIndegentConsumptionsByWardNo = async wardNo => {
  return await AxiosInstance.get(
    `/api/Indigent/get-indigent-consumption-data?wardNo=${wardNo}&page=1&limit=10&search=`,
  );
};
