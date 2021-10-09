import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { Add, ReorderOutlined } from '@material-ui/icons';
import * as React from 'react';

import QTButton from '../../../components/QTButton';
import { CollectionMiniEntity } from '../../../types/collections';
import colours from '../../../utilities/colours';

const useStyles = makeStyles(() => ({
    root: {
        // TODO: Make mobile responsive
        width: '560px',
        height: '350px',
        position: 'relative',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        fontSize: '84px',
        color: colours.BLUE,
    },
    progressBar: {
        width: '100%',
        position: 'absolute',
        top: 0,
        paddingLeft: '20px',
    },
    progressText: {
        color: colours.WHITE,
    },
    tags: {
        marginTop: '-28px',
        marginLeft: '20px',
        color: colours.WHITE,
    },
    cardContent: {
        paddingTop: 32,
        marginBottom: 20,
    },
}));

interface OwnProps {
    data: CollectionMiniEntity;
    isAddCollectionCard?: boolean;
}

type Props = OwnProps;

const CollectionCard: React.FC<Props> = ({ data, isAddCollectionCard }: Props) => {
    const classes = useStyles();
    // TODO: Replace mock data
    const collectionName = data.name;
    const collectionNumCards = '12';
    const collectionTags = ['Tag1', 'Tag2'];
    const progressPercentage = '10';
    const imageSrc = 'https://picsum.photos/200/300';

    const progressBarColor = `
    linear-gradient(to right, 
        ${colours.GREEN}, 
        ${colours.GREEN} ${progressPercentage}%, 
        transparent ${progressPercentage}%, 
        transparent 100%)`;

    // TODO: Implement functions
    const openCollection = () => {
        console.log('Open');
    };

    const editCollection = () => {
        console.log('Edit');

    };

    const deleteCollection = () => {
        console.log('Delete');
    };

    const addNewCollection = () => {
        console.log('Add new');
    };

    if (isAddCollectionCard) {
        return (
            <Card className={`${classes.root} ${classes.center}`} onClick={addNewCollection}>
                <CardContent>
                    <Grid container className={classes.center}>
                        <Add className={classes.addIcon} />
                    </Grid>
                    <Typography gutterBottom variant="h5" component="div">
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
                height="140"
                image={imageSrc}
            />
            <Box className={classes.progressBar} style={{ background: progressBarColor }}>
                <Typography className={classes.progressText}>Progress {progressPercentage}%</Typography>
            </Box>
            <Typography className={classes.tags}>{collectionTags.join(', ')}</Typography>

            <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="div" >
                    {collectionName}
                </Typography>
                <Grid container>
                    <ReorderOutlined />
                    <Typography variant="body1" style={{ marginLeft: 6 }}>
                        {collectionNumCards} cards
                    </Typography>
                </Grid>
            </CardContent>

            <CardActions>
                <QTButton outlined onClick={openCollection}>Start</QTButton>
                <QTButton onClick={editCollection}>Edit</QTButton>
                <QTButton alert onClick={deleteCollection}>Delete</QTButton>
            </CardActions>
        </Card>
    );
};

export default CollectionCard;
