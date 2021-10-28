import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { CardType } from '../../../types/cards';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import CardImageEdit from '../../cards/components/CardImageEdit';
import { loadCard, updateCard } from '../../cards/operations';
import { formatCardData } from '../../cards/pages/CollectionsCardEditPage';
import { getCardEntity } from '../../cards/selectors';

interface OwnProps {
    cardId: number | undefined,
}

type Props = OwnProps;

const CollectionReviewCard: React.FC<Props> = ({ cardId }) => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = React.useState(true);

    const canvasRef = React.useRef<fabric.Canvas>();
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

    const saveEditChanges = (isAutosave: boolean) => {
        if (!canvasRef || !cardId) return;
        const answerBoxes = canvasRef.current?.getObjects();
        if (!answerBoxes) return;
        const cardAnswerDetails = formatCardData(answerBoxes);
        if (cardAnswerDetails) {
            handleApiRequest(dispatch, dispatch(updateCard(cardId, {
                answer_details: {
                    results: cardAnswerDetails,
                },
            })));
        }
    };

    if (isLoading) return <LoadingIndicator />;

    if (!card || !cardId) return null;

    if (card.type !== CardType.IMAGE) {
        return (
            <>
                Invalid card type
            </>
        );
    }

    return (
        <CardImageEdit
            card={card}
            canvasRef={canvasRef}
            saveEdits={saveEditChanges}
        />
    );
};

export default CollectionReviewCard;
