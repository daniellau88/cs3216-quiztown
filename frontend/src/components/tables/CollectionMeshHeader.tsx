import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';

import { ApiPromise } from '../../types';
import { CollectionOptions, EntityCollection } from '../../types/store';
import SearchInput from '../fields/SearchInput';

import TableFilters, { TableFilter } from './TableFilters';


const useStyles = makeStyles((theme) => ({
    firstRow: {
        width: '100%',
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
    },
    secondRow: {
        width: '100%',
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
    },
    title: {
        padding: '10px 0 16px 10px',
    },
    search: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
    },
    lastItem: {
        marginLeft: 'auto',
    },
}));

interface OwnProps {
    // The entity collection to be rendered by the parent table.
    collection: EntityCollection;
    // A function that applies the given options and updates the collection.
    onUpdate: (options: CollectionOptions) => ApiPromise<EntityCollection>;
    // The title of the table.
    title?: string;
    // Whether the collection supports searching.
    isSearchable?: boolean;
    // Additional actions displayed on the table header.
    actions?: React.ReactElement | null;
    // A list of filters to be used for filtering the collection.
    filters?: TableFilter[];
}

const CollectionMeshHeader: React.FC<OwnProps> = ({ collection, onUpdate, filters, isSearchable }: OwnProps) => {
    const classes = useStyles();
    const [query, setQuery] = React.useState(collection.search);
    const [timerId, setTimerId] = React.useState<number | null>(null);

    const setFilters = (activeFilters: Record<string, any>) => onUpdate({ filters: activeFilters });

    const updateSearchQuery = (e: React.ChangeEvent<any>) => {
        if (timerId) {
            clearTimeout(timerId);
        }

        const newQuery = e.target.value;
        setQuery(newQuery);

        const newTimerId = window.setTimeout(() => {
            onUpdate({ search: newQuery });
        }, 450);

        setTimerId(newTimerId);
    };

    const searchElement = isSearchable ? (
        <Grid item xs={12} md={6} lg={5} xl={4}>
            <SearchInput className={classes.search} handleChange={updateSearchQuery} value={query} placeholder="Search..." />
        </Grid>
    ) : null;

    return (
        <>
            <Grid className={classes.firstRow} container justify="space-between" spacing={0}>
                {searchElement}
            </Grid>
            {filters && filters.length > 0 && (
                <TableFilters collection={collection} filters={filters} onUpdate={setFilters} />
            )}
        </>
    );
};

export default CollectionMeshHeader;
