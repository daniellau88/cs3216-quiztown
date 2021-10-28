import {
    Button,
    CardMedia,
    Grid,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useSelector } from 'react-redux';

import QTDeleteButton from '../../../components/utiltiies/QTDeleteButton';
import { AppState } from '../../../types/store';
import colours from '../../../utilities/colours';
import { getCardMiniEntity } from '../../cards/selectors';

const useStyles = makeStyles(() => ({
    reviewItemContainer: {
        border: `1px solid ${colours.GREY}`,
        borderRadius: 5,
        height: '10vh',
        width: '10vw',
    },
    reviewItemMedia: {
        paddingLeft: '1vh',
        height: '8vh',
        width: '6vw',
    },
    selectedReviewItem: {
        border: `1px solid ${colours.BLUE} !important`,
        boxShadow: `0 1px 2px 0 ${colours.LIGHTBLUE}, 0 1px 3px 0 ${colours.LIGHTBLUE}`,
    },
    button: {
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
}));

interface OwnProps {
    cardId: number,
    onSelect: (cardId: number) => void
    onDelete: (cardId: number) => any
    isSelected: boolean,
}

type Props = OwnProps;

const CollectionReviewItem: React.FC<Props> = ({ cardId, onSelect, isSelected, onDelete }) => {
    const classes = useStyles();

    const card = useSelector((state: AppState) => getCardMiniEntity(state, cardId));
    const cardName = card?.name;

    const deleteMessage = `This action is irreversible. Are you sure you want to delete ${cardName}?`;

    if (!card) return null;

    return (
        <Grid
            container
            alignItems='center'
            justifyContent='center'
            className={`
                    ${classes.reviewItemContainer}
                    ${isSelected ? classes.selectedReviewItem : null}
                `}
        >
            <Grid item xs={8}>
                <Button onClick={() => onSelect(cardId)} className={classes.button}>
                    <CardMedia
                        component="img"
                        alt="imported image"
                        className={classes.reviewItemMedia}
                        image={card.image_link}
                    />
                </Button>
            </Grid>
            <Grid item xs={4}>
                <QTDeleteButton onConfirm={() => onDelete(cardId)} message={deleteMessage}/>
            </Grid>
        </Grid>
    );
};

export default CollectionReviewItem;
