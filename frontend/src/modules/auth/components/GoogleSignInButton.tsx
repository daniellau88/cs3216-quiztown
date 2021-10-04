import * as React from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

interface GoogleSignInButtonProps {
    onSuccess: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
    onFailure?: (error: any) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSuccess, onFailure }) => {
    const clientId = process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID;
    if (!clientId) {
        console.error('Client ID not initialized');
        return null;
    }

    return (
        <GoogleLogin
            clientId={clientId}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
        />
    );
};

export default GoogleSignInButton;
