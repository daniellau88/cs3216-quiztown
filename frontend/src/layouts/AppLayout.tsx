import {
    AppBar,
    Container,
    makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import * as React from 'react';

import ProgressDisplay from '../components/content/ProgressDisplay';
import NavigationBar from '../components/navigation/NavigationBar';

export const NAV_BAR_HEIGHT = '8vh';
export const NAV_BAR_HEIGHT_WITH_MARGIN = '12vh';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        height: NAV_BAR_HEIGHT,
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
        <Container className={classes.root} maxWidth='xl'>
            <AppBar position="fixed" className={classes.appBar}>
                <NavigationBar />
            </AppBar>
            <main className={clsx(classes.content, {})}>
                <ProgressDisplay />
                {props.children}
            </main>
        </Container>
    );
};

export default AppLayout;
