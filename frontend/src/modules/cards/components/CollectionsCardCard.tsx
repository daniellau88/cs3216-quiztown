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
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import defaultCollectionImage from '../../../assets/images/logo512.png';
import QTButton from '../../../components/QTButton';
import { CardMiniEntity, CardPostData } from '../../../types/cards';
import { AppState } from '../../../types/store';
import colours from '../../../utilities/colours';
import { handleApiRequest } from '../../../utilities/ui';
import { addCard, deleteCard, updateCard } from '../operations';
import { getCardEntity } from '../selectors';

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
    cardContent: {
        paddingTop: '1.5vh',
        paddingBottom: '0vh',
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
    const cardStarred = data?.flagged;
    const collectionId = data?.collection_id || id;
    // TODO: Update tags, or remove them if no tags are used in cards
    const cardTags = ['Tag1', 'Tag2'];

    const cardEntity = useSelector((state: AppState) => getCardEntity(state, cardId));

    const duplicateCard = () => {
        if (!cardEntity) return;
        const cardPostData: CardPostData = { ...cardEntity };
        return handleApiRequest(dispatch, dispatch(addCard(cardPostData)));
    };

    const openCard = () => {
        history.push(`/collections/${collectionId}/cards/${cardId}`);
    };

    const editCard = () => {
        history.push(`/collections/${collectionId}/cards/${cardId}/edit`);
    };

    const toggleStarred = () => {
        if (!data || !cardId) {
            return false;
        }
        const cardPostData: Partial<CardPostData> = { ...data, flagged: data.flagged ^ 1 };
        return handleApiRequest(dispatch, dispatch(updateCard(cardId, cardPostData)))
            .then(() => {
                return true;
            });
    };

    const handleDeleteCard = () => {
        if (!cardId) {
            return false;
        }
        return handleApiRequest(dispatch, dispatch(deleteCard(cardId)))
            .then(() => {
                return true;
            });
    };

    const addNewTextCard = () => {
        console.log(beforeRedirect);
        if (beforeRedirect) {
            return beforeRedirect().then((newId) => {
                if (newId) {
                    history.push(`/collections/${newId}/cards/newText`);
                }
            });
        } else {
            history.push(`/collections/${collectionId}/cards/newText`);
        }
    };

    const addNewImageCard = () => {
        console.log(beforeRedirect);
        if (beforeRedirect) {
            return beforeRedirect().then((newId) => {
                if (newId) {
                    history.push(`/collections/${newId}/cards/newImage`);
                }
            });
        } else {
            history.push(`/collections/${collectionId}/cards/newImage`);
        }
    };

    if (isAddCard) {
        return (
            <Card className={`${classes.root} ${classes.center}`}>
                <CardContent>
                    <Grid container className={classes.center}>
                        <Add className={classes.addIcon} onClick={addNewTextCard} />
                    </Grid>
                    <Typography className={classes.addCardText} component="div">
                        Add Text Card
                    </Typography>
                </CardContent>
                <CardContent>
                    <Grid container className={classes.center}>
                        <Add className={classes.addIcon} onClick={addNewImageCard} />
                    </Grid>
                    <Typography className={classes.addCardText} component="div">
                        Add Image Card
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={classes.root}>
            <Box className={classes.imageContainer}>
                <CardMedia
                    component="img"
                    image={data?.image_link || defaultCollectionImage}
                    style={ data ? { width: '100%' } : {} }
                    className={classes.collectionImage}
                />
            </Box>

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
                                <Star className={classes.cardIcon} />
                                :
                                <StarOutline className={classes.cardIcon} />
                            }
                        </Button>
                    </Box>
                </Grid>
            </CardContent>

            <CardActions>
                <Grid container alignItems='center' style={{ paddingLeft: '0.5vw' }}>
                    <Box display='flex' height='100%' width='100%'>
                        <Grid container item xs={3} alignItems='center'>
                            <QTButton outlined height='95%' width='95%' onClick={openCard}>
                            Test Me!
                            </QTButton>
                        </Grid>
                        <Grid container item xs={3} alignItems='center'>
                            <QTButton height='95%' width='95%' onClick={editCard}>
                            Edit
                            </QTButton>
                        </Grid>
                        <Grid container item xs={3} alignItems='center'>
                            <QTButton height='95%' width='95%' onClick={duplicateCard}>
                            Duplicate
                            </QTButton>
                        </Grid>
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
