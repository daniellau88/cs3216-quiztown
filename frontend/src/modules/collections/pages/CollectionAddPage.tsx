import {
    Box,
    Card,
    CardContent,
    CardMedia,
    CssBaseline,
    Grid,
    Input,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import api from '../../../api';
import QTButton from '../../../components/QTButton';
import { CollectionPostData, CollectionsImportPostData } from '../../../types/collections';
import { AppState } from '../../../types/store';
import { UploadData } from '../../../types/uploads';
import colours from '../../../utilities/colours';
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
        paddingLeft: 400,
        paddingRight: 400,
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        fontSize: '10vh',
        color: colours.BLUE,
    },
    cardContent: {
        paddingTop: '1.5vh',
        paddingBottom: '0.75vh',
    },
    addCollectionText: {
        fontSize: '3vh',
    },
    card: {
        marginTop: theme.spacing(3),
        justifyContent: 'center',
        alignItems: 'center',
        height: '30vh',
        width: '30vh',
    },
}));

const AddCollectionPage: React.FC<{}> = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const imageSrc = 'https://picsum.photos/200/300';

    const user = useSelector((state: AppState) => getCurrentUser(state));

    const [fileCardInfo, saveFileCardInfo] = useState<Array<File>>([]);
    const [collectionName, setCollectionName] = useState<string>('Untitled collection');
    // TODO: add a selector for get file keys
    // will do this very soon, gonna run for sth
    // const uploadFiles = useSelector((state: AppState) => getFileKeys(state));
    const [uploadFiles, setUploadedResponse] = useState<Array<UploadData>>([]);

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
                    const copy = [...uploadFiles];
                    copy.push(upload);
                    setUploadedResponse(copy);
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
                return handleApiRequest(dispatch, dispatch(importCollections(response.payload.id, { imports: uploadFiles }))).then((importResponse) => {
                    const payload = importResponse.payload;
                    console.log(payload);
                    // Redirect to home page
                    // history.push('/collections');
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

                    <Grid container alignItems='center'>
                        <Grid container item
                            xs={12} sm={6} md={4} lg={3}
                            justifyContent='center'
                            alignItems='center'
                            className={classes.card}
                        >
                            <Card className={`${classes.root} ${classes.center}`}
                            >
                                <CardContent>
                                    <Grid container className={classes.center}>
                                        <label htmlFor="icon-button-file">
                                            <input
                                                type="file"
                                                id="icon-button-file"
                                                onChange={upload}
                                                multiple
                                                hidden
                                            />
                                            <Add className={classes.addIcon} />
                                        </label>
                                    </Grid>
                                    <Typography className={classes.addCollectionText} component="div">
                                        Select png/jpg/pdf
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        {fileCardInfo.map((file: File, index: number) => {
                            return (
                                <Grid container item
                                    key={index}
                                    xs={12} sm={6} md={4} lg={3}
                                    justifyContent='center'
                                    alignItems='center'
                                    className={classes.card}
                                >
                                    <Card className={`${classes.root} ${classes.center}`} key={index}>
                                        <CardContent>
                                            <Grid container className={classes.center}>
                                                <CardMedia
                                                    component="img"
                                                    alt="green iguana"
                                                    height="40%"
                                                    width="auto"
                                                    image={imageSrc}
                                                />
                                            </Grid>
                                            <Typography className={classes.addCollectionText} component="div">
                                                {file.name}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })
                        }
                    </Grid>
                    <Grid container direction='column' className={classes.button}>
                        <QTButton outlined onClick={reviewCollection}>Review Collection</QTButton>
                    </Grid>
                </Grid>
            </Box >
        </>
    );
};

export default AddCollectionPage;