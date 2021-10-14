import {
    Box,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { CollectionPostData } from '../../../types/collections';
import { handleApiRequest, handleApiRequests } from '../../../utilities/ui';
import { addCollection } from '../../collections/operations';
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
    headerText: {
        fontSize: '5vh',
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

    const [beforeCreateCard, setBeforeCreateCard] = React.useState<(() => Promise<number>) | undefined>();

    const [collectionIdNumber, setCollectionIdNumber] = React.useState(0);

    React.useEffect(() => {
        if (collectionId == 'new') {
            const beforeCreateCardFunc = () => {
                const collectionPostDataCurrent: CollectionPostData = { name: 'Untitled collection', owner_id: 0 };
                return handleApiRequest(dispatch, dispatch(addCollection(collectionPostDataCurrent)))
                    .then((response) => {
                        console.log('response', response);
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

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Grid container direction='column' className={classes.header}>
                        {/* TODO: Replace hardcoded collection details */}
                        <Typography align='center' className={classes.headerText}>
                            CVS Physio 1
                        </Typography>
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
