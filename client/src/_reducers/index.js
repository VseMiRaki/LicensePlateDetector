
import { combineReducers } from 'redux';
import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { userStatsReducer } from './user.reducer';
import { routerReducer } from 'react-router-redux';


const rootReducer = combineReducers({
  authentication,
  registration,
  users: users,
  alert,
  route: routerReducer,
  user_stats: userStatsReducer,
});

export default rootReducer;