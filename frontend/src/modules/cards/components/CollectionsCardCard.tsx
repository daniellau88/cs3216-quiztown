import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import Star from '@material-ui/icons/Star';
import StarOutline from '@material-ui/icons/StarOutline';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import defaultCollectionImage from '../../../assets/images/defaultCardImage.jpg';
import QTButton from '../../../components/QTButton';
import { STATIC_URL } from '../../../components/utiltiies/constants';
import { CardMiniEntity, CardPostData } from '../../../types/cards';
import { AppState } from '../../../types/store';
import colours from '../../../utilities/colours';
import { handleApiRequest } from '../../../utilities/ui';
import { addCard, deleteCard, updateCard } from '../operations';
import { getCardEntity } from '../selectors';

const useStyles = makeStyles(() => ({
    root: {
        width: '95%',
        height: '95%',
    },
    addCardRoot: {
        display: 'flex',
        width: '95%',
        height: '95%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        display: 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        fontSize: '10vh',
        color: colours.BLUE,
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
        paddingBottom: '3vh',
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
    addCardContent: {
        height: '100%',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
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

    const cardId = data?.id;
    const cardEntity = useSelector((state: AppState) => getCardEntity(state, cardId));
    const collectionId = data?.collection_id || id;

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
            <Card className={classes.addCardRoot}>
                <Box display='flex' style={{ height: '100%', width: '100%' }}>
                    <Box className={classes.addCardContent} onClick={addNewTextCard}>
                        <Grid container className={classes.center} direction='column'>
                            <Add className={classes.addIcon} />
                            <Typography align='center' className={classes.addCardText} component="div">
                                Add Text Card
                            </Typography>
                        </Grid>
                    </Box>
                    <Divider orientation='vertical' />
                    <Box className={classes.addCardContent} onClick={addNewImageCard}>
                        <Grid container className={classes.center} direction='column'>
                            <Add className={classes.addIcon} />
                            <Typography align='center' className={classes.addCardText} component="div">
                                Add Image Card
                            </Typography>
                        </Grid>
                    </Box>
                </Box>
            </Card>
        );
    }

    if (!data) {
        return null;
    }

    const cardName = data?.name;
    const cardStarred = data?.flagged;

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

    return (
        <Card className={classes.root}>
            <Box className={classes.imageContainer}>
                <CardMedia
                    component="img"
                    image={data?.image_link && data.image_link != (STATIC_URL + 'cards/') ? data?.image_link : defaultCollectionImage}
                    style={data ? { width: '100%' } : {}}
                    className={classes.collectionImage}
                />
            </Box>

            <CardContent className={classes.cardContent}>
                <Grid container alignItems='center'>
                    <Box display='flex' height='100%' width='100%'>
                        <Typography className={classes.cardNameText} component="div" >
                            {cardName ? cardName : 'Untitled Card'}
                        </Typography>
                        <Box flexGrow={1} />
                        {data.permissions.can_update &&
                            <Button onClick={toggleStarred}>
                                {cardStarred ?
                                    <Star className={classes.cardIcon} />
                                    :
                                    <StarOutline className={classes.cardIcon} />
                                }
                            </Button>
                        }
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
                        {data.permissions.can_update &&
                            <Grid container item xs={3} alignItems='center'>
                                <QTButton height='95%' width='95%' onClick={editCard}>
                                    Edit
                                </QTButton>
                            </Grid>
                        }
                        <Grid container item xs={3} alignItems='center'>
                            <QTButton height='95%' width='95%' onClick={duplicateCard}>
                                Duplicate
                            </QTButton>
                        </Grid>
                        <Box flexGrow={1} />
                        {data.permissions.can_delete &&
                            <Box display='flex' minHeight='100%' style={{ paddingRight: '0.5vw' }} justifyContent='center' alignItems='center'>
                                <Button onClick={handleDeleteCard} >
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

export default CollectionsCardCard;
