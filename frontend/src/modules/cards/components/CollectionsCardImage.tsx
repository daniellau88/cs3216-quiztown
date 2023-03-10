import { Grid } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { CardImageEntity } from '../../../types/cards';
import { CollectionMiniEntity } from '../../../types/collections';
import { EntitySelection } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { getCurrentUser } from '../../auth/selectors';
import CardImageQuiz from '../components/CardImageQuiz';
import { loadCard } from '../operations';

interface OwnProps {
    collectionId: number;
    cardId: number;
    card: EntitySelection<CardImageEntity>;
    collection: EntitySelection<CollectionMiniEntity>;
}

type Props = OwnProps;

const CollectionsCardImage: React.FC<Props> = ({ collectionId, cardId, card, collection }: Props) => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = React.useState(true);
    const user = useSelector(getCurrentUser);
    const isOwner = user && collection ? user.user_id == collection.owner_id : false;

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
                <CardImageQuiz
                    card={card}
                    isOwner={isOwner}
                />
            )}
        </Grid>
    );

};


export default CollectionsCardImage;
