import {
    Button,
    Typography,
    TypographyVariant,
    makeStyles,
} from '@material-ui/core';
import React from 'react';

import colours from '../utilities/colours';

const useStyles = makeStyles((theme) => ({
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
    disabledButton: {
        color: colours.GREY,
        borderColor: colours.GREY,
    },
    disabledText: {
        color: colours.GREY,
    },
    outlined: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '10px',
    },
    button: {
        width: '80px',
        [theme.breakpoints.down('xs')]: {
            // fit 8 characters
            width: '64px',
        },
        [theme.breakpoints.between('xs', 'sm')]: {
            // fit 9-10 characters
            width: '72px',
        },
        [theme.breakpoints.between('sm', 'md')]: {
            // fit 10 characters
            width: '80px',
        },
        [theme.breakpoints.between('md', 'lg')]: {
            // fit 11 characters
            width: '88px',
        },
        [theme.breakpoints.up('lg')]: {
            // fit 12 characters
            width: '96px',
        },
    },
}));

export interface QTButtonProps {
    alert?: boolean
    outlined?: boolean
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    height?: string
    width?: string
    textVariant?: TypographyVariant
    disabled?: boolean
}

const QTButton: React.FC<QTButtonProps> = ({
    children,
    onClick,
    outlined = false,
    alert = false,
    height = '5vh',
    width = '8vw',
    textVariant = 'caption',
    disabled = false,
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
                ${disabled ? classes.disabledButton : (alert ? classes.alertButton : classes.primaryButton)}
                ${outlined ? classes.outlined : null}
                ${classes.button}
            `}
            style={{ minHeight: height, maxHeight: height }}
            onClick={(e) => onClick && onClick(e)}
            disabled={disabled}
        >
            <Typography variant={textVariant} className={disabled ? classes.disabledText : alert ? classes.alertText : classes.primaryText}>
                {children}
            </Typography>
        </Button>
    );
};

export default QTButton;
