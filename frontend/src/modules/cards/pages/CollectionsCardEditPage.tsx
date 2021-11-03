import {
    Box,
    CssBaseline,
    Divider,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { fabric } from 'fabric';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, generatePath, useHistory } from 'react-router-dom';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import QTButton from '../../../components/QTButton';
import Breadcrumbs from '../../../layouts/Breadcrumbs';
import { AnswerData, CardType } from '../../../types/cards';
import { AppState } from '../../../types/store';
import routes from '../../../utilities/routes';
import { handleApiRequest } from '../../../utilities/ui';
import { getCollectionMiniEntity } from '../../collections/selectors';
import CardImageEdit from '../components/CardImageEdit';
import CollectionsTextCardEdit from '../components/CollectionsTextEdit';
import { loadCard, updateCard } from '../operations';
import { getCardEntity } from '../selectors';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingBottom: '8vh',
    },
    container: {
        paddingRight: '80px',
        paddingLeft: '80px',
    },
    alignRight: {
        alignSelf: 'flex-end',
    },
}));

export const formatCardData = (answerBoxes: fabric.Object[], imageXTranslation: number, imageScale: number): AnswerData[] => {
    const FULL_CONFIDENCE = 1;
    const answerData: AnswerData[] = [];

    if (!answerBoxes) return answerData;

    answerBoxes.forEach(answerBox => {
        const textbox = answerBox as fabric.Textbox;
        const top = textbox.top,
            width = textbox.getScaledWidth(),
            height = textbox.getScaledHeight(),
            left = textbox.left,
            text = textbox.text;

        if (!text || !top || !width || !height || !left) return;

        // Reverses translation to canvas object done in CardImageEdit
        const translatedLeft = left - imageXTranslation;

        const topLeftX = Math.floor(translatedLeft / imageScale);
        const topLeftY = Math.floor(top / imageScale);

        const bottomRightX = Math.floor((translatedLeft + width) / imageScale);
        const bottomRightY = Math.floor((top + height) / imageScale);

        answerData.push({
            bounding_box: [[topLeftX, topLeftY], [bottomRightX, bottomRightY]],
            text: text,
            confidence: FULL_CONFIDENCE,
        });

    });

    return answerData;
};


type Props = RouteComponentProps;

const CollectionsCardEditPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const cardId: number = +(params as { cardId: string }).cardId;
    const collectionId: number = +(params as { collectionId: string }).collectionId;
    const collection = useSelector((state: AppState) => getCollectionMiniEntity(state, collectionId));
    const card = useSelector((state: AppState) => getCardEntity(state, cardId));
    const canvasRef = React.useRef<fabric.Canvas>();

    const [isLoading, setIsLoading] = React.useState(true);


    const onUpdate = (cardId: number, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        handleApiRequest(dispatch, dispatch(loadCard(cardId))).finally(() => {
            setIsLoading(false);
        });
    };

    const saveImageEditChanges = (imageXTranslation: number, imageScale: number) => {
        if (!canvasRef) return;
        const answerBoxes = canvasRef.current?.getObjects();
        if (!answerBoxes) return;
        const cardAnswerDetails = formatCardData(answerBoxes, imageXTranslation, imageScale);
        if (cardAnswerDetails) {
            handleApiRequest(dispatch, dispatch(updateCard(cardId, {
                answer_details: {
                    results: cardAnswerDetails,
                },
            })));
        }
    };

    React.useEffect(() => {
        onUpdate(cardId, dispatch);
    }, [dispatch, collectionId, cardId]);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Breadcrumbs links={[
                        { path: routes.COLLECTIONS.INDEX, name: 'Collections' },
                        { path: generatePath(routes.COLLECTIONS.SHOW, { collectionId: collectionId }), name: collection ? collection.name : 'Untitled collection' },
                        { path: null, name: card ? card.name : 'Untitled Card' },
                    ]} />
                    <Grid container direction='column' className={classes.container}>
                        <Typography variant='h3'>
                            Editing Card - {card && card.name}
                        </Typography>
                        <Divider />

                        <Grid item>
                            {!isLoading && card &&
                                (card.type == CardType.IMAGE
                                    ? <CardImageEdit
                                        card={card}
                                        canvasRef={canvasRef}
                                        saveEdits={saveImageEditChanges}
                                    />
                                    : <CollectionsTextCardEdit card={card} />)}
                        </Grid>
                        {card && card.type == CardType.IMAGE && (
                            <Grid item className={classes.alignRight}>
                                <QTButton
                                    onClick={() => history.push(`/collections/${collectionId}`)}
                                    outlined
                                >
                                    Confirm
                                </QTButton>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </>
    );

};

export default CollectionsCardEditPage;
