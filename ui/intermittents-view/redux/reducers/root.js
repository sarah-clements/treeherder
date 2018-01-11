import { combineReducers } from 'redux';
import { fetchData, updateDates } from './table';

const rootReducer = combineReducers({
  bugsData: fetchData('BUGS_DATA'),
  bugDetailsData: fetchData('BUG_DETAILS_DATA'),
  dates: updateDates,
  // bugDetailsDates: updateDates
});

export default rootReducer;
