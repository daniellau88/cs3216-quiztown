import { Avatar, Box, Typography, makeStyles } from '@material-ui/core';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { headerSize } from '../../../components/utiltiies/constants';
import { getCurrentUser } from '../selectors';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3,
        paddingTop: 5,
        paddingBottom: 5,
    },
    items: {
        marginLeft: 10,
        textAlign: 'left',
    },
}));

interface OwnProps {
    size?: headerSize;
}

const UserDetailComponent: React.FC<OwnProps> = ({ size = 'h4' }: OwnProps) => {
    const user = useSelector(getCurrentUser);
    const classes = useStyles();

    if (!user) {
        return null;
    }

    return (
        <Box className={classes.root}>
            <Avatar src={user.profile_picture_link} />
            <Typography className={classes.items} variant={size}>{user.name}</Typography>
        </Box>
    );
};

export default UserDetailComponent;
