import {
    Box,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

import Breadcrumbs from '../../../layouts/Breadcrumbs';
import CollectionTable from '../components/CollectionTable';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingBottom: '8vh',
    },
    header: {
        paddingBottom: 60,
    },
    table: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    headerText: {
        fontSize: '5vh',
    },
    subheaderText: {
        fontSize: '2vh',
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
                        { path: null, name: 'Discover' },
                    ]} />
                    <Grid container direction='column' className={classes.header}>
                        <Typography align='center' className={classes.headerText}>
                            See Other`&quot;`s Collections
                        </Typography>
                        <Typography align='center' className={classes.subheaderText}>
                            Pick one, add to your own collection and start revising!
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="space-between" spacing={6} className={classes.table} >
                            <CollectionTable isDiscoverCollections={true} />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default CollectionDiscoverPage;