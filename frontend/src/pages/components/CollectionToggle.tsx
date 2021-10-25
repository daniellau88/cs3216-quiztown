import {
    Button,
    Grid,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

import colours from '../../utilities/colours';
import { UndoneCardsMap } from '../HomePage';

const useStyles = makeStyles(() => ({
    collectionCard: {
        fontSize: '1.5vh',
        height: '100%',
        width: '10vw',
        borderRadius: '10px',
        border: '1px solid black',
        marginRight: '1vw',
        marginBottom: '1vh',
    },
    inactiveCollectionCard: {
        fontSize: '1.5vh',
        height: '100%',
        width: '10vw',
        borderRadius: '10px',
        border: '1px solid black',
        marginRight: '1vw',
        marginBottom: '1vh',
        backgroundColor: colours.LIGHTGREY,
    },
}));

interface OwnProps {
    collectionName: string,
    undoneCardsMap: UndoneCardsMap;
    onChange: (didActivate: boolean) => void;
}

type Props = OwnProps;

const CollectionToggle: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [active, setActive] = React.useState(!props.undoneCardsMap.inactive);

    const toggleActive = () => {
        setActive(!active);
        props.undoneCardsMap.inactive = !props.undoneCardsMap.inactive;
        props.onChange(!props.undoneCardsMap.inactive);
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    React.useEffect(() => {
    }, [active]);

    return (
        <>
            {props.undoneCardsMap.cards.length > 0 && (
                <Button className={props.undoneCardsMap.inactive ? classes.inactiveCollectionCard : classes.collectionCard} onClick={() => toggleActive()}>
                    <Grid container direction='column'>
                        <Grid item>
                            {props.collectionName}
                        </Grid>
                        <Grid item>
                            {props.undoneCardsMap.cards.length} cards
                        </Grid>
                    </Grid>
                </Button>
            )}
        </>
    );
};

export default CollectionToggle;
