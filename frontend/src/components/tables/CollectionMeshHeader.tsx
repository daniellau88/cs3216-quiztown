import { Button, Checkbox, FormControl, Grid, Input, InputLabel, ListItemText, MenuItem, Select, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { isBrowser } from 'react-device-detect';

import { ApiPromise } from '../../types';
import { CollectionOptions, EntityCollection } from '../../types/store';
import SearchInput from '../fields/SearchInput';

import TableFilters, { TableFilter } from './TableFilters';

export type SortFilter = {
    name: string,
    order: string,
}

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
    sort: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
        marginBottom: '1vh',
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
    // Whether the collection supports sorting.
    isSortable?: boolean;
    // A list of orderings to be used for sorting.
    orders?: SortFilter[];
}

const CollectionMeshHeader: React.FC<OwnProps> = ({ collection, onUpdate, filters, isSearchable, orders, isSortable }: OwnProps) => {
    const classes = useStyles();
    const [query, setQuery] = React.useState(collection.search);
    const [order, setOrder] = React.useState(collection.sortBy);
    const [direction, setDirection] = React.useState(collection.sortOrder);
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
    console.log(order);

    const updateSortQuery = (e: React.ChangeEvent<any>) => {
        const newOrder = e.target.value;
        setOrder(newOrder);
        onUpdate({ sortBy: newOrder });
    };

    const toggleSortDirection = () => {
        const newDirection = direction == 'asc' ? 'desc' : 'asc';
        setDirection(newDirection);
        onUpdate({ sortOrder: newDirection });
    };

    const searchElement = isSearchable ? (
        <Grid item xs={12} md={6} lg={5} xl={4} style={{ maxWidth: isBrowser ? '40vw' : '90vw', paddingLeft: '1vw' }}>
            <SearchInput className={classes.search} handleChange={updateSearchQuery} value={query} placeholder="Search..." />
        </Grid>
    ) : null;

    const sortOrderElement = isSortable ? (
        <Grid item xs={12} md={6} lg={5} xl={4} style={{ maxWidth: '45vw', paddingLeft: '1vw' }}>
            <FormControl fullWidth>
                <Select
                    value={order}
                    onChange={(event) => {
                        updateSortQuery(event);
                    }}
                    displayEmpty
                    fullWidth
                    input={<Input />}
                    label={order}
                >
                    {orders?.map((order) => (
                        <MenuItem key={order.order} value={order.order}>
                            <ListItemText primary={order.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    ) : null;

    const sortDirectionElement = isSortable ? (
        <Grid item xs={12} md={6} lg={5} xl={4} style={{ maxWidth: '45vw', paddingLeft: '1vw' }}>
            <Button onClick={toggleSortDirection}>
                <Typography>
                    {direction == 'asc' ? 'Ascending' : 'Descending'}
                </Typography>
            </Button>
        </Grid >
    ) : null;

    return (
        <>
            {isBrowser ? (
                <Grid className={classes.firstRow} container justifyContent="space-between" direction='row' spacing={0}>
                    <Grid container direction='column' spacing={1} style={{ maxWidth: '40vw' }}>
                        {searchElement}
                        <Grid container direction='row' style={{ minWidth: '40vw', maxWidth: '40vw' }} alignItems='center'>
                            {sortOrderElement}
                            {sortDirectionElement}
                        </Grid>
                    </Grid>
                    {filters && filters.length > 0 && (
                        <TableFilters collection={collection} filters={filters} onUpdate={setFilters} />
                    )}
                </Grid>
            ) :
                (
                    <Grid className={classes.firstRow} container justifyContent="space-between" spacing={1}>
                        {searchElement}
                        <Grid container direction='row' justifyContent='center' alignItems='center' spacing={1} style={{ minWidth: '100%', maxWidth: '100%', marginBottom: '1vh' }}>
                            {sortOrderElement}
                            {sortDirectionElement}
                        </Grid>
                        {filters && filters.length > 0 && (
                            <TableFilters collection={collection} filters={filters} onUpdate={setFilters} />
                        )}
                    </Grid>
                )
            }
        </>
    );
};

export default CollectionMeshHeader;
