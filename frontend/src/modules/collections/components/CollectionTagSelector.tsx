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
import { useDispatch, useSelector } from 'react-redux';

import { CollectionPostData } from '../../../types/collections';
import { AppState } from '../../../types/store';
import colours from '../../../utilities/colours';
import { handleApiRequest } from '../../../utilities/ui';
import { getAllCollectionTags, updateCollection } from '../operations';
import { getAllCollections, getAllTags } from '../selectors';

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
    collectionData: {
        id?: number; // ID doesn't yet exist for new collection creation
        tags: string[];
    };
    tagSelectorRef?: React.MutableRefObject<string[]>;
}

type Props = OwnProps;

const CollectionTagSelector: React.FC<Props> = ({ collectionData, tagSelectorRef }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const possibleTags = useSelector((state: AppState) => getAllTags(state));

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [currTags, setCurrTags] = React.useState(new Set(collectionData.tags));
    const [availableTagOptions, setAvailableTagOptions] = React.useState<Set<string>>(new Set(possibleTags));
    const [allPossibleTags, setAllPossibleTags] = React.useState<Set<string>>(new Set(possibleTags));
    const [newTagName, setNewTagName] = React.useState('');

    const open = Boolean(anchorEl);

    const noSelectedTags = currTags.size === 0;

    React.useEffect(() => {
        setAvailableTagOptions(new Set(possibleTags));
        setAllPossibleTags(new Set(possibleTags));
    }, [possibleTags.length]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onNewTagNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currTagName = event.target.value;
        if (currTagName.length === 0) {
            setAvailableTagOptions(new Set(allPossibleTags));
            setNewTagName(currTagName);
            return;
        }
        if (currTagName.length > 30) return;

        const newAvailableTags = new Set([...allPossibleTags].filter(tag => tag.includes(currTagName)));
        setNewTagName(currTagName);
        setAvailableTagOptions(newAvailableTags);
    };

    const deleteTag = (deletedTag: string) => {
        const updatedCurrTags = new Set(currTags);
        updatedCurrTags.delete(deletedTag);
        const updatedCurrTagsArr = [...updatedCurrTags];

        setCurrTags(new Set(updatedCurrTagsArr));

        if (collectionData.id) {
            const collectionPostData: Partial<CollectionPostData> = { tags: updatedCurrTagsArr };
            handleApiRequest(dispatch, dispatch(updateCollection(collectionData.id, collectionPostData)));
        }
        if (tagSelectorRef) {
            tagSelectorRef.current = [...updatedCurrTags];
        }
    };

    const addTag = (newTag: string) => {
        const updatedCurrTags = new Set(currTags);
        const updatedAllPossibleTags = new Set(allPossibleTags);
        updatedCurrTags.add(newTag);
        updatedAllPossibleTags.add(newTag);
        const updateAllTagsArr = [...updatedAllPossibleTags];
        const updatedCurrTagsArr = [...updatedCurrTags];

        setAllPossibleTags(new Set(updateAllTagsArr));
        setCurrTags(new Set(updatedCurrTagsArr));

        if (collectionData.id) {
            const collectionPostData: Partial<CollectionPostData> = { tags: updatedCurrTagsArr };
            handleApiRequest(dispatch, dispatch(updateCollection(collectionData.id, collectionPostData)));
        }
        if (tagSelectorRef) {
            tagSelectorRef.current = [...updatedCurrTags];
        }
    };

    const onCreateNewTag = () => {
        addTag(newTagName);
        setNewTagName('');
    };

    const shouldHideTagCreation = (): boolean => {
        const matchingTagNames = [...availableTagOptions].filter(tag => tag.includes(newTagName));
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
                <LabelIcon className={`${classes.tagIcon} ${noSelectedTags ? classes.greyColor : null}`} />
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
                                        <Close fontSize={'small'} onClick={() => deleteTag(tag)} />
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
                {[...availableTagOptions].map((tag, idx) => (
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
