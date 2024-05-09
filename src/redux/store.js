import {configureStore} from '@reduxjs/toolkit';
import councillorWardDashboardSlice from './councillorWardDashboardSlice';
import loginSlice from './loginSlice';
import councillorWardsSlice from './councillorWardsSlice';
import councillorWardTownshipSlice from './councillorWardTownshipSlice';
import councillorWardTownshipMemberSlice from './councillorWardTownshipMemberSlice';
import wardMemberSlice from './wardMemberSlice';
import smsSlice from './smsSlice';
import communityMemberRegisterSlice from './communityMemberRegisterSlice';
import createHotspotSlice from './createHotspotSlice';
import createRoadClosureSlice from './createRoadClosureSlice';
import createMeetingsSlice from './createMeetingsSlice';
import CategoriesSlice from './CategoriesSlice';
import createWorkshopSlice from './createWorkshopSlice';
import createMissingPersonSlice from './createMissingPersonSlice';
import createWarningsSlice from './createWarningsSlice';
import createHealthCareSlice from './createHealthCareSlice';
import councillorAllWardsSlice from './councillorAllWardsSlice';
import MayorSelectedWardSlice from './MayorSelectedWardSlice';
import MeterImageSlice from './MeterImageSlice';

const store = configureStore({
  reducer: {
    WardDashboardReducer: councillorWardDashboardSlice.reducer,
    WardOustandingReducer: councillorWardsSlice.reducer,
    councillorWardTownshipReducer: councillorWardTownshipSlice.reducer,
    councillorWardTownshipMemberReducer:
      councillorWardTownshipMemberSlice.reducer,
    loginReducer: loginSlice.reducer,
    wardMemberReducer: wardMemberSlice.reducer,
    smsReducer: smsSlice.reducer,
    communityMemberRegisterReducer:communityMemberRegisterSlice.reducer,
    createHotspotReducer:createHotspotSlice.reducer,
    createRoadClosureReducer:createRoadClosureSlice.reducer,
    createMeetingReducer:createMeetingsSlice.reducer,
    createWorkhopReducer:createWorkshopSlice.reducer,
    createMissingPersonReducer:createMissingPersonSlice.reducer,
    createWarningsReducer:createWarningsSlice.reducer,
    createHealthCareReducer:createHealthCareSlice.reducer,
    CategoriesReducer:CategoriesSlice.reducer,
    CouncillorAllWardsReducer:councillorAllWardsSlice.reducer,
    MayorSelectedWardReducer:MayorSelectedWardSlice.reducer,
    MeterImageReducer:MeterImageSlice.reducer

  },
  middleware: getDefaultMiddleware => {
    // Disable serializable state invariant middleware
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export default store;
