import {
    Box,
    Grid,
    makeStyles,
} from '@material-ui/core';
import { Redo, Undo } from '@material-ui/icons';
import React from 'react';

import QTButton from '../../../components/QTButton';
import colours from '../../../utilities/colours';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        alignSelf: 'center',
        width: '80vw',
    },
    controlsContainer: {
        display: 'flex',
        paddingTop: '20px',
        paddingBottom: '20px',
        columnGap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${colours.GREY}`,
        borderRadius: 5,
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: 10,
        width: '100%',
    },
}));

interface OwnProps {
    undo: () => void;
    redo: () => void;
    addOption: () => void;
    deleteOption: () => void;
    mergeOption: () => void;
}

type Props = OwnProps;

const CollectionsImageCardEditControls: React.FC<Props> = ({
    undo,
    redo,
    addOption,
    deleteOption,
    mergeOption,
}) => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Grid container className={classes.controlsContainer} direction='row'>
                <QTButton outlined onClick={undo}>
                    <Undo />
                </QTButton>
                <QTButton outlined onClick={redo}>
                    <Redo />
                </QTButton>
                <QTButton outlined onClick={addOption}>
                    Add option
                </QTButton>
                <QTButton outlined onClick={deleteOption}>
                    Delete option
                </QTButton>
                <QTButton outlined onClick={mergeOption}>
                    Merge option
                </QTButton>
            </Grid>
        </Box>
    );

};


export default CollectionsImageCardEditControls;
