import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { AppState } from '../../../types/store';
import { dateToISOFormat } from '../../../utilities/datetime';
import { handleApiRequest } from '../../../utilities/ui';
import CardImage from '../components/CardImage';
import { loadCard, updateCard } from '../operations';
import { getCardEntity } from '../selectors';


type Props = RouteComponentProps;

const CollectionsCardShowPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const cardId: number = +(params as { cardId: string }).cardId;
    const collectionId: number = +(params as { collectionId: string }).collectionId;
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
            {isLoading && (
                <LoadingIndicator />
            )}
            {!isLoading && card && (
                <CardImage
                    id={card.id}
                    imageUrl={card.image_link}
                    result={card.answer_details.results}
                    onCardCompleted={onCardCompleted}
                    imageMetadata={card.image_metadata}
                    isEditing={false}
                />
            )}
        </>
    );

};


export default CollectionsCardShowPage;
