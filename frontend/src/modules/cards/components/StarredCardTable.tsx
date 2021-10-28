import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import CollectionMesh from '../../../components/tables/CollectionMesh';
import { TableFilter } from '../../../components/tables/TableFilters';
import { AppState, CollectionOptions, EntityCollection } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { loadStarredCards } from '../operations';
import { getStarredCards } from '../selectors';

import CollectionsCardGridComponent from './CollectionsCardGridComponent';

const StarredCardTable: React.FC = () => {
    const dispatch = useDispatch();
    const starredCards: EntityCollection = useSelector((state: AppState) => getStarredCards(state));

    const [isLoading, setIsLoading] = React.useState(true);

    const filters: TableFilter[] = [
    ];

    const onUpdate = (options: CollectionOptions, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        return handleApiRequest(dispatch, dispatch(loadStarredCards(options))).finally(() => {
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
