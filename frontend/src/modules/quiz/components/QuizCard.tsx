import { CssBaseline, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { CardType } from '../../../types/cards';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { getCurrentUser } from '../../auth/selectors';
import CardImageQuiz from '../../cards/components/CardImageQuiz';
import CardText from '../../cards/components/CardText';
import { loadCard } from '../../cards/operations';
import { getCardEntity } from '../../cards/selectors';
import { loadCollection } from '../../collections/operations';
import { getCollectionMiniEntity } from '../../collections/selectors';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingTop: '20px',
    },
    fullWidth: {
        width: '100%',
    },
}));
interface OwnProps {
    cardId: number
    onComplete: () => void
}

type Props = OwnProps;

const QuizCard: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const card = useSelector((state: AppState) => getCardEntity(state, props.cardId));
    const collection = useSelector((state: AppState) => getCollectionMiniEntity(state, card?.collection_id));
    const currentUser = useSelector(getCurrentUser);
    const isOwner = currentUser && collection ? currentUser.user_id == collection.id : false;

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        handleApiRequest(
            dispatch,
            dispatch(loadCard(props.cardId)),
        ).finally(() => setIsLoading(false));
    }, [dispatch, props.cardId]);

    React.useEffect(() => {
        if (card) {
            setIsLoading(true);
            handleApiRequest(
                dispatch,
                dispatch(loadCollection(card?.collection_id)),
            ).finally(() => setIsLoading(false));
        }
    }, [dispatch, card]);

    return (
        <>
            <CssBaseline />
            {isLoading && (
                <LoadingIndicator />
            )}
            <Grid container direction='column' className={classes.root}>
                <Grid container item alignItems='center' className={classes.fullWidth}>
                    <Typography align='center' variant='h5' style={{ width: '100%' }}>
                        {collection?.name ? collection?.name : 'Untitled Collection'}: {card?.name ? card?.name : 'Untitled Card'}
                    </Typography>
                </Grid>
                {!isLoading && card && (card.type == CardType.TEXT ?
                    <CardText
                        card={card}
                        isOwner={isOwner}
                        onComplete={props.onComplete}
                    />
                    :
                    <CardImageQuiz
                        card={card}
                        isOwner={isOwner}
                        onComplete={props.onComplete}
                    />
                )}
            </Grid>
        </>
    );

};

export default QuizCard;
