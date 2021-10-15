import {
    Box,
    CardMedia,
    Toolbar,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

import logo from '../../assets/images/logo512.png';
import { NAV_BAR_HEIGHT } from '../../layouts/AppLayout';
import PublicActivityPopup from '../../modules/publicActivities/components/PublicActivityPopup';

import NavigationBarDropdown from './NavigationBarDropdown';
import NavigationBarElements from './NavigationBarElements';
import NavigationBarTitle from './NavigationBarTitle';

const useStyles = makeStyles((theme) => ({
    toolbar: {
        width: 'inherit',
        minHeight: NAV_BAR_HEIGHT,
        maxHeight: NAV_BAR_HEIGHT,
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
    sectionSmall: {
        display: 'inherit',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    sectionLarge: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'inherit',
        },
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
                    <Box display='flex' justifyContent='flex-end' width='inherit' className={classes.sectionLarge}>
                        <NavigationBarElements size='h6' flexGrow={0.02} />
                    </Box>
                    <Box display='flex' justifyContent='flex-end' width='inherit' className={classes.sectionSmall}>
                        <NavigationBarDropdown />
                    </Box>
                    <Box>
                        <PublicActivityPopup />
                    </Box>
                </Box>
            </Toolbar>
        </>
    );
};

export default NavigationBar;
