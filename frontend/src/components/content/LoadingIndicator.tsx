import { CircularProgress } from '@material-ui/core';
import * as React from 'react';

/**
 * A LoadingIndicator displays a centered loading spinner and
 * is used to indicate that content is being loaded in.
 */
const LoadingIndicator: React.FC<{}> = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <CircularProgress />
        </div>
    );
};

export default LoadingIndicator;
