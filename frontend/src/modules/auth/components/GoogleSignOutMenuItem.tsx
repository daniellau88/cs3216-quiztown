import { MenuItem, Typography, makeStyles } from '@material-ui/core';
import * as React from 'react';
import { useGoogleLogout } from 'react-google-login';
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

const GoogleSignOutMenuItem = React.forwardRef<HTMLLIElement, Props>(({ size = 'h4' }: Props, ref) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const clientId = process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID;

    const handleLogout = () => {
        handleApiRequests(dispatch, dispatch(logout())).finally(() => {
            history.push('');
            location.reload();
        });
    };

    const { signOut, loaded } = useGoogleLogout({
        clientId: clientId ? clientId : '',
        onLogoutSuccess: handleLogout,
    });

    if (!clientId) {
        console.error('Client ID not initialized');
        return null;
    }

    return (
        <MenuItem ref={ref} onClick={signOut} className={classes.root}>
            <Typography variant={size}>
                Logout
            </Typography>
        </MenuItem>
    );
});

export default GoogleSignOutMenuItem;
