import { Avatar, Typography, makeStyles } from '@material-ui/core';
import * as React from 'react';

import { UserData } from '../../../types/auth';

interface Props {
    user: UserData;
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 3,
    },
    items: {
        marginLeft: 15,
    },
}));

const UserDetailComponent: React.FC<Props> = ({ user }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Avatar src={user.profile_picture_link} />
            <Typography className={classes.items}>{user.name}</Typography>
        </div>
    );
};

export default UserDetailComponent;
