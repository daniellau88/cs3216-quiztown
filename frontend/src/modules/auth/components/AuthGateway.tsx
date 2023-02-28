import * as React from 'react';
import { GoogleLoginResponse, GoogleLoginResponseOffline, useGoogleLogin } from 'react-google-login';
import { useDispatch, useSelector } from 'react-redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { GoogleLoginPostData } from '../../../types/auth';
import { googleLogin, loadCurrentUser, resetCurrentUser, saveIsAuthenticated } from '../operations';
import { getCurrentUser, getIsAuthenticated } from '../selectors';

interface GoogleLoginProps {
    clientId: string;
    onSuccess: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
    onAutoLoadFinished: (isSignedIn: boolean) => void,
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ clientId, onSuccess, onAutoLoadFinished }: GoogleLoginProps) => {
    // Attempt login
    useGoogleLogin({
        onSuccess,
        clientId: clientId ? clientId : '',
        isSignedIn: true,
        onAutoLoadFinished: onAutoLoadFinished,
    });

    return null;
};

interface OwnProps {
    children?: React.ReactNode;
}

type Props = OwnProps;

const AuthGateway: React.FC<{}> = (props: Props) => {
    const dispatch = useDispatch();
    const clientId = process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID;

    const user = useSelector(getCurrentUser);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [isLoading, setIsLoading] = React.useState(true);
    React.useEffect(() => {
        // Set to false first
        dispatch(saveIsAuthenticated(false));

        if (!user) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
            dispatch(loadCurrentUser()).finally(() => {
                setIsLoading(false);
            });
        }
    }, []);

    const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ('tokenId' in response) {
            const token = response.tokenId;
            const loginPostData: GoogleLoginPostData = { token_id: token };
            return dispatch(googleLogin(loginPostData));
        }
    };

    const onAutoLoadFinished = (isSignedIn: boolean) => {
        // If not signed in to google, reset all user data
        if (!isSignedIn) {
            dispatch(resetCurrentUser());
            dispatch(saveIsAuthenticated(false));
        }
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (user && !isAuthenticated) {
        // Relogin when session timeout
        // When component is mounted, the login method will be called
        return (
            <>
                <p>Please check your connection status</p>
            </>
        );
    }

    return (
        <>
            {props.children}
        </>
    );
};

export default AuthGateway;
