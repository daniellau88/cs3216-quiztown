import { MenuItem, Typography, makeStyles } from '@material-ui/core';
import { googleLogout } from '@react-oauth/google';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { headerSize } from '../../../components/utiltiies/constants';
import { NAV_BAR_HEIGHT } from '../../../layouts/AppLayout';
import { handleApiRequests } from '../../../utilities/ui';
import { logout } from '../operations';

interface Props {
    size?: headerSize;
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: NAV_BAR_HEIGHT,
        justifyContent: 'center',
    },
}));

const GoogleSignOutMenuItemRef: React.ForwardRefRenderFunction<HTMLLIElement, Props> = ({ size = 'h4' }: Props, ref) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = () => {
        googleLogout();
        handleApiRequests(dispatch, dispatch(logout())).finally(() => {
            history.push('');
            location.reload();
        });
    };

    return (
        <MenuItem ref={ref} onClick={handleLogout} className={classes.root}>
            <Typography variant={size}>
                Logout
            </Typography>
        </MenuItem>
    );
};

const GoogleSignOutMenuItem = React.forwardRef<HTMLLIElement, Props>(GoogleSignOutMenuItemRef);

export default GoogleSignOutMenuItem;
