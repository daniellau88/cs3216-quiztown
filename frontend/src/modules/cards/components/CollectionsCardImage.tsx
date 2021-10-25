import { Grid } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { CardEntity } from '../../../types/cards';
import { CollectionMiniEntity } from '../../../types/collections';
import { EntitySelection } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import CardImageQuiz from '../components/CardImageQuiz';
import { loadCard } from '../operations';

interface OwnProps {
    collectionId: number;
    cardId: number;
    card: EntitySelection<CardEntity>;
    collection?: EntitySelection<CollectionMiniEntity>
}

type Props = OwnProps;

const CollectionsCardImage: React.FC<Props> = ({ collectionId, cardId, card }: Props) => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = React.useState(true);

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
                />
            )}
        </Grid>
    );

};


export default CollectionsCardImage;
