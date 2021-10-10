import {
    Box,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import CollectionContentsTable from '../components/CollectionsContentsTable';


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
}));

type Props = RouteComponentProps;

const CollectionContentsPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const classes = useStyles();
    const collectionId:number = +(params as { collectionId: string }).collectionId.substring(1);

    console.log('collections contents page');

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Grid container direction='column' className={classes.header}>
                        <Typography variant='h3'>
                            CVS Physio 1
                        </Typography>
                        <Typography variant='h6'>
                            Here are the cards in your collection, pick one to view or edit!
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="space-between" spacing={6} className={classes.table} >
                            <CollectionContentsTable collectionId={collectionId}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default CollectionContentsPage;
