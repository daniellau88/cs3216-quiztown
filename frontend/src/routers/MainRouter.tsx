import * as React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';

import { getIsAuthenticated } from '../modules/auth/selectors';

import MainAuthenticatedRouter from './MainAuthenticatedRouter';
import MainGeneralRouter from './MainGeneralRouter';

const MainRouter = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);

    const router = isAuthenticated ? MainAuthenticatedRouter : MainGeneralRouter;

    return (
        <Route path="" render={router}></Route>
    );
};

export default MainRouter;
