import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import TemplatePage from '../pages/utilities/TemplatePage';
import routes from '../utilities/routes';

const MainRouter = (): JSX.Element => {
    return (
        <>
            <Switch>
                <Route exact path={routes.ROOT} component={TemplatePage} />
            </Switch>
        </>
    );
};

export default MainRouter;
