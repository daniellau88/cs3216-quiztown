import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import AddCollectionModal from '../modules/collections/pages/AddCollectionModal';
import CollectionPage from '../modules/collections/pages/CollectionPage';
import TemplatePage from '../pages/utilities/TemplatePage';
import routes from '../utilities/routes';

const MainRouter = (): JSX.Element => {
    return (
        <>
            <Switch>
                <Route exact path={routes.ROOT} component={TemplatePage} />
                <Route exact path={routes.COLLECTIONS.INDEX} component={CollectionPage} />
                <Route exact path={routes.COLLECTIONS.NEW} component={AddCollectionModal} />
            </Switch>
        </>
    );
};

export default MainRouter;
