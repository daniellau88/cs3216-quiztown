import {
    Checkbox,
    FormControl,
    Grid,
    Input,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Typography,
    withStyles,
} from '@material-ui/core';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';

import { EntityCollection } from '../../types/store';
import { OptionsType, optionsToNameMap } from '../../utilities/options';


const ExpansionPanel = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .1)',
        margin: '0 0 12px',
        boxShadow: 'none',
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: '0 0 12px',
        },
    },
    expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .015)',
        borderBottom: '1px solid rgba(0, 0, 0, .1)',
        minHeight: 48,
        '&$expanded': {
            minHeight: 48,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles({
    root: {
        padding: '12px 16px',
    },
})(MuiExpansionPanelDetails);

export interface TableBaseFilter {
    type: string;
    // The unique key identifying the filter.
    key: string;
    // The user-friendly display name of the filter.
    label: string;
}

export interface TableSelectFilter extends TableBaseFilter {
    type: 'select';
    // The available options of the select filter.
    options: OptionsType[];
}

export interface TableSingleSelectFilter extends TableBaseFilter {
    type: 'single-select';
    // The available options of the select filter.
    options: OptionsType[];
}

export type TableFilter =
    | TableSelectFilter
    | TableSingleSelectFilter;

interface OwnProps {
    // The entity collection on which the filters are applied.
    collection: EntityCollection;
    // A list of filters to be used for filtering the collection.
    filters: TableFilter[];
    // The callback to be executed when the filters should be applied.
    onUpdate: (filters: Record<string, any>) => any;
}

type Props = OwnProps;

function buildInitialFilterState(collection: EntityCollection, filters: TableFilter[]): Record<string, any> {
    const initialState: Record<string, any> = {};

    filters.forEach((filter) => {
        switch (filter.type) {
            case 'single-select':
            case 'select': {
                initialState[filter.key] = collection.filters[filter.key] || [];
                break;
            }
        }
    });

    return initialState;
}

const TableFilters: React.FC<Props> = ({ collection, filters, onUpdate }: Props) => {
    const [activeFilters, setActiveFilters] = React.useState(buildInitialFilterState(collection, filters));
    const [timerId, setTimerId] = React.useState<number | null>(null);

    const handleFilterChange = (key: string, value: any) => {
        updateActiveFilters({ ...activeFilters, [key]: value });
    };

    const updateActiveFilters = (newActiveFilters: Record<string, any>) => {
        if (timerId) {
            clearTimeout(timerId);
        }

        setActiveFilters(newActiveFilters);

        const newTimerId = window.setTimeout(() => {
            onUpdate(newActiveFilters);
        }, 500);

        setTimerId(newTimerId);
    };

    return (
        <>
            <ExpansionPanel defaultExpanded elevation={1}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="filters-panel-content"
                    id="filters-panel-header"
                >
                    <Typography>Filters</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container spacing={2}>
                        {filters.map((filter, index) => {
                            switch (filter.type) {
                                case 'select': {
                                    const nameMap = optionsToNameMap(filter.options);
                                    const optionsCount = filter.options.length;
                                    const currentFilter = activeFilters[filter.key] || [];

                                    const onSelectAll = () => {
                                        if (currentFilter.length === optionsCount) {
                                            updateActiveFilters({ ...activeFilters, [filter.key]: [] });
                                        } else {
                                            updateActiveFilters({
                                                ...activeFilters,
                                                [filter.key]: filter.options.map((option) => option.value),
                                            });
                                        }
                                    };

                                    return (
                                        <Grid key={index} item xs={12} sm={6} lg={3} xl={2}>
                                            <FormControl fullWidth>
                                                <InputLabel shrink>{filter.label}</InputLabel>
                                                <Select
                                                    multiple
                                                    name={filter.key}
                                                    value={activeFilters[filter.key]}
                                                    onChange={(event, child: any) => {
                                                        if (child && child.key === 'select_all') {
                                                            onSelectAll();
                                                        } else {
                                                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                                            handleFilterChange(event.target.name!, event.target.value);
                                                        }
                                                    }}
                                                    displayEmpty
                                                    fullWidth
                                                    input={<Input />}
                                                    renderValue={(selected: any) => {
                                                        const count: number = selected.length;
                                                        if (count === 0 || count === optionsCount) {
                                                            return <span style={{ color: '#999' }}>All</span>;
                                                        }

                                                        return count >= 3
                                                            ? `${count} items selected`
                                                            : selected.map((value: any) => nameMap[value]).join(', ');
                                                    }}
                                                >
                                                    {filter.options.length > 3 && (
                                                        <MenuItem key="select_all" divider value="">
                                                            <Checkbox
                                                                checked={currentFilter.length === optionsCount}
                                                                indeterminate={currentFilter.length > 0 && currentFilter.length < optionsCount}
                                                            />
                                                            <ListItemText
                                                                primary={currentFilter.length === optionsCount ? 'Deselect All' : 'Select All'}
                                                                style={{ color: '#999' }}
                                                            />
                                                        </MenuItem>
                                                    )}
                                                    {filter.options.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            <Checkbox checked={currentFilter.indexOf(option.value) > -1} />
                                                            <ListItemText primary={option.label} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    );
                                }
                                case 'single-select': {
                                    const nameMap = optionsToNameMap(filter.options);

                                    const onSelectAll = () => {
                                        updateActiveFilters({
                                            ...activeFilters,
                                            [filter.key]: [],
                                        });
                                    };

                                    return (
                                        <Grid key={index} item xs={12} sm={6} lg={3} xl={2}>
                                            <FormControl fullWidth>
                                                <InputLabel shrink>{filter.label}</InputLabel>
                                                <Select
                                                    name={filter.key}
                                                    value={activeFilters[filter.key]}
                                                    onChange={(event, child: any) => {
                                                        if (child && child.key === 'select_all') {
                                                            onSelectAll();
                                                        } else {
                                                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                                            handleFilterChange(event.target.name!, [event.target.value]);
                                                        }
                                                    }}
                                                    displayEmpty
                                                    fullWidth
                                                    input={<Input />}
                                                    renderValue={(selected: any) => {
                                                        const count: number = selected.length;
                                                        if (count === 0) {
                                                            return <span style={{ color: '#999' }}>All</span>;
                                                        }

                                                        return nameMap[selected];
                                                    }}
                                                >
                                                    <MenuItem key="select_all" divider value="">
                                                        <ListItemText primary="Select All" />
                                                    </MenuItem>
                                                    {filter.options.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            <ListItemText primary={option.label} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    );
                                }
                                default: {
                                    return '';
                                }
                            }
                        })}
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </>
    );
};

export default TableFilters;
