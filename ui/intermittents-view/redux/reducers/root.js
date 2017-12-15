import { combineReducers } from 'redux';
import bugsData from './table';

const rootReducer = combineReducers({
  bugs: bugsData
});

export default rootReducer;
