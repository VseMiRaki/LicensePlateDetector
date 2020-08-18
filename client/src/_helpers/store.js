import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../_reducers';

const loggerMiddleware = createLogger();
const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });

export const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            loggerMiddleware,
            thunk
        ))
);