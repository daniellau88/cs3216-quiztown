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
import LabelIcon from '@material-ui/icons/Label';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import QTButton from '../../../components/QTButton';
import { CollectionMiniEntity } from '../../../types/collections';
import colours from '../../../utilities/colours';
import { handleApiRequest } from '../../../utilities/ui';
import { deleteCollection } from '../operations';

const useStyles = makeStyles(() => ({
    root: {
        // TODO: Make mobile responsive
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
    // TODO: Replace mock data
    const collectionName = data?.name;
    const collectionId = data?.id;
    const collectionNumCards = '12';
    const collectionTags = ['Tag1', 'Tag2'];
    const imageSrc = 'https://picsum.photos/200/300';

    // TODO: Implement functions
    const openCollection = () => {
        history.push(`/collections/${collectionId}`);
    };

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

    const addNewCollection = () => {
        console.log('Add new');
        history.push('/collections/new');
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

    return (
        <Card className={classes.root}>
            <CardMedia
                component="img"
                alt="green iguana"
                height="40%"
                width="auto"
                image={imageSrc}
            />

            <CardContent className={classes.cardContent}>
                <Typography className={classes.collectionNameText} component="div" >
                    {collectionName}
                </Typography>
                <Grid container alignItems='center'>
                    <ReorderOutlined className={classes.collectionIcon} />
                    <Typography className={classes.collectionText} style={{ marginLeft: 6 }}>
                        {collectionNumCards} cards
                    </Typography>
                    <Grid item style={{ width: '2vw' }} />
                    <LabelIcon className={classes.collectionIcon} />
                    <Typography className={classes.collectionText} style={{ marginLeft: 6 }}>
                        {collectionTags.join(', ')}
                    </Typography>
                </Grid>
            </CardContent>

            <CardActions>
                <Grid container alignItems='center' style={{ paddingLeft: '0.5vw' }}>
                    <Box display='flex' height='100%' width='100%'>
                        <Grid container item xs={3} alignItems='center'>
                            <QTButton outlined height='95%' width='95%' onClick={startCollection}>
                            Test Me!
                            </QTButton>
                        </Grid>
                        <Grid container item xs={3} alignItems='center'>
                            <QTButton height='95%' width='95%' onClick={openCollection}>
                            View
                            </QTButton>
                        </Grid>
                        <Box flexGrow={1} />
                        <Box display='flex' minHeight='100%' style={{ paddingRight: '0.5vw' }} justifyContent='center' alignItems='center'>
                            <Button onClick={handleDeleteCollection} >
                                <DeleteIcon style={{ color: colours.DEEPRED }} />
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </CardActions>
        </Card>
    );
};

export default CollectionCard;
