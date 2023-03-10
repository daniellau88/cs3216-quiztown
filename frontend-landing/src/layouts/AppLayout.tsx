import {
    AppBar,
    Box,
    makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import * as React from 'react';

import NavigationBar from '../components/navigation/NavigationBar';

export const navBarHeight = '8vh';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        height: navBarHeight,
        hidden: true,
    },
    content: {
        flexGrow: 1,
    },
}));

interface OwnProps {
    children?: React.ReactNode;
}

type Props = OwnProps;

const AppLayout: React.FC<{}> = (props: Props) => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <NavigationBar />
            </AppBar>
            <main className={clsx(classes.content, {})}>
                {props.children}
            </main>
        </Box>
    );
};

export default AppLayout;
