import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import CollectionMesh from '../../../components/tables/CollectionMesh';
import { TableFilter } from '../../../components/tables/TableFilters';
import { AppState, CollectionOptions, EntityCollection } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { loadAllCards } from '../operations';
import { getAllCards } from '../selectors';

import CollectionsCardGridComponent from './CollectionsCardGridComponent';

const StarredCardTable: React.FC = () => {
    const dispatch = useDispatch();
    const starredCards: EntityCollection = useSelector((state: AppState) => getAllCards(state));

    const [isLoading, setIsLoading] = React.useState(true);

    const filters: TableFilter[] = [
    ];

    const onUpdate = (options: CollectionOptions, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        const queryOptions: CollectionOptions = {
            ...options,
            filters: {
                ...options.filters,
                flagged: 1,
            },
        };
        return handleApiRequest(dispatch, dispatch(loadAllCards(queryOptions))).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        onUpdate({}, dispatch);
    }, [dispatch]);

    if (isLoading) {
        return <LoadingIndicator></LoadingIndicator>;
    }

    return (
        <CollectionMesh
            collection={starredCards}
            isLoading={isLoading}
            onUpdate={(options: CollectionOptions) => onUpdate(options, dispatch)}
            gridComponent={CollectionsCardGridComponent}
            filters={filters}
            isSearchable
        />
    );
};

export default StarredCardTable;
