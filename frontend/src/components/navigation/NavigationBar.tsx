import * as React from 'react';
import {
    makeStyles,
    Toolbar,
    Box,
    Container,
} from '@material-ui/core';
import NavigationBarTitle from './NavigationBarTitle';
import NavigationBarElements from './NavigationBarElements';

const useStyles = makeStyles(() => ({
    toolbar: {
        width: 'inherit',
    },
    grow: {
        flexGrow: 1,
    },
}));

const NavigationBar: React.FC<{}> = () => {
    const classes = useStyles();

    return (
        <>
            <Toolbar className={classes.toolbar}>
                <Container maxWidth='xl'>
                    <Box display='flex'>
                        <NavigationBarTitle text='QuizTown' size='h5' />
                        <Box className={classes.grow} />
                        <NavigationBarElements size='h5' flexGrow={0.05} />
                    </Box>
                </Container>
            </Toolbar>
        </>
    );
};

export default NavigationBar;
