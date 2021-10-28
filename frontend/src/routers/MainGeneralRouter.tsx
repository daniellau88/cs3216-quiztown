import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import CollectionsCardAddImagePage from '../modules/cards/pages/CollectionsCardAddImagePage';
import CollectionsCardAddPage from '../modules/cards/pages/CollectionsCardAddPage';
import CollectionsCardAddTextPage from '../modules/cards/pages/CollectionsCardAddTextPage';
import CollectionsCardPage from '../modules/cards/pages/CollectionsCardPage';
import CollectionsCardShowPage from '../modules/cards/pages/CollectionsCardShowPage';
import CollectionDiscoverPage from '../modules/collections/pages/CollectionDiscoverPage';
import HomePage from '../pages/HomePage';
import InfoPage from '../pages/InfoPage';
import routes from '../utilities/routes';

import RouteBounded from './RouteBounded';

const MainGeneralRouter = (): JSX.Element => {
    return (
        <>
            <Switch>
                <RouteBounded exact path={'/'} component={HomePage} />
                <RouteBounded exact path={routes.INFO} component={InfoPage} />
                <RouteBounded exact path={routes.COLLECTIONS.DISCOVER} component={CollectionDiscoverPage} />
                <RouteBounded exact path={routes.COLLECTIONS.SHOW} component={CollectionsCardPage} />
                <RouteBounded exact path={routes.COLLECTIONS.CARD.NEWTEXT} component={CollectionsCardAddTextPage} />
                <RouteBounded exact path={routes.COLLECTIONS.CARD.NEWIMAGE} component={CollectionsCardAddImagePage} />
                <RouteBounded exact path={routes.COLLECTIONS.CARD.NEW} component={CollectionsCardAddPage} />
                <RouteBounded exact path={routes.COLLECTIONS.CARD.SHOW} component={CollectionsCardShowPage} />
                <Route render={() => <Redirect to={routes.ROOT} />} />
            </Switch>
        </>
    );
};

export default MainGeneralRouter;
