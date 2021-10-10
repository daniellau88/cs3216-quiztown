import {
    Box,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';

import { navBarHeight } from '../../layouts/AppLayout';
import colours from '../../utilities/colours';
import { headerSize } from '../utilities/constants';

const useStyles = makeStyles((theme) => ({
    root: {
        height: navBarHeight,
    },
    titleText: {
        color: theme.palette.text.primary,
        backgroundColor: 'inherit',
        textAlign: 'center',
        underline: 'none',
        '&:hover': {
            color: theme.palette.text.secondary,
        },
    },
    titleTextSelected: {
        color: theme.palette.text.secondary,
        backgroundColor: 'inherit',
        textAlign: 'center',
        underline: 'none',
    },
    titleLink: {
        textDecoration: 'none',
    },
    fill: {
        backgroundColor: colours.BLUE,
        height: '2px',
    },
}));

interface OwnProps {
    route: string,
    text: string,
    size?: headerSize,
    flexGrow: number,
    onMouseEnter?: (route: string) => void,
    onMouseLeave?: () => void,
}

type Props = OwnProps;

const NavigationBarElement: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const pathname = useLocation().pathname;
    const [isSelected, setIsSelected] = React.useState(false);

    const onMouseEnter = props.onMouseEnter ? props.onMouseEnter : () => { return; };
    const onMouseLeave = props.onMouseLeave ? props.onMouseLeave : () => { return; };

    React.useEffect(() => {
        setIsSelected(pathname === props.route);
    }, [pathname, props.route]);

    return (
        <Box flexGrow={props.flexGrow} className={classes.root} alignItems='center'>
            <Box display='flex' flexDirection='column' height='inherit' >
                <Box display='flex' flexGrow={1} />
                <Link
                    smooth
                    to={props.route}
                    className={classes.titleLink}
                    onMouseEnter={() => onMouseEnter(props.route)}
                    onMouseLeave={() => onMouseLeave()}>
                    <Typography
                        variant={props.size ? props.size : 'h4'}
                        className={isSelected ? classes.titleTextSelected : classes.titleText}>
                        {props.text}
                    </Typography>
                </Link>
                <Box display='flex' flexGrow={1} />
                {isSelected &&
                    <Box className={classes.fill} />
                }
            </Box>
        </Box>
    );
};

export default NavigationBarElement;
