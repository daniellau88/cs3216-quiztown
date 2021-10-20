import { Avatar, Button, ClickAwayListener, Menu, MenuItem, Typography, makeStyles } from '@material-ui/core';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import { UserData } from '../../../types/auth';
import { handleApiRequests } from '../../../utilities/ui';
import { logout } from '../operations';

interface Props {
    user: UserData;
}

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 3,
    },
    items: {
        marginLeft: 10,
        textAlign: 'left',
    },
    paper: {
        border: '1px solid',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
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
}));

const UserDetailComponent: React.FC<Props> = ({ user }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const menuOpen = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<Element>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleApiRequests(dispatch, dispatch(logout())).finally(() => {
            location.reload();
        });
        handleClose();
    };

    return (
        <div className={classes.root}>
            <ClickAwayListener onClickAway={handleClose}>
                <Button type="button" onClick={handleClick}>
                    <Avatar src={user.profile_picture_link} />
                    <Typography className={classes.items}>{user.name}</Typography>
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
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

        </div>
    );
};

export default UserDetailComponent;
