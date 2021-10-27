import { Grid, Typography } from '@material-ui/core';
import * as React from 'react';
import { Link } from 'react-router-dom';

import routes from '../../utilities/routes';

interface OwnProps {
    children?: React.ReactNode;
}

type Props = OwnProps;

// have to use class instead of hooks because hooks do not support componentDidCatch or equivalent.
class ErrorBoundary extends React.Component<{}, { error: Error | null; errorInfo: React.ErrorInfo | null }> {
    constructor(props: Props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
    }

    public render() {
        if (this.state.errorInfo) {
            return (
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h4">Something went wrong :( </Typography>
                    </Grid>
                    <Grid item>
                        <Typography>
                            Contact admin for assistance or <Link to={routes.ROOT}>go back to home page</Link>.
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="caption">
                            <details style={{ whiteSpace: 'pre-wrap' }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </details>
                        </Typography>
                    </Grid>
                </Grid>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
