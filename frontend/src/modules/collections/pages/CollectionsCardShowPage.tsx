import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import CollectionsCardImage from '../components/CollectionsCardImage';
import { loadCollectionsCard } from '../operations';
import { getCollectionsCardEntity } from '../selectors';

type Props = RouteComponentProps;

const CollectionsCardShowPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
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

    React.useEffect(() => {
        onUpdate(collectionId, cardId, dispatch);
    }, [dispatch, collectionId, cardId]);

    return (
        <>
            {isLoading && (
                <LoadingIndicator />
            )}
            {!isLoading && card && (
                <CollectionsCardImage id={card.id} imageUrl={card.image_link} result={card.answer_details.results} />
            )}
        </>
    );

};


export default CollectionsCardShowPage;
