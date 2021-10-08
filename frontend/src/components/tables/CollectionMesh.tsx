import {
    Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';

import { ApiPromise } from '../../types';
import { CollectionOptions, EntityCollection } from '../../types/store';
import LoadingIndicator from '../content/LoadingIndicator';

import CollectionMeshHeader from './CollectionMeshHeader';
import { TableFilter } from './TableFilters';

const useStyles = makeStyles((theme) => ({
    tableWrapper: {
        overflowX: 'auto',
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
    },
    pagination: {
        width: '100%',
        marginTop: theme.spacing(0),
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
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
    leadingComponent?: React.ComponentType<{} & P>; // TODO use this in the table
    // The title of the table.
    title?: string;
    // Whether the collection supports searching.
    isSearchable?: boolean;
    // A list of filters to be used for filtering the collection.
    filters?: TableFilter[];
    // Additional actions displayed on the table header.
    headerActions?: React.ReactElement | null;
    // Whether to display an auto-incremented S/N column in the first column.
    showIndex?: boolean;

    rowProps?: Record<string, P>;
}

type Props = OwnProps<any>;

const CollectionMesh: React.FC<Props> = ({
    collection,
    isLoading,
    onUpdate,
    gridComponent: GridComponent,
    isSearchable,
    filters,
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
            />
            <Paper className={classes.tableWrapper}>
                {isLoading && (
                    <LoadingIndicator />
                )}
                {!isLoading &&
                    collection.ids.length !== 0 &&
                    collection.ids.map((id) => (
                        <GridComponent
                            key={id}
                            id={id}
                            {...rowProps}
                        />
                    ))
                }
            </Paper>
        </>
    );
};

export default CollectionMesh;
