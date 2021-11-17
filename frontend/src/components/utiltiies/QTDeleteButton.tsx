import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography, makeStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import * as React from 'react';

import colours from '../../utilities/colours';

interface OwnProps {
    onConfirm: () => any;
    message: string;
}

type Props = OwnProps;

const useStyles = makeStyles((theme) => ({
    deleteButton: {
        color: colours.DEEPRED,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    deleteText: {
        color: colours.RED,
    },
}));

const DeleteButton: React.FC<Props> = ({ onConfirm, message }: Props) => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton
                aria-label="delete"
                className={classes.deleteButton}
                onClick={handleClickOpen}
            >
                <Delete />
            </IconButton>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onConfirm}>
                        <Typography className={classes.deleteText}>
                            Delete
                        </Typography>
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteButton;
