import React from 'react';
import {
    makeStyles,
    Button,
    Typography,
} from '@material-ui/core';
import colours from '../utilities/colours';

const useStyles = makeStyles(() => ({
    padding: {
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
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
    },
}));

interface QTButtonProps {
    alert?:boolean
    outlined?:boolean
    onClick?: () => void
}

const QTButton: React.FC<QTButtonProps> = ({
    children,
    onClick,
    outlined=false,
    alert=false,
}) => {
    const classes = useStyles();

    return (
        <Button
            className={`
                ${classes.padding}
                ${alert ? classes.alertButton : classes.primaryButton}
                ${outlined ? classes.outlined : null}
            `}
            size='small'
            onClick={() => onClick && onClick()}
        >
            <Typography className={alert ? classes.alertText: classes.primaryText}>
                {children}
            </Typography>
        </Button>
    );
};

export default QTButton;
