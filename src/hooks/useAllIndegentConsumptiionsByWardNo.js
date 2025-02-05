import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actIndegentMapConsumption from '../redux/indegent/actions/actIndegentMapConsumption';

const useAllIndegentConsumptiionsByWardNo = (
  warD_NO,
  searchText,
  type,
  startConsumption,
  endConsumption,
) => {
  const dispatch = useDispatch();
  const {allIndegentConsumptions, loading, error} = useSelector(
    state => state.AllIndegentConsumptions,
  );

  useEffect(() => {
    console.log('AllIndegentConsumptions', warD_NO, type, searchText);
    if (type !== 'All') {
      return;
    }
    dispatch(
      actIndegentMapConsumption({
        wardNo: warD_NO,
        search: searchText,
        type: type,
        startConsumption,
        endConsumption,
      }),
    );
  }, [dispatch]);

  const getIndegentConsumptions = (
    warD_NO,
    searchText,
    type,
    startConsumption,
    endConsumption,
  ) => {
    console.log(
      'getIndegentConsumptions',
      warD_NO,
      searchText,
      type,
      startConsumption,
      endConsumption,
    );
    return dispatch(
      actIndegentMapConsumption({
        wardNo: warD_NO,
        search: searchText,
        type: type,
        startConsumption,
        endConsumption,
      }),
    );
  };

  const LoadIndegentConsumptions = useCallback(
    async credentials => {
      console.log('credentials', credentials);
      getIndegentConsumptions(
        credentials.warD_NO,
        credentials.searchText,
        credentials.type,
        credentials.startConsumption,
        credentials.endConsumption,
      );
    },
    [dispatch],
  );

  return {loading, error, allIndegentConsumptions, LoadIndegentConsumptions};
};

export default useAllIndegentConsumptiionsByWardNo;
