import { ThemeProvider, createTheme } from '@material-ui/core';
import { createBrowserHistory } from 'history';
import { SnackbarProvider } from 'notistack';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { pdfjs } from 'react-pdf';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';

import AppLayout from './layouts/AppLayout';
import AuthGateway from './modules/auth/components/AuthGateway';
import Notifier from './modules/notifications/components/Notifier';
import configureStore from './modules/store';
import MainRouter from './routers/MainRouter';
import palette from './utilities/palette';
import './assets/css/fonts.css';


// ref: https://stackoverflow.com/a/48378498
const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;

// eslint-disable-next-line import/namespace
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const history = createBrowserHistory({
    basename: `${process.env.PUBLIC_URL}`,
});

if (GOOGLE_ANALYTICS_ID) {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID);
    history.listen((location) => {
        ReactGA.pageview(location.pathname + location.search);
    });
}

const store = configureStore();
const persistor = persistStore(store);

const theme = createTheme({
    palette,
    typography: {
        htmlFontSize: 16,
        fontFamily: 'Lato',
    },
});

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <SnackbarProvider>
                            <AuthGateway>
                                <AppLayout>
                                    <Notifier />
                                    <MainRouter />
                                </AppLayout>
                            </AuthGateway>
                        </SnackbarProvider>
                    </ThemeProvider>
                </Router>
            </PersistGate>
        </Provider>
    );
};

export default App;
