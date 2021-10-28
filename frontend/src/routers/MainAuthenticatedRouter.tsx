import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import CollectionsCardAddImagePage from '../modules/cards/pages/CollectionsCardAddImagePage';
import CollectionsCardAddPage from '../modules/cards/pages/CollectionsCardAddPage';
import CollectionsCardAddTextPage from '../modules/cards/pages/CollectionsCardAddTextPage';
import CollectionsCardEditPage from '../modules/cards/pages/CollectionsCardEditPage';
import CollectionsCardPage from '../modules/cards/pages/CollectionsCardPage';
import CollectionsCardShowPage from '../modules/cards/pages/CollectionsCardShowPage';
import CollectionsCardStarredPage from '../modules/cards/pages/CollectionsCardStarredPage';
import CollectionAddPage from '../modules/collections/pages/CollectionAddPage';
import CollectionDiscoverPage from '../modules/collections/pages/CollectionDiscoverPage';
import CollectionPage from '../modules/collections/pages/CollectionPage';
import CollectionImportReviewPage from '../modules/imports/pages/CollectionImportReviewPage';
import QuizPage from '../modules/quiz/pages/QuizPage';
import HomePage from '../pages/HomePage';
import InfoPage from '../pages/InfoPage';
import TemplatePage from '../pages/utilities/TemplatePage';
import routes from '../utilities/routes';

import RouteBounded from './RouteBounded';

const MainAuthenticatedRouter = (): JSX.Element => {
    return (
        <>
            <Switch>
                <RouteBounded exact path={'/'} component={HomePage} />
                <RouteBounded exact path={routes.INFO} component={InfoPage} />
                <RouteBounded exact path={routes.COLLECTIONS.INDEX} component={CollectionPage} />
                <RouteBounded exact path={routes.COLLECTIONS.NEW} component={CollectionAddPage} />
                <RouteBounded exact path={routes.COLLECTIONS.DISCOVER} component={CollectionDiscoverPage} />
                <RouteBounded exact path={routes.COLLECTIONS.SHOW} component={CollectionsCardPage} />
                <RouteBounded exact path={routes.COLLECTIONS.IMPORT.SHOW} component={CollectionImportReviewPage} />
                <RouteBounded exact path={routes.COLLECTIONS.CARD.NEWTEXT} component={CollectionsCardAddTextPage} />
                <RouteBounded exact path={routes.COLLECTIONS.CARD.NEWIMAGE} component={CollectionsCardAddImagePage} />
                <RouteBounded exact path={routes.COLLECTIONS.CARD.NEW} component={CollectionsCardAddPage} />
                <RouteBounded exact path={routes.COLLECTIONS.CARD.SHOW} component={CollectionsCardShowPage} />
                <RouteBounded exact path={routes.CARDS.SHOW_STARRED} component={CollectionsCardStarredPage} />
                <RouteBounded exact path={routes.COLLECTIONS.CARD.EDIT} component={CollectionsCardEditPage} />
                <RouteBounded exact path={routes.QUIZ} component={QuizPage} />
                <RouteBounded exact path={routes.TEST} component={TemplatePage} />
                <Route render={() => <Redirect to={routes.ROOT} />} />
            </Switch>
        </>
    );
};

export default MainAuthenticatedRouter;
