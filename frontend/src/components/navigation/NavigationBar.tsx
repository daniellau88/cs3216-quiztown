import {
    Box,
    CardMedia,
    Toolbar,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

import logo from '../../assets/images/logo512.png';
import { navBarHeight } from '../../layouts/AppLayout';

import NavigationBarElements from './NavigationBarElements';
import NavigationBarTitle from './NavigationBarTitle';

const useStyles = makeStyles(() => ({
    toolbar: {
        width: 'inherit',
        minHeight: navBarHeight,
        maxHeight: navBarHeight,
    },
    toolbarBox: {
        width: 'inherit',
        height: 'inherit',
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
                <Box display='flex' justifyContent='center' alignItems='center' className={classes.toolbarBox}>
                    <CardMedia component='img' image={logo} className={classes.logo} />
                    <NavigationBarTitle text='QuizTown' size='h5' />
                    <Box className={classes.grow} />
                    <NavigationBarElements size='h6' flexGrow={0.02} />
                </Box>
            </Toolbar>
        </>
    );
};

export default NavigationBar;
