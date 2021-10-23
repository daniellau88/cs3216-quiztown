import { AnyAction, Middleware, Reducer, Store, applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import { AppState } from '../types/store';

import authReducer from './auth/reducers';
import cardsReducer from './cards/reducers';
import collectionsReducer from './collections/reducers';
import notificationsReducer from './notifications/reducers';
import publicActivitiesReducer from './publicActivities/reducers';
import quizReducer from './quiz/reducers';

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
    auth: authReducer,
    collections: collectionsReducer,
    cards: cardsReducer,
    notifications: notificationsReducer,
    publicActivities: publicActivitiesReducer,
    quiz: quizReducer,
});

const middlewares: Middleware[] = [thunk];

const enhancer = applyMiddleware(...middlewares);

export default function configureStore(): Store<AppState, AnyAction> {
    const persistConfig = {
        key: 'root',
        whitelist: ['auth', 'quiz'], // For now only cache auth & quiz
        storage,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    return createStore(
        persistedReducer,
        process.env.NODE_ENV === 'development'
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            ? require('redux-devtools-extension').composeWithDevTools(enhancer)
            : enhancer,
    );
}
