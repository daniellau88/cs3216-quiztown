import {
    Box,
    CssBaseline,
    Grid,
    TextField,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import Breadcrumbs from '../../../layouts/Breadcrumbs';
import { CollectionPostData } from '../../../types/collections';
import { AppState } from '../../../types/store';
import routes from '../../../utilities/routes';
import { handleApiRequest } from '../../../utilities/ui';
import { addCollection, loadCollection, updateCollection } from '../../collections/operations';
import { getCollectionMiniEntity } from '../../collections/selectors';
import CollectionsCardTable from '../components/CollectionsCardTable';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingBottom: '8vh',
    },
    header: {
        paddingBottom: 60,
    },
    table: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    headerTextContainer: {
        justifySelf: 'center',
        alignSelf: 'center',
    },
    subheaderText: {
        fontSize: '2vh',
    },
}));

type Props = RouteComponentProps;

const CollectionsCardPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const collectionId: string = (params as { collectionId: string }).collectionId;
    const collection = useSelector((state: AppState) => getCollectionMiniEntity(state, parseInt(collectionId)));

    const [beforeCreateCard, setBeforeCreateCard] = React.useState<(() => Promise<number>) | undefined>();
    const [nameChangeTimeout, setNameChangeTimeout] = React.useState<NodeJS.Timeout | null>(null);
    const [collectionName, setCollectionName] = React.useState(collection ? collection.name : 'Untitled collection');
    const [collectionIdNumber, setCollectionIdNumber] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        handleApiRequest(dispatch, dispatch(loadCollection(parseInt(collectionId))))
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    React.useEffect(() => {
        if (collection && collectionName == 'Untitled collection') {
            setCollectionName(collection.name);
        }
    }, [collection]);

    React.useEffect(() => {
        if (collectionId == 'new') {
            const beforeCreateCardFunc = () => {
                const collectionPostDataCurrent: CollectionPostData = { name: 'Untitled collection' };
                return handleApiRequest(dispatch, dispatch(addCollection(collectionPostDataCurrent)))
                    .then((response) => {
                        const newId = response.payload.id;
                        history.replace(`/collections/${newId}`);
                        return newId;
                    })
                    .then((newId) => {
                        return newId;
                    })
                    .catch(() => {
                        return 0;
                    });
            };
            setBeforeCreateCard(() => beforeCreateCardFunc);
        } else {
            setCollectionIdNumber(parseInt(collectionId));
        }
    }, [collectionId]);

    const onCollectionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 20) {
            return;
        }
        setCollectionName(event.target.value);
        if (nameChangeTimeout) clearTimeout(nameChangeTimeout);
        const timeout = setTimeout(() => {
            if (!collection) return;

            const collectionPostData: CollectionPostData = { name: collectionName, owner_id: collection.owner_id};
            handleApiRequest(dispatch, dispatch(updateCollection(collection.id, collectionPostData)));
        }, 500);
        setNameChangeTimeout(timeout);
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Breadcrumbs links={[
                        { path: routes.COLLECTIONS.INDEX, name: 'Collections' },
                        { path: null, name: collection ? collection.name : 'Untitled collection' },
                    ]} />
                    <Grid container direction='column' className={classes.header}>
                        <Grid item className={classes.headerTextContainer}>
                            <TextField
                                id="name"
                                inputProps={{ style: { textAlign: 'center', fontSize: '5vh' } }}
                                value={collectionName}
                                onChange={onCollectionNameChange}
                            />
                        </Grid>

                        <Typography align='center' className={classes.subheaderText}>
                            Here are the cards in your collection, pick one to view or edit!
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="space-between" spacing={6} className={classes.table} >
                            <CollectionsCardTable collectionId={collectionIdNumber} beforeCreateCard={beforeCreateCard} />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default CollectionsCardPage;
