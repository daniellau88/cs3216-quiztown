import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import CollectionsCardAddImagePage from '../modules/cards/pages/CollectionsCardAddImagePage';
import CollectionsCardAddPage from '../modules/cards/pages/CollectionsCardAddPage';
import CollectionsCardAddTextPage from '../modules/cards/pages/CollectionsCardAddTextPage';
import CollectionsCardPage from '../modules/cards/pages/CollectionsCardPage';
import CollectionsCardShowPage from '../modules/cards/pages/CollectionsCardShowPage';
import CollectionDiscoverPage from '../modules/collections/pages/CollectionDiscoverPage';
import HomePage from '../pages/HomePage';
import InfoPage from '../pages/InfoPage';
import routes from '../utilities/routes';

const MainGeneralRouter = (): JSX.Element => {
    return (
        <>
            <Switch>
                <Route exact path={'/'} component={HomePage} />
                <Route exact path={routes.INFO} component={InfoPage} />
                <Route exact path={routes.COLLECTIONS.DISCOVER} component={CollectionDiscoverPage} />
                <Route exact path={routes.COLLECTIONS.SHOW} component={CollectionsCardPage} />
                <Route exact path={routes.COLLECTIONS.CARD.NEWTEXT} component={CollectionsCardAddTextPage} />
                <Route exact path={routes.COLLECTIONS.CARD.NEWIMAGE} component={CollectionsCardAddImagePage} />
                <Route exact path={routes.COLLECTIONS.CARD.NEW} component={CollectionsCardAddPage} />
                <Route exact path={routes.COLLECTIONS.CARD.SHOW} component={CollectionsCardShowPage} />
            </Switch>
        </>
    );
};

export default MainGeneralRouter;
