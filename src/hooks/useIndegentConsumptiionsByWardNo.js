import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actGetIndegentConsumptionsApi from '../redux/indegent/actions/actIndegentConsumption';

const useIndegentConsumptiionsByWardNo = warD_NO => {
  const dispatch = useDispatch();
  const {indegentConsumptions, loading, error} = useSelector(
    state => state.indegentConsumptions,
  );

  useEffect(() => {
    console.log('getIndegentConsumptionsByWardNo', warD_NO);
    const promise = dispatch(actGetIndegentConsumptionsApi(warD_NO));
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  return {loading, error, indegentConsumptions};
};

export default useIndegentConsumptiionsByWardNo;
