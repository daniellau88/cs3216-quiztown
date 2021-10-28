import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    CssBaseline,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, generatePath, useHistory } from 'react-router-dom';
import * as yup from 'yup';

import Breadcrumbs from '../../../layouts/Breadcrumbs';
import { UploadTextData } from '../../../types/collections';
import { AppState } from '../../../types/store';
import colours from '../../../utilities/colours';
import routes from '../../../utilities/routes';
import { handleApiRequest } from '../../../utilities/ui';
import { getCollectionMiniEntity } from '../../collections/selectors';
import { importTextCards } from '../operations';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingBottom: '80px',
    },
    container: {
        rowGap: 60,
    },
    header: {
        columnGap: 20,
    },
    table: {
        minWidth: 650,
    },
    button: {
        color: colours.BLUE,
    },
    error: {
        color: colours.RED,
    },
}));

type Props = RouteComponentProps;

const CollectionsCardAddTextPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const collectionId: number = +(params as { collectionId: string }).collectionId;

    const collection = useSelector((state: AppState) => getCollectionMiniEntity(state, collectionId));

    const schema = yup.object().shape({
        questions: yup.array().of(
            yup.object().shape({
                question: yup.string().required('Question is required.'),
                answer: yup.string().required('Answer is required.'),
            }),
        ),
    });

    const { control, register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { questions: [{ question: '', answer: '' } as Partial<UploadTextData>] },
        resolver: yupResolver(schema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'questions',
    });

    const onSubmitHandler = (data: any) => {
        const payload: UploadTextData[] = [];
        for (const [index, question] of data.questions.entries()) {
            payload.push({
                name: question.question.split(' ')[0] + `-${index}`,
                question: question.question,
                answer: question.answer,
            });
        }
        return handleApiRequest(dispatch, dispatch(importTextCards(collectionId, { imports: payload }))).then(() => {
            history.push(`/collections/${collectionId}`);
        });
    };

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Breadcrumbs links={[
                        { path: routes.COLLECTIONS.INDEX, name: 'Collections' },
                        { path: generatePath(routes.COLLECTIONS.SHOW, { collectionId: collectionId }), name: collection ? collection.name : 'Untitled collection' },
                        { path: null, name: 'Add Text Card' },
                    ]} />
                    <Grid container direction='column' className={classes.container}>
                        <Grid container className={classes.header}>
                            <Typography variant="h4" className="self-start mb-4">
                                Adding Cards{` to ${collection && collection.name}`}
                            </Typography>
                        </Grid>
                        <TableContainer component={Paper} className="px-8 py-6">
                            <form onSubmit={handleSubmit(onSubmitHandler)}>
                                <Table aria-label="table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Typography align='center' variant={'h6'} >
                                                    Card Number
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography align='center' variant={'h6'} >
                                                    Question
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography align='center' variant={'h6'} >
                                                    Answer
                                                </Typography>
                                            </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fields.map((question, questionIndex) => (
                                            <TableRow key={questionIndex}>
                                                <TableCell>
                                                    <Typography align='center' variant={'h6'} >
                                                        {questionIndex + 1}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField {...register(`questions.${questionIndex}.question`)}
                                                        name={`questions.${questionIndex}.question`}
                                                        type="text"
                                                        variant="outlined"
                                                        multiline
                                                        rows={2}
                                                        fullWidth
                                                    />
                                                    <Box className={classes.error}>{errors.questions?.[questionIndex]?.question?.message}</Box>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField {...register(`questions.${questionIndex}.answer`)}
                                                        name={`questions.${questionIndex}.answer`}
                                                        type="text"
                                                        variant="outlined"
                                                        multiline
                                                        rows={2}
                                                        fullWidth
                                                    />
                                                    <Box className={classes.error}> {errors.questions?.[questionIndex]?.answer?.message}</Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Button onClick={() => remove(questionIndex)}>
                                                        <DeleteIcon />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Box display='flex'>
                                    <Box>
                                        <Button
                                            startIcon={<AddIcon />}
                                            className={classes.button}
                                            onClick={() => {
                                                append({ question: '', answer: '' });
                                            }}
                                            style={{ marginLeft: '2vw' }}
                                        >
                                            Add Card
                                        </Button>
                                    </Box>
                                    <Box flexGrow={1} />
                                    <Box>
                                        <Button
                                            type="submit"
                                            className={classes.button}
                                            style={{ paddingLeft: '2vw', paddingRight: '2vw' }}
                                        >
                                            Done
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        </TableContainer >
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
export default CollectionsCardAddTextPage;
