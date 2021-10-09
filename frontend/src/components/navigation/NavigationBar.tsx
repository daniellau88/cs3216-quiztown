import {
    Box,
    CardMedia,
    Container,
    Toolbar,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

import logo from '../../assets/images/logo512.png';

import NavigationBarElements from './NavigationBarElements';
import NavigationBarTitle from './NavigationBarTitle';

const useStyles = makeStyles(() => ({
    toolbar: {
        width: 'inherit',
    },
    grow: {
        flexGrow: 1,
    },
    logo: {
        maxHeight: '32px',
        width: 'auto',
        marginRight: '12px',
    },
}));

const NavigationBar: React.FC<{}> = () => {
    const classes = useStyles();

    return (
        <>
            <Toolbar className={classes.toolbar}>
                <Container maxWidth='xl'>
                    <Box display='flex' justifyContent='center' alignItems='center'>
                        <CardMedia component='img' image={logo} className={classes.logo} />
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
