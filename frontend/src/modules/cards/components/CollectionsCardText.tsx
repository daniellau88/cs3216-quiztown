import { Grid } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { CardTextEntity } from '../../../types/cards';
import { CollectionMiniEntity } from '../../../types/collections';
import { EntitySelection } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { getCurrentUser } from '../../auth/selectors';
import { loadCard } from '../operations';

import CardText from './CardText';

interface OwnProps {
    collectionId: number;
    cardId: number;
    card: EntitySelection<CardTextEntity>;
    collection: EntitySelection<CollectionMiniEntity>;
}

type Props = OwnProps;

const CollectionsCardText: React.FC<Props> = ({ collection, collectionId, cardId, card }: Props) => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = React.useState(true);
    const user = useSelector(getCurrentUser);
    const isOwner = (user && collection) ? user.user_id == collection.owner_id : false;

    const onUpdate = (cardId: number, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        handleApiRequest(dispatch, dispatch(loadCard(cardId))).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        onUpdate(cardId, dispatch);
    }, [dispatch, collectionId, cardId]);

    return (
        <Grid container spacing={2}>
            {isLoading && (
                <LoadingIndicator />
            )}
            {!isLoading && card && (
                <CardText
                    card={card}
                    isOwner={isOwner}
                />
            )}
        </Grid>
    );
};


export default CollectionsCardText;
