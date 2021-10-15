import {
    ListItem,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { AppState, SelectionKey } from '../../../types/store';
import colours from '../../../utilities/colours';
import { dateToTimeSinceText, epochTimeToDate } from '../../../utilities/datetime';
import { getPublicActivityMiniEntity } from '../selectors';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
    },
    metadataSpan: {
        float: 'right',
        color: colours.GREY,
    },
}));

interface OwnProps {
    id: SelectionKey;
}

type Props = OwnProps;

const PublicActivityPopupItem: React.FC<Props> = ({ id }: Props) => {
    const classes = useStyles();

    const publicActivity = useSelector((state: AppState) => getPublicActivityMiniEntity(state, id));

    if (!publicActivity) {
        return null;
    }

    return (
        <ListItem>
            <div>
                <span>{publicActivity.message}</span><br />
                <span className={classes.metadataSpan}>{dateToTimeSinceText(epochTimeToDate(publicActivity.created_at))}</span>
            </div>
        </ListItem>
    );
};

export default PublicActivityPopupItem;
