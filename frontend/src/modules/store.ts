import { AnyAction, applyMiddleware, combineReducers, createStore, Middleware, Reducer, Store } from 'redux';
import thunk from 'redux-thunk';

import { AppState } from '../types/store';
import collectionsReducer from './collections/reducers';

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
    collections: collectionsReducer,
});

const middlewares: Middleware[] = [thunk];

const enhancer = applyMiddleware(...middlewares);

export default function configureStore(): Store<AppState, AnyAction> {
    return createStore(
        rootReducer,
        process.env.NODE_ENV === 'development'
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            ? require('redux-devtools-extension').composeWithDevTools(enhancer)
            : enhancer,
    );
}
