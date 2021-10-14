import {
    Box,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

import StarredCardTable from '../components/StarredCardTable';

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

const CollectionsCardStarredPage: React.FC = () => {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Grid container direction='column' className={classes.header}>
                        <Typography align='center' className={classes.headerText}>
                            Starred Cards
                        </Typography>
                        <Typography align='center' className={classes.subheaderText}>
                            Here are the cards that you have starred!
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="space-between" spacing={6} className={classes.table} >
                            <StarredCardTable />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default CollectionsCardStarredPage;
