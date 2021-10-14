import {
    Box,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { NAV_BAR_HEIGHT } from '../../layouts/AppLayout';
import colours from '../../utilities/colours';
import { headerSize } from '../utiltiies/constants';

const useStyles = makeStyles((theme) => ({
    root: {
        height: NAV_BAR_HEIGHT,
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
        height: '100%',
        width: '100%',
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
    flexGrow?: number,
    onMouseEnter?: (route: string) => void,
    onMouseLeave?: () => void,
    isDropdown?: boolean,
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
                <Link
                    to={props.route}
                    className={classes.titleLink}
                    onMouseEnter={() => onMouseEnter(props.route)}
                    onMouseLeave={() => onMouseLeave()}>
                    <Box display='flex' flexDirection='column' height='inherit' justifyContent='center'>
                        {!props.isDropdown && <Box display='flex' flexGrow={1} />}
                        <Typography
                            variant={props.size ? props.size : 'h4'}
                            align='center'
                            className={isSelected ? classes.titleTextSelected : classes.titleText}>
                            {props.text}
                        </Typography>
                        {!props.isDropdown && <Box display='flex' flexGrow={1} />}
                    </Box>
                </Link>
                {!props.isDropdown && isSelected &&
                    <Box className={classes.fill} />
                }
            </Box>
        </Box>
    );
};

export default NavigationBarElement;
