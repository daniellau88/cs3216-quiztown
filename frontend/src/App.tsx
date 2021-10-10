import { ThemeProvider, createTheme } from '@material-ui/core';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import configureStore from './modules/store';
import MainRouter from './routers/MainRouter';
import palette from './utilities/palette';
import './assets/css/fonts.css';

const history = createBrowserHistory();
const store = configureStore();

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
            <Router history={history}>
                <ThemeProvider theme={theme}>
                    <AppLayout>
                        <Route path="" render={MainRouter}></Route>
                    </AppLayout>
                </ThemeProvider>
            </Router>
        </Provider>
    );
};

export default App;
