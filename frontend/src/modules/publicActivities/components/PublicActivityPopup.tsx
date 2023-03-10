import {
    Badge,
    ClickAwayListener,
    Divider,
    IconButton,
    List,
    ListItem,
    Paper,
    Popper,
    makeStyles,
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import { NAV_BAR_HEIGHT } from '../../../layouts/AppLayout';
import { PublicActivityMiniEntity } from '../../../types/publicActivities';
import { handleApiRequest } from '../../../utilities/ui';
import { loadRecentPublicActivities, subscribePublicActivity } from '../operations';
import { getRecentPublicActivities } from '../selectors';

import PublicActivityPopupItem from './PublicActivityPopupItem';

const useStyles = makeStyles((theme) => ({
    root: {
        height: NAV_BAR_HEIGHT,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    paper: {
        padding: theme.spacing(1),
    },
    popper: {
        minWidth: 250,
        maxWidth: 400,
        width: '30vw',
    },
}));

const PublicActivityPopup: React.FC<{}> = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [hasNewMessage, setHasNewMessage] = React.useState(false);

    const onMessage = (message: PublicActivityMiniEntity) => {
        setHasNewMessage(true);
    };

    React.useEffect(() => {
        dispatch(subscribePublicActivity(onMessage));
    }, []);

    const onUpdate = (dispatch: Dispatch) => {
        return handleApiRequest(dispatch, dispatch(loadRecentPublicActivities()))
            .then(() => {
                return true;
            });
    };

    const recentPublicActivityIds = useSelector(getRecentPublicActivities);

    React.useEffect(() => {
        onUpdate(dispatch);
    }, [dispatch]);

    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const open = Boolean(anchorEl);
    const anchorRef = React.useRef(null);

    const handleClose = () => {
        setHasNewMessage(false);
        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent) => {
        setHasNewMessage(false);
        setAnchorEl(event.currentTarget);
    };

    return (
        <div className={classes.root}>
            <IconButton
                color="inherit"
                ref={anchorRef}
                aria-controls={open ? 'notifications-popup' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <Badge variant="dot" color="error" invisible={!hasNewMessage}>
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            {open &&
                <ClickAwayListener onClickAway={handleClose}>
                    <Popper id={'notifications-popup'} className={classes.popper} open={open} anchorEl={anchorEl} placement='bottom-end' disablePortal>
                        <Paper className={classes.paper}>
                            <List>
                                {recentPublicActivityIds.map((id, index) => (
                                    <React.Fragment key={id}>
                                        {index > 0 ? <Divider /> : null}
                                        <PublicActivityPopupItem id={id} onClick={handleClose} />
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Popper>
                </ClickAwayListener >}
        </div>

    );
};

export default PublicActivityPopup;
