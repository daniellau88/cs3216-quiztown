import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import CollectionPage from '../modules/collections/pages/CollectionPage';
import TemplatePage from '../pages/utilities/TemplatePage';
import routes from '../utilities/routes';

const MainRouter = (): JSX.Element => {
    return (
        <>
            <Switch>
                <Route exact path={routes.ROOT} component={TemplatePage} />
                <Route exact path={routes.COLLECTIONS.INDEX} component={CollectionPage} />
            </Switch>
        </>
    );
};

export default MainRouter;
