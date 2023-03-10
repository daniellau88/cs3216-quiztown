import {
    Grid,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';

import { ApiPromise } from '../../types';
import { CollectionOptions, EntityCollection } from '../../types/store';
import LoadingIndicator from '../content/LoadingIndicator';

import CollectionMeshHeader, { SortFilter } from './CollectionMeshHeader';
import { TableFilter } from './TableFilters';

const useStyles = makeStyles((theme) => ({
    pagination: {
        width: '100%',
        marginTop: theme.spacing(0),
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
    },
    card: {
        marginTop: theme.spacing(3),
        justifyContent: 'center',
        alignItems: 'center',
        height: '30vh',
        width: '30vh',
    },
    text: {
        paddingTop: '6vh',
        fontSize: '2vh',
    },
}));

interface OwnProps<P> {
    // The entity collection to be rendered by the table.
    collection: EntityCollection;
    // Whether the collection data is currently being loaded.
    isLoading: boolean;
    // A function that applies the given options and updates the collection.
    onUpdate: (options: CollectionOptions) => ApiPromise<EntityCollection>;
    // Grid component to be rendered
    gridComponent: React.ComponentType<{ id: number; index: number } & P>;
    // Append first element (add) to the mesh.
    leadingComponent?: React.ReactElement; // TODO use this in the table
    // The title of the table.
    title?: string;
    // Whether the collection supports searching.
    isSearchable?: boolean;
    // A list of filters to be used for filtering the collection.
    filters?: TableFilter[];
    // Whether the collection supports sorting.
    isSortable?: boolean;
    // A list of orderings to be used for sorting.
    orders?: SortFilter[];
    // Additional actions displayed on the table header.
    headerActions?: React.ReactElement | null;
    rowProps?: Record<string, P>;
}

type Props = OwnProps<any>;

const CollectionMesh: React.FC<Props> = ({
    collection,
    isLoading,
    onUpdate,
    gridComponent: GridComponent,
    leadingComponent,
    isSearchable,
    filters,
    isSortable,
    orders,
    rowProps,
}: Props) => {
    const classes = useStyles();

    return (
        <>
            <CollectionMeshHeader
                collection={collection}
                onUpdate={onUpdate}
                filters={filters}
                isSearchable={isSearchable}
                orders={orders}
                isSortable={isSortable}
            />
            <Grid container alignItems='center'>
                {isLoading && (
                    <LoadingIndicator />
                )}
                {!isLoading && leadingComponent &&
                    <Grid container item xs={12} md={6} lg={4} xl={3}
                        className={classes.card}
                    >
                        {leadingComponent}
                    </Grid>
                }
                {!isLoading &&
                    (collection.ids.length === 0 ?
                        <Typography className={classes.text}>
                            You have no collections or cards here at the moment. Add one now!
                        </Typography>
                        :
                        collection.ids.map((id) => (
                            <Grid container item
                                key={id}
                                xs={12} md={6} lg={4} xl={3}
                                justifyContent='center'
                                alignItems='center'
                                className={classes.card}
                            >
                                <GridComponent
                                    key={id}
                                    id={id}
                                    {...rowProps}
                                />
                            </Grid>
                        ))
                    )
                }
            </Grid>
        </>
    );
};

export default CollectionMesh;
