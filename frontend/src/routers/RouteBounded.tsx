import * as React from 'react';
import { Route, RouteProps } from 'react-router-dom';

import ErrorBoundary from '../components/content/ErrorBoundary';

const RouteBounded: React.FC<RouteProps> = (props: RouteProps) => {
    const { exact, path, component } = props;

    // Math.random() is used to force re-rendering of ErrorBoundary.
    return (
        <Route
            exact={exact}
            path={path}
            render={(props) => <ErrorBoundary key={Math.random()}>{React.createElement(component!, props)}</ErrorBoundary>}
        />
    );
};

export default RouteBounded;
