import {AxiosInstance} from './api';

export const getIndegentConsumptionsByWardNo = async (
  wardNo,
  search,
  type,
  startConsumption,
  endConsumption,
) => {
  console.log(
    'getIndegentConsumptionsBy=====>',
    wardNo,
    search,
    type,
    startConsumption,
    endConsumption,
  );
  let url = `/api/Indigent/get-indigent-consumption-data?wardNo=${wardNo}&StartConsumption=${startConsumption}&EndConsumption=${endConsumption}&page=1&limit=1000&search=${search}`;
  if (type === 'All') {
    url = `/api/Indigent/get-all-approved-indigent-consumption-data?wardNo=${wardNo}&StartConsumption=${startConsumption}&EndConsumption=${endConsumption}&search=${search}`;
  }
  console.log(url);
  return await AxiosInstance.get(url);
};
