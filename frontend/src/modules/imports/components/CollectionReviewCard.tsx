import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import CardImage from '../../cards/components/CardImage';
import { loadCard } from '../../cards/operations';
import { getCardEntity } from '../../cards/selectors';

interface OwnProps {
    cardId: number | undefined,
}

type Props = OwnProps;

const CollectionReviewCard: React.FC<Props> = ({ cardId }) => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = React.useState(true);

    const card = useSelector((state: AppState) => getCardEntity(state, cardId));

    const onUpdate = (cardId: number, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        handleApiRequest(dispatch, dispatch(loadCard(cardId))).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        if (!cardId) return;

        onUpdate(cardId, dispatch);
    }, [dispatch, cardId]);

    if (isLoading) return <LoadingIndicator/>;

    if (!card || !cardId) return null;

    return (
        <CardImage
            card={card}
            isEditing={true}
        />
    );
};

export default CollectionReviewCard;
