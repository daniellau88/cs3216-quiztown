import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import CollectionsCardAddPage from '../modules/cards/pages/CollectionsCardAddPage';
import CollectionsCardPage from '../modules/cards/pages/CollectionsCardPage';
import CollectionsCardShowPage from '../modules/cards/pages/CollectionsCardShowPage';
import CollectionPage from '../modules/collections/pages/CollectionPage';
import TemplatePage from '../pages/utilities/TemplatePage';
import routes from '../utilities/routes';

const MainRouter = (): JSX.Element => {
    return (
        <>
            <Switch>
                <Redirect exact from={'/'} to={routes.COLLECTIONS.INDEX} />
                <Route exact path={routes.COLLECTIONS.INDEX} component={CollectionPage} />
                <Route exact path={routes.COLLECTIONS.SHOW} component={CollectionsCardPage} />
                <Route exact path={routes.COLLECTIONS.CARD.NEW} component={CollectionsCardAddPage} />
                <Route exact path={routes.COLLECTIONS.CARD.SHOW} component={CollectionsCardShowPage} />
                <Route exact path={routes.TEST} component={TemplatePage} />
            </Switch>
        </>
    );
};

export default MainRouter;
