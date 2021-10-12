import {
    Box,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

import { NAV_BAR_HEIGHT_WITH_MARGIN } from '../../layouts/AppLayout';

export const PROGRESS_DISPLAY_BAR_HEIGHT = '8vh';

const useStyles = makeStyles(() => ({
    padding: {
        marginTop: NAV_BAR_HEIGHT_WITH_MARGIN,
    },
}));

const NavBarGap: React.FC<{}> = () => {
    const classes = useStyles();
    return (
        <Box className={classes.padding} />
    );
};

export default NavBarGap;
