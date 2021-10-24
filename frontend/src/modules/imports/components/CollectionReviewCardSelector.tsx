import {
    Grid,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import Carousel from 'react-material-ui-carousel';

import colours from '../../../utilities/colours';

import CollectionReviewSlide from './CollectionReviewSlide';

const useStyles = makeStyles(() => ({
    container: {
        paddingTop: '15px',
        paddingBottom: '10px',
    },
    carousel: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
    },
    carouselButtonsWrapper: {
        '&:hover': {
            '& $carouselButtons': {
                backgroundColor: 'transparent',
                opacity: '1',
            },
        },
    },
    carouselButtons: {
        backgroundColor: 'transparent',
        color: colours.BLACK,
        borderRadius: 0,
        '&:hover': {
            backgroundColor: 'transparent',
            opacity: '1 !important',
        },
    },
    activeIndicator: {
        color: `${colours.BLUE} !important`,
    },
    indicator: {
        color: `${colours.LIGHTGREY}`,
        '&:hover': {
            color: `${colours.LIGHTBLUE}`,
        },
    },
}));

interface OwnProps {
    cardIds: number[]
    currCardId: number | undefined
    onSelect: (cardId: number) => void
    onDelete: (cardId: number) => any
}

type Props = OwnProps;

const CollectionReviewCardSelector: React.FC<Props> = ({ cardIds, onSelect, currCardId, onDelete }) => {
    const classes = useStyles();

    const ITEMS_PER_SLIDE = 4;
    const numSlides = Array.from({length: Math.ceil(cardIds.length / ITEMS_PER_SLIDE)}, (x, i) => (i + 1) * ITEMS_PER_SLIDE);

    return (
        <Grid container className={classes.container}>
            <Carousel
                className={classes.carousel}
                autoPlay={false}
                animation='slide'
                cycleNavigation={false}
                navButtonsAlwaysVisible={true}
                navButtonsWrapperProps={{ className: classes.carouselButtonsWrapper }}
                navButtonsProps={{ className: classes.carouselButtons }}
                indicatorIconButtonProps={{ className: classes.indicator}}
                activeIndicatorIconButtonProps={{ className: classes.activeIndicator}}
            >
                {
                    numSlides.map(endItemIdx => {
                        const cardIdsInSlide = cardIds.slice(endItemIdx - ITEMS_PER_SLIDE, endItemIdx);

                        return (
                            <CollectionReviewSlide
                                key={endItemIdx}
                                onSelect={onSelect}
                                cardIds={cardIdsInSlide}
                                currCardId={currCardId}
                                onDelete={onDelete}
                            />
                        );
                    })
                }
            </Carousel>
        </Grid>
    );
};

export default CollectionReviewCardSelector;
