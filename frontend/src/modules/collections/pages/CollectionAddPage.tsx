import {
    Box,
    CssBaseline,
    Grid,
    Input,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import api from '../../../api';
import QTButton from '../../../components/QTButton';
import { CollectionPostData, CollectionsImportPostData } from '../../../types/collections';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { getCurrentUser } from '../../auth/selectors';
import { addUpload } from '../../uploads/operations';
import CollectionUploadView from '../components/CollectionUploadView';
import { addCollection, importCollections } from '../operations';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        paddingTop: '80px',
        paddingBottom: '80px',
    },
    header: {
        paddingTop: 30,
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
    const dispatch = useDispatch();
    const history = useHistory();

    const user = useSelector((state: AppState) => getCurrentUser(state));

    const [fileCardInfo, saveFileCardInfo] = useState<Array<File>>([]);
    const [collectionName, setCollectionName] = useState<string>('Untitled collection');
    // TODO: add a selector for get file keys
    // will do this very soon, gonna run for sth
    const uploadFiles = useSelector((state: AppState) => getFileKeys(state));

    const upload = async (e: React.ChangeEvent<any>) => {
        const fileInfo = [...fileCardInfo];
        console.log(e.target.files.name);
        fileInfo.push(...e.target.files);
        console.log(fileInfo);
        saveFileCardInfo(fileInfo);
        [...e.target.files].map(async (file: File) => {

            return handleApiRequest(dispatch, dispatch(addUpload(file)))
                .then((response) => {
                    const upload = response.payload;
                    console.log(upload);
                })
                .then(() => {
                    return true;
                })
                .catch(() => {
                    return false;
                });
        });
    };

    const createCollection = () => {
        if (uploadFiles == undefined) {
            return;
        }
        // TODO: change owner_id: user ? user.id : 0
        const collectionPostDataCurrent: CollectionPostData = { name: collectionName, owner_id: 0 };
        return handleApiRequest(dispatch, dispatch(addCollection(collectionPostDataCurrent)))
            .then((response) => {
                console.log(response);
                return handleApiRequest(dispatch, dispatch(importCollections(response.payload.id, uploadFiles))).then((importResponse) => {
                    const payload = importResponse.payload;
                    // Redirect to home page
                    history.push('/collections');
                });
            })
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    };

    const handleCollectionNameChange = (e: React.ChangeEvent<any>) => {
        const newName = e.target.value;
        setCollectionName(newName);
    };

    const reviewCollection = () => {
        console.log('review collection..');
        createCollection();
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
                            {fileCardInfo.map((file: File) => {
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