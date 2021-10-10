import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps , useHistory } from 'react-router-dom';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { AppState } from '../../../types/store';
import { dateToISOFormat } from '../../../utilities/datetime';
import { handleApiRequest } from '../../../utilities/ui';
import CollectionsCardImage from '../components/CollectionsCardImage';
import { loadCollectionsCard, updateCollectionsCard } from '../operations';
import { getCollectionsCardEntity } from '../selectors';


type Props = RouteComponentProps;

const CollectionsCardShowPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const cardId:number = +(params as { cardId: string }).cardId.substring(1);
    const collectionId:number = +(params as { collectionId: string }).collectionId.substring(1);
    const card = useSelector((state: AppState) => getCollectionsCardEntity(state, cardId));

    const [isLoading, setIsLoading] = React.useState(true);

    const onUpdate = (collectionId: number, cardId: number, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        handleApiRequest(dispatch, dispatch(loadCollectionsCard(collectionId, cardId))).finally(() => {
            setIsLoading(false);
        });
    };

    const onCardCompleted = (nextBoxNumber: number, nextDate: Date) => {
        handleApiRequest(dispatch, dispatch(updateCollectionsCard(collectionId, cardId, {
            box_number: nextBoxNumber,
            next_date: dateToISOFormat(nextDate),
        }))).finally(() => {
            setIsLoading(false);
        });
        history.push(`/collections/:${collectionId}`);
    };

    React.useEffect(() => {
        onUpdate(collectionId, cardId, dispatch);
    }, [dispatch, collectionId, cardId]);

    return (
        <>
            {isLoading && (
                <LoadingIndicator />
            )}
            {!isLoading && card && (
                <CollectionsCardImage
                    id={card.id}
                    imageUrl={card.image_link}
                    result={card.answer_details.results}
                    onCardCompleted={onCardCompleted}
                />
            )}
        </>
    );

};


export default CollectionsCardShowPage;
