import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    makeStyles,
} from '@material-ui/core';
import React, { MutableRefObject } from 'react';

const useStyles = makeStyles(() => ({
    root: {
        marginBottom: '20px',
    },
}));

interface OwnProps {
    cardQuestion: string | undefined,
    cardAnswer: string | undefined,
    textEditRef: MutableRefObject<{question: string, answer: string} | undefined>
}

type Props = OwnProps;


const CollectionsTextCardEdit: React.FC<Props> = ({ cardQuestion, cardAnswer, textEditRef }) => {
    const classes = useStyles();

    const [question, setQuestion] = React.useState(cardQuestion || '');
    const [answer, setAnswer] = React.useState(cardAnswer || '');

    const updateQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const newQuestion = e.target.value;
        setQuestion(newQuestion);
      
        textEditRef.current = { question: newQuestion, answer: answer };
    };


    const updateAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const newAnswer = e.target.value;
        setAnswer(newAnswer);

        textEditRef.current = { question: question, answer: newAnswer };
    };

    return (
        <Table aria-label="table" className={classes.root}>
            <TableBody>
                <TableRow>
                    <TableCell component="th" scope="row" width='50%'>
                        <TextField
                            id="outlined-basic"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={5}
                            value={question}
                            onChange={updateQuestion}
                        />
                    </TableCell>
                    <TableCell width='50%'>
                        <TextField
                            id="outlined-basic"
                            label="Answer"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={5}
                            value={answer}
                            onChange={updateAnswer}
                        />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default CollectionsTextCardEdit;
