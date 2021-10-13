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
import { Add } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import LabelIcon from '@material-ui/icons/Label';
import Star from '@material-ui/icons/Star';
import StarOutline from '@material-ui/icons/StarOutline';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import QTButton from '../../../components/QTButton';
import { CardMiniEntity } from '../../../types/cards';
import colours from '../../../utilities/colours';
import { handleApiRequest } from '../../../utilities/ui';
import { deleteCard } from '../operations';

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
        paddingTop: '1.5vh',
        paddingBottom: '0.75vh',
    },
    cardIcon: {
        fontSize: '2.5vh',
    },
    addCardText: {
        fontSize: '3vh',
    },
    cardNameText: {
        fontSize: '2.5vh',
    },
    cardText: {
        fontSize: '1.5vh',
    },
}));

interface OwnProps {
    data?: CardMiniEntity;
    isAddCard?: boolean;
    id?: number;
    beforeRedirect?: () => Promise<number>;
}

type Props = OwnProps;

const CollectionsCardCard: React.FC<Props> = ({ data, isAddCard = false, id, beforeRedirect }: Props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const cardName = data?.name;
    const cardId = data?.id;
    const cardStarred = true;
    const cardTags = ['Tag1', 'Tag2'];
    const collectionId = data?.collection_id || id;
    const imageSrc = 'https://picsum.photos/200/300';

    // TODO: Implement functions
    const duplicateCard = () => {
        console.log('Duplicate');
    };

    const openCard = () => {
        history.push(`/collections/${collectionId}/cards/${cardId}`);
    };

    const editCard = () => {
        history.push(`/collections/${collectionId}/cards/${cardId}/edit`);
    };

    const toggleStarred = () => {
        console.log(cardStarred ? 'Unstar' : 'Star');
    };

    const handleDeleteCard = () => {
        if (!collectionId || !cardId) {
            return false;
        }
        return handleApiRequest(dispatch, dispatch(deleteCard(cardId)))
            .then(() => {
                return true;
            });
    };

    const addNewCard = () => {
        console.log(beforeRedirect);
        if (beforeRedirect) {
            return beforeRedirect().then((newId) => {
                if (newId) {
                    history.push(`/collections/${newId}/cards/new`);
                }
            });
        } else {
            history.push(`/collections/${collectionId}/cards/new`);
        }
    };

    if (isAddCard) {
        return (
            <Card className={`${classes.root} ${classes.center}`} onClick={addNewCard}>
                <CardContent>
                    <Grid container className={classes.center}>
                        <Add className={classes.addIcon} />
                    </Grid>
                    <Typography className={classes.addCardText} component="div">
                        Add Card
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
                <Typography className={classes.cardNameText} component="div" >
                    {cardName}
                </Typography>
                <Grid container alignItems='center'>
                    <Box display='flex' height='100%' width='100%'>
                        <Grid container alignItems='center'>
                            <LabelIcon className={classes.cardIcon} />
                            <Typography className={classes.cardText} style={{ marginLeft: 6 }}>
                                {cardTags.join(', ')}
                            </Typography>
                        </Grid>
                        <Box flexGrow={1} />
                        <Button onClick={toggleStarred}>
                            {cardStarred ?
                                <Star />
                                :
                                <StarOutline />
                            }
                        </Button>
                    </Box>
                </Grid>
            </CardContent>

            <CardActions>
                <Grid container alignItems='center' style={{ paddingLeft: '0.5vw' }}>
                    <Box display='flex' height='100%' width='100%'>
                        <QTButton outlined onClick={openCard}>
                            Test Me!
                        </QTButton>
                        {/* <QTButton outlined onClick={duplicateCard}>Duplicate to other collection</QTButton> */}
                        <QTButton onClick={editCard}>
                            Edit
                        </QTButton>
                        <QTButton onClick={duplicateCard}>
                            Duplicate
                        </QTButton>
                        <Box flexGrow={1} />
                        <Box display='flex' minHeight='100%' style={{ paddingRight: '0.5vw' }} justifyContent='center' alignItems='center'>
                            <Button onClick={handleDeleteCard} >
                                <DeleteIcon style={{ color: colours.DEEPRED }} />
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </CardActions>
        </Card>
    );
};

export default CollectionsCardCard;
