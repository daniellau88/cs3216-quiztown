import {
    Box,
    Typography,
    makeStyles,
} from '@material-ui/core';
import LabelIcon from '@material-ui/icons/Label';
import * as React from 'react';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: 'auto',
        position: 'relative',
        display: 'inline-flex',
    },
    tagText: {
        textTransform: 'none',
        fontSize: '1.5vh',
        overflow: 'hidden',
        marginLeft: '6px',
    },
    tagIcon: {
        fontSize: '2.5vh',
    },
}));

interface OwnProps {
    collectionData: {
        tags: string[];
    };
}

type Props = OwnProps;

const CollectionTag: React.FC<Props> = ({ collectionData }) => {
    const classes = useStyles();

    if (collectionData.tags.length == 0) {
        return null;
    }

    return (
        <Box className={classes.root}>
            <LabelIcon className={`${classes.tagIcon}`} />
            <Typography
                className={`${classes.tagText}`}
                noWrap={true}
            >
                {[...collectionData.tags].join(', ')}
            </Typography>
        </Box>
    );
};

export default CollectionTag;
