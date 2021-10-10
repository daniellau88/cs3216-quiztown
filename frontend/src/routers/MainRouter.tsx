import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AddCollectionPage from '../modules/collections/pages/CollectionAddPage';
import CollectionContentsPage from '../modules/collections/pages/CollectionContentsPage';
import CollectionPage from '../modules/collections/pages/CollectionPage';
import CollectionsCardAddPage from '../modules/collections/pages/CollectionsCardAddPage';
import CollectionsCardShowPage from '../modules/collections/pages/CollectionsCardShowPage';
import TemplatePage from '../pages/utilities/TemplatePage';
import routes from '../utilities/routes';

const MainRouter = (): JSX.Element => {
    return (
        <>
            <Switch>
                <Redirect exact from={'/'} to={routes.COLLECTIONS.INDEX} />
                <Route exact path={routes.COLLECTIONS.INDEX} component={CollectionPage} />
                <Route exact path={routes.COLLECTIONS.SHOW} component={CollectionContentsPage} />
                <Route exact path={routes.COLLECTIONS.NEW} component={AddCollectionPage} />
                <Route exact path={routes.COLLECTIONS.CARD.NEW} component={CollectionsCardAddPage} />
                <Route exact path={routes.COLLECTIONS.CARD.SHOW} component={CollectionsCardShowPage} />
                <Route exact path={routes.TEST} component={TemplatePage} />
            </Switch>
        </>
    );
};

export default MainRouter;
