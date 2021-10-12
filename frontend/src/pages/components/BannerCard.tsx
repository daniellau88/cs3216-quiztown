import {
    Card,
    CardContent,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

import { CollectionMiniEntity } from '../../types/collections';
import { UndoneCardsMap } from '../HomePage';

import CollectionToggle from './CollectionToggle';

const useStyles = makeStyles(() => ({
    mainCard: {
        display: 'flex',
        borderRadius: '20px',
        width: '100%',
    },
    cardContent: {
        paddingLeft: '2vw',
    },
    headerText: {
        fontSize: '4vh',
        paddingBottom: '3vh',
    },
    subheaderText: {
        fontSize: '2vh',
        paddingBottom: '2vh',
    },
    collectionCards: {
        height: '6vh',
        width: '100%',
    },
}));

interface OwnProps {
    undoneCardsMaps: UndoneCardsMap[];
    collections: CollectionMiniEntity[];
}

type Props = OwnProps;

const BannerCard: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [collectionCount, setCollectionCount] = React.useState(props.collections.length);

    const undoneCardsMaps = props.undoneCardsMaps;

    const totalUndone: number = undoneCardsMaps.filter(map => !map.inactive).reduce((prev, curr) => prev + curr.cards.length, 0);

    const onUpdate = (didActivate: boolean) => {
        setCollectionCount(collectionCount + (didActivate ? 1 : -1));
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    React.useEffect(() => {
    }, [collectionCount]);

    return (
        <>
            <Card className={classes.mainCard}>
                <CardContent className={classes.cardContent}>
                    <Grid>
                        <Typography className={classes.headerText}>
                            You have {totalUndone} card{totalUndone == 1 ? '' : 's'} from {collectionCount} collection{collectionCount == 1 ? '' : 's'} to revisit today!
                        </Typography>
                        <Typography className={classes.subheaderText}>
                            Click to activate or deactivate collections to customise your learning!
                        </Typography>
                        <Grid container className={classes.collectionCards}>
                            {props.undoneCardsMaps.map((undoneCardsMap) => {
                                return <CollectionToggle
                                    key={undoneCardsMap.collectionId}
                                    collectionName={props.collections.filter(collection => collection.id == undoneCardsMap.collectionId)[0].name}
                                    undoneCardsMap={undoneCardsMap}
                                    onChange={(didActivate) => onUpdate(didActivate)}
                                />;
                            })}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
};

export default BannerCard;
