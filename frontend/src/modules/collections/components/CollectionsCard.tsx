import {
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import * as React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import QTButton from '../../../components/QTButton';
import { CollectionsCardMiniEntity } from '../../../types/collections';
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
    data?: CollectionsCardMiniEntity;
    isAddCard?: boolean;
    id?: number;
}

type Props = OwnProps;

const CollectionsCard: React.FC<Props> = ({ data, isAddCard=false, id }: Props) => {
    const classes = useStyles();
    const history = useHistory();
    const collectionName = data?.name;
    const cardId = data?.id;
    const collectionId = data?.collection_id || id;

    // TODO: Implement functions
    const duplicateCard = () => {
        console.log('Duplicate');
    };

    const openCard = () => {
        history.push(`/collections/:${collectionId}/cards/:${cardId}`);
    };

    const editCard = () => {
        console.log('Edit');
    };

    const deleteCard = () => {
        console.log('Delete');
    };

    const addNewCard = () => {
        history.push(`/collections/:${collectionId}/cards/new`);
    };

    if (isAddCard) {
        return (
            <Card className={`${classes.root} ${classes.center}`} onClick={addNewCard}>
                <CardContent>
                    <Grid container className={classes.center}>
                        <Add className={classes.addIcon} />
                    </Grid>
                    <Typography gutterBottom variant="h5" component="div">
                        Add Card
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={classes.root}>
            <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="div" >
                    {collectionName}
                </Typography>
            </CardContent>

            <CardActions>
                <QTButton outlined onClick={openCard}>Open</QTButton>
                {/* <QTButton outlined onClick={duplicateCard}>Duplicate to other collection</QTButton> */}
                <QTButton onClick={editCard}>Edit</QTButton>
                <QTButton alert onClick={deleteCard}>Delete</QTButton>
            </CardActions>
        </Card>
    );
};

export default CollectionsCard;
