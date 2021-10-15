import {
    Box,
    Grid,
    ListItem,
    Typography,
    makeStyles,
} from '@material-ui/core';
import TimelineDot from '@material-ui/lab/TimelineDot';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { AppState, SelectionKey } from '../../../types/store';
import colours from '../../../utilities/colours';
import { dateToTimeSinceText, epochTimeToDate } from '../../../utilities/datetime';
import { getPublicActivityMiniEntity } from '../selectors';
import { getPublicActivityURL } from '../utils';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        padding: theme.spacing(1),
    },
    metadataSpan: {
        float: 'right',
        color: colours.GREY,
    },
    timelineDot: {
        margin: theme.spacing(1),
    },
    hiddenTimelineDot: {
        margin: theme.spacing(1),
        visibility: 'hidden',
    },
}));

interface OwnProps {
    id: SelectionKey;
    onClick: () => void;
}

type Props = OwnProps;

const PublicActivityPopupItem: React.FC<Props> = ({ id, onClick }: Props) => {
    const classes = useStyles();
    const history = useHistory();

    const publicActivity = useSelector((state: AppState) => getPublicActivityMiniEntity(state, id));

    if (!publicActivity) {
        return null;
    }

    const handleClick = () => {
        onClick();
        history.push(getPublicActivityURL(publicActivity));
        // TODO: send request to mark read
    };

    return (
        <ListItem className={classes.root} onClick={handleClick} alignItems="flex-start">
            <div>
                <Box sx={{ display: 'flex', p: 1, bgcolor: 'background.paper' }}>
                    <Box sx={{ flexGrow: 1 }}><Typography>{publicActivity.message}</Typography></Box>
                    <TimelineDot className={publicActivity.is_viewed ? classes.hiddenTimelineDot : classes.timelineDot} />
                </Box>
                <Typography className={classes.metadataSpan}>{dateToTimeSinceText(epochTimeToDate(publicActivity.created_at))}</Typography>
            </div>
        </ListItem>
    );
};

export default PublicActivityPopupItem;
