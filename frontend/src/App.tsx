import * as React from 'react';
import { Router, Route } from 'react-router-dom';
import MainRouter from './routers/MainRouter';
import AppLayout from './layouts/AppLayout';
import { createBrowserHistory } from 'history';
import { createTheme, ThemeProvider } from '@material-ui/core';
import palette from './utilities/palette';

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
