import * as React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import MainRouter from './routers/MainRouter';
import AppLayout from './layouts/AppLayout';
import { createBrowserHistory } from 'history';
import { createTheme, ThemeProvider } from '@material-ui/core';
import palette from './utilities/palette';
import configureStore from './modules/store';

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
