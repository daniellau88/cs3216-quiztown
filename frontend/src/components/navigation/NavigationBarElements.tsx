import * as React from 'react';

import NavigationBarUserAuthElement from '../../modules/auth/components/NavigationBarUserAuthElement';
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
            <NavigationBarElement
                text='Info'
                route={routes.INFO}
                size={props.size}
                flexGrow={props.flexGrow}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
            />
            <NavigationBarUserAuthElement />
        </>
    );
};

export default NavigationBarElements;
