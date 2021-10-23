import { MenuItem } from '@material-ui/core';
import * as React from 'react';
import { useGoogleLogout } from 'react-google-login';

interface GoogleSignOutMenuItemProps {
    onSuccess: () => void;
}

const GoogleSignOutMenuItem: React.FC<GoogleSignOutMenuItemProps> = React.forwardRef<HTMLLIElement, GoogleSignOutMenuItemProps>(({ onSuccess }: GoogleSignOutMenuItemProps, ref) => {
    const clientId = process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID;

    const { signOut, loaded } = useGoogleLogout({
        clientId: clientId ? clientId : '',
        onLogoutSuccess: onSuccess,
    });

    if (!clientId) {
        console.error('Client ID not initialized');
        return null;
    }

    return (
        <MenuItem ref={ref} onClick={signOut}>Logout</MenuItem>
    );
});

export default GoogleSignOutMenuItem;
