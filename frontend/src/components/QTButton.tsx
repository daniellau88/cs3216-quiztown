import {
    Button,
    Typography,
    makeStyles,
} from '@material-ui/core';
import React from 'react';

import colours from '../utilities/colours';

const useStyles = makeStyles(() => ({
    padding: {
        paddingLeft: 2,
        paddingRight: 2,
    },
    primaryButton: {
        color: colours.BLUE,
        borderColor: colours.BLUE,
    },
    primaryText: {
        color: colours.BLUE,
    },
    alertButton: {
        color: colours.RED,
        borderColor: colours.RED,
    },
    alertText: {
        color: colours.RED,
    },
    outlined: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '10px',
    },
}));

interface QTButtonProps {
    alert?: boolean
    outlined?: boolean
    onClick?: () => void
    height?: string
    width?: string
}

const QTButton: React.FC<QTButtonProps> = ({
    children,
    onClick,
    outlined = false,
    alert = false,
    height = '5vh',
    width = '8vw',
}) => {
    const classes = useStyles();

    const ww = window.innerWidth;

    if (ww > 850) {
        width = '90px';
    }

    return (
        <Button
            className={`
                ${classes.padding}
                ${alert ? classes.alertButton : classes.primaryButton}
                ${outlined ? classes.outlined : null}
            `}
            style={{ minWidth: width, minHeight: height, maxWidth: width, maxHeight: height }}
            onClick={() => onClick && onClick()}
        >
            <Typography className={alert ? classes.alertText : classes.primaryText}>
                {children}
            </Typography>
        </Button>
    );
};

export default QTButton;
