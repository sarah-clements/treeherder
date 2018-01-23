import { combineReducers } from 'redux';
import { fetchData, updateDates, updateTree } from './reducers';

const rootReducer = combineReducers({
  bugsData: fetchData('BUGS'),
  bugDetailsData: fetchData('BUG_DETAILS'),
  dates: updateDates('BUGS'),
  bugDetailsDates: updateDates('BUG_DETAILS'),
  mainTree: updateTree('BUGS'),
  bugDetailsTree: updateTree('BUG_DETAILS')
});

export default rootReducer;
