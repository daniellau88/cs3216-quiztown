import React, { useState } from 'react';
import {
    makeStyles,
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    CssBaseline,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingTop: '80px',
        paddingBottom: '80px',
    },
    container: {
        rowGap: 60,
    },
    header: {
        columnGap: 20,
    },
    inputFields: {
        rowGap: 20,
    },
}));

const AddCardPage: React.FC<{}> = () => {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState<File>();
    const [cardTitle, setCardTitle] = useState('CVS Physio 1 - Card 10');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardTitle(event.target.value);
    };

    const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value);
    };

    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(event.target.value);
    };

    const fileData = () => {
        if (selectedFile) {
            return (
                <Box>
                    <Typography variant='h2'>
                        File Details:
                    </Typography>
                    <Typography variant='body1'>
                        File Name: {selectedFile.name}
                    </Typography>
                    <Typography variant='body1'>
                        File Type: {selectedFile.type}
                    </Typography>
                </Box>
            );
        }
    };

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container direction='column' className={classes.container}>
                    <Grid container className={classes.header}>
                        <TextField value={cardTitle} onChange={handleTitleChange}/>
                        <Button
                            variant="contained"
                            component="label"
                        >
                            Upload File
                            <input
                                type="file"
                                onChange={onFileChange}
                                hidden
                            />
                        </Button>
                    </Grid>

                    {selectedFile && fileData()}

                    {!selectedFile &&
                    <Grid container direction='column' className={classes.inputFields}>
                        <TextField multiline label="Question" variant="outlined" value={question} onChange={handleQuestionChange} />
                        <TextField multiline label="Answer" variant="outlined" value={answer} onChange={handleAnswerChange} />
                    </Grid>
                    }
                </Grid>
            </Box>
        </>
    );
};

export default AddCardPage;
