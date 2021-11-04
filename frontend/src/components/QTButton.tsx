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
    outlined: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '10px',
    },
    button: {
        width: '80px',
        [theme.breakpoints.down('xs')]: {
            width: '40px',
        },
        [theme.breakpoints.between('xs', 'sm')]: {
            width: '60px',
        },
        [theme.breakpoints.between('sm', 'md')]: {
            width: '72px',
        },
        [theme.breakpoints.between('md', 'lg')]: {
            width: '80px',
        },
        [theme.breakpoints.up('lg')]: {
            width: '100px',
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
}

const QTButton: React.FC<QTButtonProps> = ({
    children,
    onClick,
    outlined = false,
    alert = false,
    height = '5vh',
    width = '8vw',
    textVariant = 'caption',
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
                ${classes.button}
            `}
            style={{ minHeight: height, maxHeight: height }}
            onClick={(e) => onClick && onClick(e)}
        >
            <Typography variant={textVariant} className={alert ? classes.alertText : classes.primaryText}>
                {children}
            </Typography>
        </Button>
    );
};

export default QTButton;
