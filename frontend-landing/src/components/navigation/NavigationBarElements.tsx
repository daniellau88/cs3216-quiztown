import * as React from 'react';

import routes from '../../utilities/routes';
import { headerSize } from '../utilities/constants';

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
                text='About'
                route={routes.ABOUT}
                size={props.size}
                flexGrow={props.flexGrow}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
            />
            <NavigationBarElement
                text='FAQ'
                route={routes.FAQ}
                size={props.size}
                flexGrow={props.flexGrow}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
            />
        </>
    );
};

export default NavigationBarElements;
