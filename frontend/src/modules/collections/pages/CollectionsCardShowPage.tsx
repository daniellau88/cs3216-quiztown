import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import CollectionsCardImage from '../components/CollectionsCardImage';
import { loadCollectionsCard } from '../operations';
import { getCollectionsCardEntity } from '../selectors';

interface OwnProps {
    collectionId: number;
    cardId: number;
}
type Props = OwnProps;

const CollectionsCardShowPage: React.FC<Props> = ({ collectionId, cardId }: Props) => {
    const dispatch = useDispatch();
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
