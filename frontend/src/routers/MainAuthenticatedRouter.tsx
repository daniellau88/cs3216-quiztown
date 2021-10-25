import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

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

const MainAuthenticatedRouter = (): JSX.Element => {
    return (
        <>
            <Switch>
                <Route exact path={'/'} component={HomePage} />
                <Route exact path={routes.INFO} component={InfoPage} />
                <Route exact path={routes.COLLECTIONS.INDEX} component={CollectionPage} />
                <Route exact path={routes.COLLECTIONS.NEW} component={CollectionAddPage} />
                <Route exact path={routes.COLLECTIONS.DISCOVER} component={CollectionDiscoverPage} />
                <Route exact path={routes.COLLECTIONS.SHOW} component={CollectionsCardPage} />
                <Route exact path={routes.COLLECTIONS.IMPORT.SHOW} component={CollectionImportReviewPage} />
                <Route exact path={routes.COLLECTIONS.CARD.NEWTEXT} component={CollectionsCardAddTextPage} />
                <Route exact path={routes.COLLECTIONS.CARD.NEWIMAGE} component={CollectionsCardAddImagePage} />
                <Route exact path={routes.COLLECTIONS.CARD.NEW} component={CollectionsCardAddPage} />
                <Route exact path={routes.COLLECTIONS.CARD.SHOW} component={CollectionsCardShowPage} />
                <Route exact path={routes.CARDS.SHOW_STARRED} component={CollectionsCardStarredPage} />
                <Route exact path={routes.COLLECTIONS.CARD.EDIT} component={CollectionsCardEditPage} />
                <Route exact path={routes.QUIZ} component={QuizPage} />
                <Route exact path={routes.TEST} component={TemplatePage} />
            </Switch>
        </>
    );
};

export default MainAuthenticatedRouter;
