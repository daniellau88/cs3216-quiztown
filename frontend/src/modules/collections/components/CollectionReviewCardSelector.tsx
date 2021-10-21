import {
    CardMedia,
    Grid,
    makeStyles,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import * as React from 'react';
import Carousel from 'react-material-ui-carousel';

import colours from '../../../utilities/colours';

const useStyles = makeStyles(() => ({
    carousel: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '50vw',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(0, 0, 0, 0.1)',
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
    reviewItemContainer: {
        border: `1px solid ${colours.GREY}`,
        borderRadius: 5,
        height: '10vh',
        width: '10vw',
    },
    reviewItemMedia: {
        paddingLeft: '1vh',
        height: '8vh',
        width: 'auto',
    },
}));

const CollectionReviewItem: React.FC<{}> = () => {
    const classes = useStyles();

    return (
        <Grid container alignItems='center' justifyContent='center' className={classes.reviewItemContainer}>
            <Grid item xs={9}>
                <CardMedia
                    component="img"
                    alt="imported image"
                    className={classes.reviewItemMedia}
                    image={'https://picsum.photos/200/300'}
                />
            </Grid>
            <Grid item xs={3}>
                <Delete/>
            </Grid>
        </Grid>
    );
};

const CollectionReviewSlide: React.FC<{}> = () => {
    const MOCK_DATA = [
        {
            name: 'Random Name #1',
            description: 'Probably the most random thing you have ever seen!',
        },
        {
            name: 'Random Name #2',
            description: 'Hello World!',
        },
        {
            name: 'Random Name #2',
            description: 'Hello World!',
        },
    ];

    return (
        <Grid container direction='row' spacing={4}>
            {
                MOCK_DATA.map((item, idx) => (
                    <Grid item key={idx}>
                        <CollectionReviewItem/>
                    </Grid>
                ))
            }
        </Grid>

    );
};

interface OwnProps {
    saveChanges?: () => void
}

type Props = OwnProps;

const CollectionReviewCardSelector: React.FC<Props> = ({ saveChanges }) => {
    const classes = useStyles();

    const MOCK_DATA = [1,2,3,4,5];

    return (
        <Grid container>
            <Carousel
                className={classes.carousel}
                autoPlay={false}
                animation='slide'
                cycleNavigation={false}
                navButtonsAlwaysVisible={true}
                navButtonsWrapperProps={{ className: classes.carouselButtonsWrapper }}
                navButtonsProps={{ className: classes.carouselButtons }}
            >
                {
                    MOCK_DATA.map((item, idx) => (
                        <CollectionReviewSlide key={idx}/>
                    ))
                }
            </Carousel>
        </Grid>
    );
};

export default CollectionReviewCardSelector;
