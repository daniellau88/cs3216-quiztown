import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AddCollectionModal from '../modules/collections/pages/AddCollectionModal';
import CollectionPage from '../modules/collections/pages/CollectionPage';
import TemplatePage from '../pages/utilities/TemplatePage';
import routes from '../utilities/routes';

const MainRouter = (): JSX.Element => {
    return (
        <>
            <Switch>
                <Redirect exact from={'/'} to={routes.COLLECTIONS.INDEX} />
                <Route exact path={routes.COLLECTIONS.INDEX} component={CollectionPage} />
                <Route exact path={routes.COLLECTIONS.NEW} component={AddCollectionModal} />
                <Route exact path={routes.TEST} component={TemplatePage} />
            </Switch>
        </>
    );
};

export default MainRouter;
