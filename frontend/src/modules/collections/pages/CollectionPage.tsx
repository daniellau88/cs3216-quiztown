import {
    Box,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import Breadcrumbs from '../../../layouts/Breadcrumbs';
import { handleApiRequest } from '../../../utilities/ui';
import CollectionTable from '../components/CollectionTable';
import { getAllCollectionTags } from '../operations';

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

const CollectionPage: React.FC<{}> = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    React.useEffect(() => {
        handleApiRequest(dispatch, dispatch(getAllCollectionTags()));
    }, [dispatch]);

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Breadcrumbs links={[
                        { path: null, name: 'Collections' },
                    ]} />
                    <Grid container direction='column' className={classes.header}>
                        <Typography align='center' className={classes.headerText}>
                            My Collections
                        </Typography>
                        <Typography align='center' className={classes.subheaderText}>
                            Each collection contains your hand-made notes, pick one and start revising!
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="space-between" spacing={6} className={classes.table} >
                            <CollectionTable />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default CollectionPage;
