import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actGetIndegentConsumptionsApi from '../redux/indegent/actions/actIndegentConsumption';

const useAllIndegentConsumptiionsByWardNo = (warD_NO, type) => {
  const dispatch = useDispatch();
  const {allIndegentConsumptions, loading, error} = useSelector(
    state => state.AllIndegentConsumptions,
  );

  useEffect(() => {
    console.log('AllIndegentConsumptions', warD_NO, type);
    if (type !== 'All') return;
    dispatch(
      actGetIndegentConsumptionsApi({
        wardNo: warD_NO,
        search: '',
        type: type,
      }),
    );
  }, [dispatch]);

  return {loading, error, allIndegentConsumptions};
};

export default useAllIndegentConsumptiionsByWardNo;
