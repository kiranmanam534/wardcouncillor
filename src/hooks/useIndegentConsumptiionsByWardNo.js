import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actGetIndegentConsumptionsApi from '../redux/indegent/actions/actIndegentConsumption';

const useIndegentConsumptiionsByWardNo = (warD_NO, searchText) => {
  const dispatch = useDispatch();
  const {indegentConsumptions, loading, error} = useSelector(
    state => state.indegentConsumptions,
  );

  const getIndegentConsumptions = () => {
    return dispatch(
      actGetIndegentConsumptionsApi({wardNo: warD_NO, search: searchText}),
    );
  };

  useEffect(() => {
    console.log('getIndegentConsumptionsByWardNo', warD_NO, searchText);
    const promise = getIndegentConsumptions(warD_NO, searchText);
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const LoadIndegentConsumptions = useCallback(
    async credentials => {
      getIndegentConsumptions(credentials.warD_NO, credentials.searchText);
    },
    [dispatch],
  );

  return {loading, error, indegentConsumptions, LoadIndegentConsumptions};
};

export default useIndegentConsumptiionsByWardNo;
