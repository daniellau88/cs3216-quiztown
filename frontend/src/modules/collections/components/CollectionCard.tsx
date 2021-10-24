import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { Add, ReorderOutlined } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import defaultCollectionImage from '../../../assets/images/logo512.png';
import QTButton from '../../../components/QTButton';
import { CollectionMiniEntity } from '../../../types/collections';
import colours from '../../../utilities/colours';
import { handleApiRequest } from '../../../utilities/ui';
import { getCurrentUser } from '../../auth/selectors';
import { deleteCollection, duplicatePublicCollection } from '../operations';

import CollectionTag from './CollectionTag';
import CollectionTagSelector from './CollectionTagSelector';

const useStyles = makeStyles(() => ({
    root: {
        width: '95%',
        height: '95%',
        position: 'relative',
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
    collectionNameText: {
        fontSize: '2.5vh',
    },
    collectionIcon: {
        fontSize: '2.5vh',
    },
    collectionText: {
        fontSize: '1.5vh',
    },
    imageContainer: {
        height: '40%',
        backgroundColor: colours.BLUE,
    },
    collectionImage: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 'auto',
        height: '100%',
    },
    tagSelectorContainer: {
        maxWidth: '100%',
        overflow: 'hidden',
    },
}));

interface OwnProps {
    data?: CollectionMiniEntity;
    isAddCollectionCard?: boolean;
}

type Props = OwnProps;

const CollectionCard: React.FC<Props> = ({ data, isAddCollectionCard }: Props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const collectionId = data?.id;
    const currentUser = useSelector(getCurrentUser);
    const userId = currentUser ? currentUser.user_id : 0;

    const addNewCollection = () => {
        history.push('/collections/new');
    };

    const duplicateCollection = () => {
        console.log('saving to my own collection...');
        if (!collectionId) {
            return false;
        }
        return handleApiRequest(dispatch, dispatch(duplicatePublicCollection(collectionId)))
            .then((newCollection) => {
                console.log('successfully saved to my own collection...');
                history.push(`/collections/${newCollection.payload.id}`);
                return true;
            });
    };

    if (isAddCollectionCard) {
        return (
            <Card className={`${classes.root} ${classes.center}`} onClick={addNewCollection}>
                <CardContent>
                    <Grid container className={classes.center}>
                        <Add className={classes.addIcon} />
                    </Grid>
                    <Typography className={classes.addCollectionText} component="div">
                        Add Collection
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (!data) {
        return null;
    }

    const collectionName = data.name;
    const isOwner = userId === data.owner_id;

    const openCollection = () => {
        history.push(`/collections/${collectionId}`);
    };

    // TODO: Implement collection testing start
    const startCollection = () => {
        console.log('Start');

    };

    const handleDeleteCollection = () => {
        if (!collectionId) {
            return false;
        }
        return handleApiRequest(dispatch, dispatch(deleteCollection(collectionId)))
            .then(() => {
                return true;
            });
    };

    return (
        <Card className={classes.root}>
            <Box className={classes.imageContainer}>
                <CardMedia
                    component="img"
                    image={data?.image_link || defaultCollectionImage}
                    style={data?.image_link ? { width: '100%' } : {}}
                    className={classes.collectionImage}
                />
            </Box>

            <CardContent className={classes.cardContent}>
                <Typography className={classes.collectionNameText} component="div" >
                    {collectionName}
                </Typography>
                <Grid container alignItems='center' wrap='nowrap' spacing={1}>
                    <Grid item>
                        <Grid container alignItems='center' wrap='nowrap'>
                            <ReorderOutlined className={classes.collectionIcon} />
                            <Typography className={classes.collectionText} style={{ marginLeft: 6 }} noWrap={true}>
                                {data.num_cards}
                                {data.num_cards > 1 || data.num_cards == 0 ? ' cards' : ' card'}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item className={classes.tagSelectorContainer}>
                        {data.permissions.can_update ?
                            <CollectionTagSelector collectionData={{ id: data.id, tags: data.tags }} /> :
                            <CollectionTag collectionData={{ tags: data.tags }} />}
                    </Grid>
                </Grid>
            </CardContent>

            <CardActions>
                <Grid container alignItems='center' style={{ paddingLeft: '0.5vw' }}>
                    <Box display='flex' height='100%' width='100%'>
                        {isOwner && <Grid container item xs={3} alignItems='center'>
                            <QTButton outlined height='95%' width='95%' onClick={startCollection}>
                                Test Me!
                            </QTButton>
                        </Grid>}
                        <Grid container item xs={3} alignItems='center'>
                            <QTButton height='95%' width='95%' onClick={openCollection}>
                                View
                            </QTButton>
                        </Grid>
                        {!isOwner && <Grid container item xs={3} alignItems='center'>
                            <QTButton height='95%' width='95%' onClick={duplicateCollection}>
                                Save to my collection
                            </QTButton>
                        </Grid>}
                        <Box flexGrow={1} />
                        {data.permissions.can_delete &&
                            <Box display='flex' minHeight='100%' style={{ paddingRight: '0.5vw' }} justifyContent='center' alignItems='center'>
                                <Button onClick={handleDeleteCollection} >
                                    <DeleteIcon style={{ color: colours.DEEPRED }} />
                                </Button>
                            </Box>
                        }
                    </Box>
                </Grid>
            </CardActions>
        </Card>
    );
};

export default CollectionCard;
