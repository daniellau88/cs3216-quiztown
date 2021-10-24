import { Button, ClickAwayListener, Menu, makeStyles } from '@material-ui/core';
import * as React from 'react';

import { headerSize } from '../../../components/utiltiies/constants';
import { NAV_BAR_HEIGHT } from '../../../layouts/AppLayout';

import GoogleSignOutMenuItem from './GoogleSignOutMenuItem';
import UserDetailComponent from './UserDetailComponent';

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
    root: {
        height: NAV_BAR_HEIGHT,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& > * > * > *': {
            paddingTop: '5px',
            paddingBottom: '5px',
            '& > * > * > * > *': {
                paddingTop: '5px',
                paddingBottom: '5px',
            },
        },
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.background.default,
    },
    button: {
        textTransform: 'none',
    },
}));

interface OwnProps {
    size?: headerSize;
}

const UserDetailMenu: React.FC<OwnProps> = ({ size }: OwnProps) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const menuOpen = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<Element>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <ClickAwayListener onClickAway={handleClose}>
                <Button type="button" onClick={handleClick} className={classes.button}>
                    <UserDetailComponent size={size} />
                </Button>
            </ClickAwayListener>
            <Menu
                className={classes.drawer}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                open={menuOpen}
                getContentAnchorEl={null}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <GoogleSignOutMenuItem size={size} />
            </Menu>

        </div>
    );
};

export default UserDetailMenu;
