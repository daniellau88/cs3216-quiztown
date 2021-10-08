import {
    Box,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

import CollectionCard from '../components/CollectionCard';
import CollectionTable from '../components/CollectionTable';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingTop: '80px',
        paddingBottom: '80px',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 60,
    },
}));

const CollectionPage: React.FC<{}> = () => {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Grid container direction='column' className={classes.header}>
                        <Typography variant='h3'>
                            My Collections
                        </Typography>
                        <Typography variant='h6'>
                            Each collection contains your handmate notes, pick one and start revising!
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="space-between" spacing={6}>
                            <CollectionTable />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default CollectionPage;
