import {
    Box,
    Button,
    CssBaseline,
    Grid,
    IconButton,
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
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { CARD_TYPE } from '../../../components/utiltiies/constants';
import { UploadTextData } from '../../../types/uploads';
import colours from '../../../utilities/colours';
import { handleApiRequest } from '../../../utilities/ui';
import { addUpload } from '../../uploads/operations';
import { importTextCardToCollections, loadCollectionCards } from '../operations';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingTop: '30px',
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
}));

type InputText = {
    name?: string,
    question: string,
    answer: string,
};

type ImportRequestBody = {
    name: string,
    type: string,
    question: string,
    answer: string,
};

type Props = RouteComponentProps;

const CollectionsCardAddTextPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const [data, saveData] = useState<InputText[]>([]);
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const collectionId: number = +(params as { collectionId: string }).collectionId;

    const addRow = () => {
        saveData([
            ...data,
            { question: '', answer: '' },
        ]);
    };

    const saveQuestion = (index: number, value: string) => {
        saveData([
            ...data.slice(0, index),
            { ...data[index], question: value },
            ...data.slice(index + 1),
        ]);
    };

    const saveAnswer = (index: number, value: string) => {
        saveData([
            ...data.slice(0, index),
            { ...data[index], answer: value },
            ...data.slice(index + 1),
        ]);
    };

    const deleteRow = (index: number) => {
        saveData([...data.slice(0, index), ...data.slice(index + 1)]);
    };

    const submit = () => {
        console.log(data);
        const dataCopy = [] as UploadTextData[];
        data.map((tuple, index) => dataCopy.push(
            {
                name: index + tuple.question.split(' ')[0],
                type: CARD_TYPE.TEXT,
                question: tuple.question,
                answer: tuple.answer,
                collection_id: collectionId,
            } as UploadTextData));
        return handleApiRequest(dispatch, dispatch(importTextCardToCollections(collectionId, { imports: dataCopy, type: CARD_TYPE.TEXT }))).then((importResponse) => {
            const payload = importResponse.payload;
            console.log(payload);

            return handleApiRequest(dispatch, dispatch(loadCollectionCards(collectionId, {}))).finally(() => {
                history.push(`/collections/${collectionId}`);
            });
        });
    };

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container direction='column' className={classes.container}>
                    <Grid container className={classes.header}>
                        <Typography variant="h4" className="self-start mb-4">
                            Adding Cards to Anatomy
                        </Typography>
                    </Grid>
                    <TableContainer component={Paper} className="px-8 py-6">
                        <Table aria-label="table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Card Number</TableCell>
                                    <TableCell>Question</TableCell>
                                    <TableCell>Answer</TableCell>
                                    <TableCell>      </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row, index: number) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                id="outlined-basic"
                                                label="Question"
                                                variant="outlined"
                                                multiline
                                                rows={2}
                                                value={row.question}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    saveQuestion(index,
                                                        e.target.value);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                id="outlined-basic"
                                                label="Answer"
                                                variant="outlined"
                                                multiline
                                                rows={2}
                                                value={row.answer}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    saveAnswer(index,
                                                        e.target.value);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    deleteRow(index);
                                                }}
                                            >
                                                <DeleteIcon
                                                    fontSize="small"

                                                />
                                            </IconButton>
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        addRow();
                                    }}
                                >
                                    Add Card
                                </Button>
                            </Box>
                            <Box flexGrow={1} />
                            <Box>
                                <Button
                                    variant="outlined"
                                    className={classes.button}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        submit();
                                    }}
                                >
                                    Done
                                </Button>
                            </Box>
                        </Box>
                    </TableContainer >
                </Grid>
            </Box>
        </>
    );
};
export default CollectionsCardAddTextPage;
