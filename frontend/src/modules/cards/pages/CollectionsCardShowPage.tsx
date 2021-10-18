import { Box, CssBaseline, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, generatePath, useHistory } from 'react-router-dom';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import Breadcrumbs from '../../../layouts/Breadcrumbs';
import { AppState } from '../../../types/store';
import { dateToISOFormat } from '../../../utilities/datetime';
import routes from '../../../utilities/routes';
import { handleApiRequest } from '../../../utilities/ui';
import { getCollectionMiniEntity } from '../../collections/selectors';
import CardImage from '../components/CardImage';
import { loadCard, updateCard } from '../operations';
import { getCardEntity } from '../selectors';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingBottom: '8vh',
    },
}));

type Props = RouteComponentProps;

const CollectionsCardShowPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const cardId: number = +(params as { cardId: string }).cardId;
    const collectionId: number = +(params as { collectionId: string }).collectionId;
    const collection = useSelector((state: AppState) => getCollectionMiniEntity(state, collectionId));
    const card = useSelector((state: AppState) => getCardEntity(state, cardId));

    const [isLoading, setIsLoading] = React.useState(true);

    const onUpdate = (cardId: number, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        handleApiRequest(dispatch, dispatch(loadCard(cardId))).finally(() => {
            setIsLoading(false);
        });
    };

    const onCardCompleted = (nextBoxNumber: number, nextDate: Date) => {
        handleApiRequest(dispatch, dispatch(updateCard(cardId, {
            box_number: nextBoxNumber,
            next_date: dateToISOFormat(nextDate),
        }))).finally(() => {
            setIsLoading(false);
        });
        history.push(`/collections/${collectionId}`);
    };

    React.useEffect(() => {
        onUpdate(cardId, dispatch);
    }, [dispatch, collectionId, cardId]);

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Breadcrumbs links={[
                        { path: routes.COLLECTIONS.INDEX, name: 'Collections' },
                        { path: generatePath(routes.COLLECTIONS.SHOW, { collectionId: collectionId }), name: collection ? collection.name : 'Untitled collection' },
                        { path: null, name: card ? card.name : 'Untitled Card' },
                    ]} />
                    {isLoading && (
                        <LoadingIndicator />
                    )}
                    {!isLoading && card && (
                        <CardImage
                            card={card}
                            onCardCompleted={onCardCompleted}
                            isEditing={false}
                        />
                    )}
                </Grid>
            </Box>
        </>
    );

};


export default CollectionsCardShowPage;
