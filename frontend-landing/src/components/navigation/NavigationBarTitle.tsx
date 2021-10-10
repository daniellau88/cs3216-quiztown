import {
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

import routes from '../../utilities/routes';
import { headerSize } from '../utilities/constants';

const useStyles = makeStyles((theme) => ({
    titleText: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.primary.main,
        underline: 'none',
        '&:hover': {
            color: theme.palette.text.secondary,
        },
    },
    titleLink: {
        textDecoration: 'none',
    },
}));

interface OwnProps {
    text: string,
    size: headerSize,
}

type Props = OwnProps;

const NavigationBarTitle: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    return (
        <Link smooth to={routes.MAIN} className={classes.titleLink}>
            <Typography variant={props.size} className={classes.titleText}>
                {props.text}
            </Typography>
        </Link>
    );
};

export default NavigationBarTitle;
