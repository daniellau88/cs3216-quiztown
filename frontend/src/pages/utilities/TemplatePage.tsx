import * as React from 'react';
import {
    makeStyles,
    Box,
    Grid,
    Typography,
    CssBaseline,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '80px',
        paddingBottom: '80px',
    },
}));

const TemplatePage: React.FC<{}> = () => {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid>
                    <Typography>
                        uwu
                    </Typography>
                </Grid>
            </Box>
        </>
    );
};

export default TemplatePage;
