import {
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import React from 'react';

import QTButton from '../../../components/QTButton';
import colours from '../../../utilities/colours';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingTop: '20px',
        paddingBottom: '20px',
        columnGap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${colours.GREY}`,
        borderRadius: 5,
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)',
        marginBottom: 10,
    },
}));

interface OwnProps {
    undo: () => void;
    redo: () => void;
    addOption: () => void;
    deleteOption: () => void;
}

type Props = OwnProps;

const CollectionsImageCardEditControls: React.FC<Props> = ({
    undo,
    redo,
    addOption,
    deleteOption,
}) => {
    const classes = useStyles();

    return (
        <>
            <Grid container className={classes.root} direction='row'>
                <Typography variant='h5'>
                    Inspecting Card 
                </Typography>
                <QTButton outlined onClick={addOption}>
                    New options
                </QTButton>
                <QTButton outlined onClick={deleteOption}>
                    Delete options
                </QTButton>
                <QTButton outlined onClick={undo}>
                    Undo
                </QTButton>
                <QTButton outlined onClick={redo}>
                    Redo
                </QTButton>
            </Grid>
        </>
    );

};


export default CollectionsImageCardEditControls;
