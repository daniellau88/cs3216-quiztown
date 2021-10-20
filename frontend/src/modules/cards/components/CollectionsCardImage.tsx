import { Grid } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { CardEntity } from '../../../types/cards';
import { CollectionMiniEntity } from '../../../types/collections';
import { EntitySelection } from '../../../types/store';
import { dateToISOFormat } from '../../../utilities/datetime';
import { handleApiRequest } from '../../../utilities/ui';
import CardImage from '../components/CardImage';
import { loadCard, updateCard } from '../operations';

interface OwnProps {
    collectionId: number;
    cardId: number;
    card: EntitySelection<CardEntity>;
    collection?: EntitySelection<CollectionMiniEntity>

}

type Props = OwnProps;

const CollectionsCardImage: React.FC<Props> = ({ collectionId, cardId, card }: Props) => {
    const history = useHistory();
    const dispatch = useDispatch();

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
        <Grid container spacing={2}>
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
    );

};


export default CollectionsCardImage;
