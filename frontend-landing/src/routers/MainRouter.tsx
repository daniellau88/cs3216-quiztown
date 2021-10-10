import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import routes from '../utilities/routes';

const MainRouter = (): JSX.Element => {
    return (
        <>
            <Switch>
                <Route exact path={routes.ROOT} component={LandingPage} />
            </Switch>
        </>
    );
};

export default MainRouter;
