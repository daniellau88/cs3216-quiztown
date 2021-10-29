import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    makeStyles,
} from '@material-ui/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import * as yup from 'yup';

import { CardTextEntity } from '../../../types/cards';
import { UploadTextData } from '../../../types/collections';
import colours from '../../../utilities/colours';
import { handleApiRequest } from '../../../utilities/ui';
import { updateCard } from '../operations';

const useStyles = makeStyles(() => ({
    root: {
        marginBottom: '20px',
    },
    button: {
        color: colours.BLUE,
    },
    error: {
        color: colours.RED,
    },
}));

interface OwnProps {
    card: CardTextEntity;
}

type Props = OwnProps;


const CollectionsTextCardEdit: React.FC<Props> = ({ card }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const collectionId = card.collection_id;
    const cardId = card.id;
    const cardQuestion = card.question;
    const cardAnswer = card.answer;

    const schema = yup.object().shape({
        questions: yup.array().of(
            yup.object().shape({
                question: yup.string().required('Question is required.'),
                answer: yup.string().required('Answer is required.'),
            }),
        ),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { question: cardQuestion, answer: cardAnswer } as Partial<UploadTextData>,
        resolver: yupResolver(schema),
    });

    const onSubmitHandler = (data: any) => {
        const payload: Partial<UploadTextData> = { question: data.question, answer: data.answer };

        handleApiRequest(dispatch, dispatch(updateCard(cardId, payload))).finally(() => {
            history.push(`/collections/${collectionId}`);
        });
    };

    type RegisterType = 'question' | 'answer';

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Table aria-label="table" className={classes.root}>
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row" width='50%'>
                            <TextField {...register('question' as RegisterType)}
                                name={'question'}
                                type="text"
                                variant="outlined"
                                multiline
                                rows={2}
                                fullWidth
                            />
                            <Box className={classes.error}>{errors.question?.message}</Box>
                        </TableCell>
                        <TableCell width='50%'>
                            <TextField {...register('answer' as RegisterType)}
                                name={'answer'}
                                type="text"
                                variant="outlined"
                                multiline
                                rows={2}
                                fullWidth
                            />
                            <Box className={classes.error}>{errors.answer?.message}</Box>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Box display='flex' justifyContent='flex-end' style={{ width: '100%' }}>
                <Button
                    type="submit"
                    className={classes.button}
                    style={{ paddingLeft: '2vw', paddingRight: '2vw' }}
                >
                    Done
                </Button>
            </Box>
        </form>
    );
};

export default CollectionsTextCardEdit;
