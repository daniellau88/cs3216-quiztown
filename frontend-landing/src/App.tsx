import { ThemeProvider, createTheme } from '@material-ui/core';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import { Route, Router } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import MainRouter from './routers/MainRouter';
import palette from './utilities/palette';
import './assets/css/fonts.css';
import 'animate.css';

const history = createBrowserHistory();

const theme = createTheme({
    palette,
    typography: {
        htmlFontSize: 16,
        fontFamily: 'Lato',
    },
});

const App: React.FC = () => {
    return (
        <Router history={history}>
            <ThemeProvider theme={theme}>
                <AppLayout>
                    <Route path="" render={MainRouter}></Route>
                </AppLayout>
            </ThemeProvider>
        </Router>
    );
};

export default App;
