import { Divider } from '@material-ui/core';
import * as React from 'react';
import { useSelector } from 'react-redux';

import GoogleSignInButton from '../../modules/auth/components/GoogleSignInButton';
import GoogleSignOutMenuItem from '../../modules/auth/components/GoogleSignOutMenuItem';
import UserDetailComponent from '../../modules/auth/components/UserDetailComponent';
import { getIsAuthenticated } from '../../modules/auth/selectors';
import routes from '../../utilities/routes';

import NavigationBarElement from './NavigationBarElement';

const NavigationBarDropdownElements: React.FC = () => {
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <>
            {isAuthenticated &&
                <UserDetailComponent size='h6' />
            }
            {!isAuthenticated &&
                <GoogleSignInButton />
            }
            <Divider />

            <NavigationBarElement
                text='Discover'
                route={routes.COLLECTIONS.DISCOVER}
                size='h6'
                isDropdown={true}
            />
            {isAuthenticated &&
                <>
                    <NavigationBarElement
                        text='Collections'
                        route={routes.COLLECTIONS.INDEX}
                        size='h6'
                        isDropdown={true}
                    />
                    <NavigationBarElement
                        text='Starred'
                        route={routes.CARDS.SHOW_STARRED}
                        size='h6'
                        isDropdown={true}
                    />
                </>
            }
            <NavigationBarElement
                text='Info'
                route={routes.INFO}
                size='h6'
                isDropdown={true}
            />
            {isAuthenticated &&
                <>
                    <Divider />
                    <GoogleSignOutMenuItem size='h6' />
                </>
            }
        </>
    );
};

export default NavigationBarDropdownElements;
