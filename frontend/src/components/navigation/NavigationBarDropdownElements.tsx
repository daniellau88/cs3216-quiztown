import * as React from 'react';

import routes from '../../utilities/routes';

import NavigationBarElement from './NavigationBarElement';

const NavigationBarDropdownElements: React.FC = () => {
    return (
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
            <NavigationBarElement
                text='Test[Dev]'
                route={routes.TEST}
                size='h6'
                isDropdown={true}
            />
        </>
    );
};

export default NavigationBarDropdownElements;
