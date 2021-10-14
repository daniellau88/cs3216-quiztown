import { Button, Grid } from '@material-ui/core';
import { fabric } from 'fabric';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import CardImage from '../components/CardImage';
import { loadCard } from '../operations';
import { getCardEntity } from '../selectors';


type Props = RouteComponentProps;

const CollectionsImageCardEditPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const dispatch = useDispatch();
    const cardId: number = +(params as { cardId: string }).cardId;
    const collectionId: number = +(params as { collectionId: string }).collectionId;
    const card = useSelector((state: AppState) => getCardEntity(state, cardId));
    const canvasRef = React.useRef<fabric.Canvas>();

    const [isLoading, setIsLoading] = React.useState(true);


    const onUpdate = (cardId: number, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        handleApiRequest(dispatch, dispatch(loadCard(cardId))).finally(() => {
            setIsLoading(false);
        });
    };

    // TODO: Implement save edits to BE
    const saveAnswerData = (canvas:fabric.Canvas) => {
        const data = canvas.toDatalessJSON();
    };

    // TODO: Implement confirming of all cards reviewed
    const confirmAllCards = () => {
        console.log('Ref is: ' , canvasRef && canvasRef.current);
    };

    React.useEffect(() => {
        onUpdate(cardId, dispatch);
    }, [dispatch, collectionId, cardId]);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Grid>
            {!isLoading && card && (
                <CardImage
                    id={card.id}
                    imageUrl={card.image_link}
                    result={card.answer_details.results}
                    imageMetadata={card.image_metadata}
                    saveAnswerData={saveAnswerData}
                    isEditing={true}
                    canvasRef={canvasRef}
                />
            )}
            <Button onClick={confirmAllCards}>
                Confirm all
            </Button>
        </Grid>
    );

};

export default CollectionsImageCardEditPage;
