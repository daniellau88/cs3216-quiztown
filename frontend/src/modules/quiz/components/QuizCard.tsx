import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { CARD_TYPE } from '../../../components/utiltiies/constants';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import CardImage from '../../cards/components/CardImage';
import CardText from '../../cards/components/CardText';
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

    console.log(card);

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
            {!isLoading && card && (card.type == CARD_TYPE.TEXT ?
                <CardText
                    card={card}
                    isEditing={false}
                    onComplete={props.onComplete}
                />
                :
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
