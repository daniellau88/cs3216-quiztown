import {
    Box,
    CssBaseline,
    Grid,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

import Breadcrumbs from '../../../layouts/Breadcrumbs';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingBottom: '8vh',
    },
}));

const CollectionDiscoverPage: React.FC<{}> = () => {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Breadcrumbs links={[
                        { path: null, name: 'Collections' },
                    ]} />
                    To be implemented
                </Grid>
            </Box>
        </>
    );
};

export default CollectionDiscoverPage;