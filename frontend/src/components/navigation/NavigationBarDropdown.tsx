import { ClickAwayListener, IconButton, Menu, Toolbar, makeStyles } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { getIsAuthenticated } from '../../modules/auth/selectors';
import PublicActivityPopup from '../../modules/publicActivities/components/PublicActivityPopup';

import NavigationBarDropdownElements from './NavigationBarDropdownElements';

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
    toolbar: {
        display: 'flex',
        paddingRight: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        ...theme.mixins.toolbar,
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
    menuButton: {
    },
}));

const NavigationBarDropdown: React.FC = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);

    const toggleMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(!menuOpen);
    };
    return (
        <>
            {isAuthenticated &&
                <PublicActivityPopup />
            }
            <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </ClickAwayListener>
            <Menu
                className={classes.drawer}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                open={menuOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div>
                    <NavigationBarDropdownElements />
                </div>
            </Menu>
        </>
    );
};

export default NavigationBarDropdown;
