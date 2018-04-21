import { combineReducers } from 'redux';
import homeReducer from './home';
import loginReducer from './login';
import orgReducer from './org';
import searchReducer from './search';
const rootReducer = combineReducers({
  home: homeReducer,
  login:loginReducer,
  org:orgReducer,
  search:searchReducer
});

export default rootReducer;
