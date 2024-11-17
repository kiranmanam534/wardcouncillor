import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actGetIndegentConsumptionsApi from '../redux/indegent/actions/actIndegentConsumption';

const useIndegentConsumptiionsByWardNo = (warD_NO, searchText, type) => {
  const dispatch = useDispatch();
  const {indegentConsumptions, loading, error} = useSelector(
    state => state.indegentConsumptions,
  );

  const getIndegentConsumptions = (warD_NO, searchText, type) => {
    console.log('getIndegentConsumptions', warD_NO, searchText, type);
    return dispatch(
      actGetIndegentConsumptionsApi({
        wardNo: warD_NO,
        search: searchText,
        type: type,
      }),
    );
  };

  useEffect(() => {
    console.log('getIndegentConsumptionsByWardNo', warD_NO, searchText, type);
    // const promise =
    getIndegentConsumptions(warD_NO, searchText, type);
    // return () => {
    //   promise.abort();
    // };
  }, []);

  const LoadIndegentConsumptions = useCallback(
    async credentials => {
      console.log('credentials', credentials);
      getIndegentConsumptions(
        credentials.warD_NO,
        credentials.searchText,
        credentials.type,
      );
    },
    [dispatch],
  );

  return {loading, error, indegentConsumptions, LoadIndegentConsumptions};
};

export default useIndegentConsumptiionsByWardNo;
