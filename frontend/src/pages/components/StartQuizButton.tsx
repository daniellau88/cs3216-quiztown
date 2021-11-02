import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles } from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';

import { QTButtonProps } from '../../components/QTButton';
import * as cards from '../../modules/cards';
import { setAutomatedQuiz } from '../../modules/quiz/operations';
import { getAutomatedQuizEntity } from '../../modules/quiz/selectors';
import { QuizData } from '../../types/quiz';
import { dateToTimeSinceText, epochTimeToDate } from '../../utilities/datetime';
import routes from '../../utilities/routes';
import { handleApiRequest } from '../../utilities/ui';

interface OwnProps {
    children?: React.ReactNode;
    buttonComponent: React.ComponentType<ButtonProps>;
}

type Props = OwnProps & ButtonProps & QTButtonProps & ({ cardIds: number[] } | { collectionId: number });

const useStyles = makeStyles(() => ({
    dateText: {
        fontSize: '0.8rem',
    },
}));

const MAX_TIME = 18 * 60 * 1000;

const StartQuizButton: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const quizEntity = useSelector(getAutomatedQuizEntity);
    const [open, setOpen] = React.useState(false);
    const history = useHistory();
    const ButtonComponent = props.buttonComponent;
    let collectionId = -1;
    if ((props as { collectionId: number }).collectionId) {
        collectionId = (props as { collectionId: number }).collectionId;
    }

    const setQuizAndRedirectToQuizPage = (cardIds: number[]) => {
        const quizData: QuizData = {
            cardIds,
        };
        dispatch(setAutomatedQuiz(quizData)).then(() => {
            history.push(generatePath(routes.QUIZ));
        });
    };

    const handleStartQuiz = () => {
        if ((props as { cardIds: number[] }).cardIds) {
            setQuizAndRedirectToQuizPage((props as { cardIds: number[] }).cardIds);
        } else {
            handleApiRequest(
                dispatch,
                dispatch(cards.operations.loadCollectionCards(collectionId, {})),
            ).then((resp) => {
                setQuizAndRedirectToQuizPage(resp.payload.ids);
            });

        }
    };

    const handleClickContinueQuiz = () => {
        history.push(generatePath(routes.QUIZ));
    };

    const handleClickOpen = () => {
        if (quizEntity == null || quizEntity.lastFullUpdate < Date.now() - MAX_TIME) {
            handleStartQuiz();
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <ButtonComponent {...props} onClick={handleClickOpen} />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Restart Quiz</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are currently doing a quiz, are you sure you want to attempt a new quiz?<br />
                        <span className={classes.dateText}>Last Attempt: {dateToTimeSinceText(epochTimeToDate((quizEntity ? quizEntity.lastFullUpdate : 0) / 1000))}</span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleStartQuiz}>Yes</Button>
                    <Button onClick={handleClickContinueQuiz}>Continue Previous Quiz</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StartQuizButton;
