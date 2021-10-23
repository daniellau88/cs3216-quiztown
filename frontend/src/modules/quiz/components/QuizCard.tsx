import React, { Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import CardImage from '../../cards/components/CardImage';
import { loadCard } from '../../cards/operations';
import { getCardEntity } from '../../cards/selectors';

interface OwnProps {
    cardId: number
    onComplete: () => void
}

type Props = OwnProps;

const QuizCard: React.FC<Props> = (props: Props) => {
    const dispatch = useDispatch();
    const card = useSelector((state: AppState) => getCardEntity(state, props.cardId));

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        handleApiRequest(
            dispatch,
            dispatch(loadCard(props.cardId)),
        ).finally(() => setIsLoading(false));
    }, [dispatch, props.cardId]);

    return (
        <>
            {isLoading && (
                <LoadingIndicator />
            )}
            {!isLoading && card && (
                <CardImage
                    card={card}
                    isEditing={false}
                    onComplete={props.onComplete}
                />
            )}
        </>
    );

};

export default QuizCard;
