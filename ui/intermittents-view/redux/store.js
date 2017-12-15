import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import rootReducer from './reducers/root';
import bugsData from './reducers/table';

const store = createStore(bugsData, applyMiddleware(thunk));

export default store;
