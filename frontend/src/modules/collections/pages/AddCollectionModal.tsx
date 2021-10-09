import {
    Box,
    CssBaseline,
    Grid,
    Input,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';

import api from '../../../api';
import QTButton from '../../../components/QTButton';
import CollectionUploadView from '../components/CollectionUploadView';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        paddingTop: '80px',
        paddingBottom: '80px',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 60,
    },
    input: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
    },
    upload: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
        paddingBottom: 30,
    },
    button: {
        padding: 40,
        paddingLeft: 500,
        paddingRight: 500,
    },
}));

const AddCollectionModal: React.FC<{}> = () => {
    const classes = useStyles();

    const [files, saveFileInfo] = useState<Array<File>>([]);
    const [collectionName, setCollectionName] = useState<string>('Untitled collection');

    const upload = async (e: React.ChangeEvent<any>) => {
        saveFileInfo([...e.target.files]);
        const promises = [...e.target.files].map(async (file: File) => {
            await api.uploads.createUpload(file);
        });

        await Promise.all(promises);
    };

    const handleCollectionNameChange = (e: React.ChangeEvent<any>) => {
        const newName = e.target.value;
        setCollectionName(newName);
    };

    const reviewCollection = () => {
        console.log('review collection..');
    };

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Grid container direction='column' className={classes.header}>
                        <Input className={classes.input}
                            onChange={handleCollectionNameChange}
                            value={collectionName}
                            placeholder="Untitled Collection" />
                    </Grid>

                    <Grid container direction='column' className={classes.upload}>
                        <Input
                            type="file"
                            onChange={upload}
                            inputProps={{ multiple: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container justifyContent="space-between" spacing={2}>
                            {files && files.map((file: File) => {
                                return (<CollectionUploadView file={file} key={file.name} />);
                            })
                            }
                        </Grid>
                    </Grid>
                    <Grid container direction='column' className={classes.button}>
                        <QTButton outlined onClick={reviewCollection}>Review Collection</QTButton>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default AddCollectionModal;
