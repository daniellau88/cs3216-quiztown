import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    makeStyles,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import * as React from 'react';
import { Link, generatePath } from 'react-router-dom';

import { NAV_BAR_HEIGHT_WITH_MARGIN } from '../../layouts/AppLayout';
import colours from '../../utilities/colours';
import routes from '../../utilities/routes';

export const PROGRESS_DISPLAY_BAR_HEIGHT = '8vh';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: NAV_BAR_HEIGHT_WITH_MARGIN,
        marginBottom: 40,
        width: 'inherit',
        height: PROGRESS_DISPLAY_BAR_HEIGHT,
    },
    cardContent: {
        padding: theme.spacing(0),
        marginLeft: theme.spacing(5),
        marginRight: theme.spacing(5),
    },
    box: {
        height: PROGRESS_DISPLAY_BAR_HEIGHT,
    },
    padding: {
        marginTop: NAV_BAR_HEIGHT_WITH_MARGIN,
    },
    highlightText: {
        color: colours.BLUE,
    },
    link: {
        color: colours.BLACK,
        textDecoration: 'none',
        '&:hover': {
            color: colours.BLUE,
        },
    },
}));

const ProgressDisplay: React.FC<{}> = () => {
    const classes = useStyles();

    const isProcessing = true;
    const uploadName = 'test';
    const collectionId = 1;
    const isDone = true;

    if (!isProcessing) {
        return (
            <Box className={classes.padding} />
        );
    }

    return (
        <Card className={classes.root}>
            <CardContent className={classes.cardContent}>
                <Box display='flex' justifyContent='center' alignItems='center' className={classes.box}>
                    <Box justifyContent='center' alignItems='center'>
                        <Typography display='inline' variant="h6" component="div" >
                            {'Your upload of '}
                        </Typography>
                        <Typography display='inline' variant="h6" component="div" className={classes.highlightText}>
                            {uploadName}
                        </Typography>
                        <Typography display='inline' variant="h6" component="div" >
                            {' is '}{isDone ? 'done!' : 'in progress...'}
                        </Typography>
                    </Box>
                    <Box flexGrow={1} />
                    {isDone &&
                        <Button>
                            <Link to={generatePath(routes.COLLECTIONS.SHOW, { collectionId: collectionId })} className={classes.link}>
                                <Box display='flex' justifyContent='center' alignItems='center'>
                                    <Typography>
                                        Go To Collection
                                    </Typography>
                                    <ChevronRightIcon />
                                </Box>
                            </Link>
                        </Button>
                    }
                </Box>
            </CardContent>
        </Card >
    );
};

export default ProgressDisplay;
