import {
    Box,
    Button,
    Grid,
    Menu,
    MenuItem,
    TextField,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import LabelIcon from '@material-ui/icons/Label';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import { CollectionPostData } from '../../../types/collections';
import colours from '../../../utilities/colours';
import { handleApiRequest } from '../../../utilities/ui';
import { updateCollection } from '../operations';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: 'auto',
        position: 'relative',
    },
    greyColor: {
        color: colours.GREY,
    },
    tagText: {
        textTransform: 'none',
        fontSize: '1.5vh',
        overflow: 'hidden',
        marginLeft: '6px',
    },
    tagIcon: {
        fontSize: '2.5vh',
    },
    tagContainer: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: '5px',
        border: `1px solid ${colours.GREY}`,
    },
    newTagText: {
        textTransform: 'none',
        fontSize: '1.5vh',
        overflow: 'hidden',
        paddingLeft: '4px',
        paddingRight: '4px',
    },
}));

interface OwnProps {
    activeTags: string[];
    allTags: string[];
    addTag: (newTag: string) => void;
    deleteTag: (deletedTag: string) => void;
}

type Props = OwnProps;

const CollectionTagSelector: React.FC<Props> = ({ activeTags, allTags, addTag, deleteTag }) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [currTags, setCurrTags] = React.useState(new Set(activeTags));
    const [availableTags, setAvailableTags] = React.useState(new Set(allTags));
    const [newTagName, setNewTagName] = React.useState('');

    const open = Boolean(anchorEl);

    const noSelectedTags = currTags.size === 0;


    React.useEffect(() => {
        setAvailableTags(new Set(allTags));
        setCurrTags(new Set(activeTags));
    }, [allTags.length, activeTags.length]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onNewTagNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currTagName = event.target.value;
        if (currTagName.length === 0) {
            setAvailableTags(new Set(allTags));
            setNewTagName(currTagName);
            return;
        }
        if (currTagName.length > 30) return;

        const newAvailableTags = new Set([...allTags].filter(tag => tag.includes(currTagName)));
        setNewTagName(currTagName);
        setAvailableTags(newAvailableTags);
    };

    const onCreateNewTag = () => {
        addTag(newTagName);
        setNewTagName('');
    };

    const shouldHideTagCreation = (): boolean => {
        const matchingTagNames = [...availableTags].filter(tag => tag.includes(newTagName));
        const isEmptyTagName = newTagName === '';
        const tagNameAlreadyExists = matchingTagNames.length === 1 && matchingTagNames[0] === newTagName;
        return isEmptyTagName || tagNameAlreadyExists;
    };

    return (
        <Box className={classes.root}>
            <Button
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <LabelIcon className={`${classes.tagIcon} ${noSelectedTags ? classes.greyColor : null}`}/>
                <Typography 
                    className={`${classes.tagText} ${noSelectedTags ? classes.greyColor : null}`}
                    noWrap={true}
                >
                    {noSelectedTags ? 'Add tags' : [...currTags].join(', ')}
                </Typography>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onKeyDown={(e) => e.stopPropagation()}>
                    <Grid container spacing={1} alignItems='center'>
                        {
                            [...currTags].map((tag, idx) => (
                                <Grid item key={idx}>
                                    <Box className={classes.tagContainer}>
                                        <Typography className={classes.tagText} noWrap={true}>
                                            {tag}
                                        </Typography>
                                        <Close fontSize={'small'} onClick={() => deleteTag(tag)}/>
                                    </Box>
                                </Grid>
                            ))
                        }
                        <Grid item>
                            <TextField
                                id="name"
                                autoFocus
                                inputProps={{ style: { fontSize: '1.8vh' } }}
                                value={newTagName}
                                onChange={onNewTagNameChange}
                                size={'small'}
                            />
                        </Grid>
                    </Grid>
                </MenuItem>
                {[...availableTags].map((tag, idx) => (
                    <MenuItem key={idx} onClick={() => addTag(tag)}>
                        <Typography className={classes.tagText} noWrap={true}>
                            {tag}
                        </Typography>
                    </MenuItem>
                ))}
                {!shouldHideTagCreation() &&
                <MenuItem onClick={onCreateNewTag}>
                    <Grid container alignItems='center' spacing={1}>
                        <Grid item>
                            <Typography className={classes.tagText}>Create:</Typography>
                        </Grid>
                        <Grid item>
                            <Box className={classes.tagContainer}>
                                <Typography className={classes.newTagText} noWrap={true}>
                                    {newTagName}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </MenuItem>
                }
            </Menu>
        </Box>
    );
};

export default CollectionTagSelector;
