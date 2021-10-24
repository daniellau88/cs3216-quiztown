import * as React from 'react';
import { useSelector } from 'react-redux';

import GoogleSignInButton from '../../modules/auth/components/GoogleSignInButton';
import UserDetailMenu from '../../modules/auth/components/UserDetailMenu';
import { getIsAuthenticated } from '../../modules/auth/selectors';
import PublicActivityPopup from '../../modules/publicActivities/components/PublicActivityPopup';
import routes from '../../utilities/routes';
import { headerSize } from '../utiltiies/constants';

import NavigationBarElement from './NavigationBarElement';

interface OwnProps {
    size?: headerSize,
    flexGrow: number,
    onMouseEnter?: (route: string) => void,
    onMouseLeave?: () => void,
}

type Props = OwnProps;

const NavigationBarElements: React.FC<Props> = (props: Props) => {
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <>
            <NavigationBarElement
                text='Discover'
                route={routes.COLLECTIONS.DISCOVER}
                size={props.size}
                flexGrow={props.flexGrow}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
            />
            {isAuthenticated &&
                <>
                    <NavigationBarElement
                        text='Collections'
                        route={routes.COLLECTIONS.INDEX}
                        size={props.size}
                        flexGrow={props.flexGrow}
                        onMouseEnter={props.onMouseEnter}
                        onMouseLeave={props.onMouseLeave}
                    />
                    <NavigationBarElement
                        text='Starred'
                        route={routes.CARDS.SHOW_STARRED}
                        size={props.size}
                        flexGrow={props.flexGrow}
                        onMouseEnter={props.onMouseEnter}
                        onMouseLeave={props.onMouseLeave}
                    />
                </>
            }
            <NavigationBarElement
                text='Info'
                route={routes.INFO}
                size={props.size}
                flexGrow={props.flexGrow}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
            />
            {isAuthenticated &&
                <>
                    <PublicActivityPopup />
                    <UserDetailMenu size={props.size} />
                </>
            }
            {!isAuthenticated &&
                <GoogleSignInButton />
            }
        </>
    );
};

export default NavigationBarElements;
