import {
    Box,
    CssBaseline,
    Grid,
    Input,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        paddingTop: '80px',
        paddingBottom: '80px',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 60,
    },
    input: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
    },
}));

const AddCollectionModal: React.FC<{}> = () => {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Grid container direction='column' className={classes.header}>
                        <Input className={classes.input}
                            // handleChange={updateSearchQuery} 
                            // value={query} 
                            placeholder="Untitled Collection" />
                    </Grid>

                    {/* <Grid item xs={12}>
                        <Grid container justifyContent="space-between" spacing={6}>
                            <CollectionTable />
                        </Grid>
                    </Grid> */}
                </Grid>
            </Box>
        </>
    );
};

export default AddCollectionModal;
