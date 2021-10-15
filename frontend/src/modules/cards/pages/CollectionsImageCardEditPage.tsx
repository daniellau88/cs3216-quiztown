import {
    Divider,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { fabric } from 'fabric';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import QTButton from '../../../components/QTButton';
import { AnswerData } from '../../../types/cards';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import CardImage from '../components/CardImage';
import { loadCard, updateCard } from '../operations';
import { getCardEntity } from '../selectors';

const useStyles = makeStyles(() => ({
    container: {
        paddingRight: '80px',
        paddingLeft: '80px',
    },
    alignRight: {
        alignSelf: 'flex-end',
    },
}));

type Props = RouteComponentProps;

const CollectionsImageCardEditPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const history = useHistory();
    const classes = useStyles();
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

    const formatCardData = (answerBoxes:fabric.Object[]) => {
        const FULL_CONFIDENCE = 1;
        const answerData:AnswerData[] = [];

        if (!answerBoxes) return;

        answerBoxes.forEach(answerBox => {
            const textbox = answerBox as fabric.Textbox;
            const top = textbox.top,
                width = textbox.getScaledWidth(),
                height = textbox.getScaledHeight(),
                left = textbox.left,
                text = textbox.text;

            if (!text || !top || !width || !height || !left) return;

            answerData.push({
                bounding_box: [[left, top], [left + width, top + height]],
                text: text,
                confidence: FULL_CONFIDENCE,
            });

        });

        return answerData;
    };

    const confirmEdit = () => {
        if (!canvasRef) return;
        const answerBoxes = canvasRef.current?.getObjects();
        if (!answerBoxes) return;
        const cardAnswerDetails = formatCardData(answerBoxes);
        if (cardAnswerDetails) {
            handleApiRequest(dispatch, dispatch(updateCard(cardId, {
                answer_details: {
                    results: cardAnswerDetails,
                },
            }))).finally(() => {
                history.push(`/collections/${collectionId}`);
            });
        }
    };

    React.useEffect(() => {
        onUpdate(cardId, dispatch);
    }, [dispatch, collectionId, cardId]);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Grid container direction='column' className={classes.container}>
            <Typography variant='h3'>
                Editing Card - {card && card.name}
            </Typography>
            <Divider/>

            <Grid item>
                {!isLoading && card && (
                    <CardImage
                        id={card.id}
                        imageUrl={card.image_link}
                        result={card.answer_details.results}
                        imageMetadata={card.image_metadata}
                        isEditing={true}
                        canvasRef={canvasRef}
                    />
                )}
            </Grid>

            <Grid item className={classes.alignRight}>
                <QTButton onClick={confirmEdit} outlined>
                    Confirm
                </QTButton>
            </Grid>
        </Grid>
    );

};

export default CollectionsImageCardEditPage;
