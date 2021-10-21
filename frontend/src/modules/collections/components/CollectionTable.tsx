import * as React from 'react';
import { isBrowser } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import CollectionMesh from '../../../components/tables/CollectionMesh';
import { SortFilter } from '../../../components/tables/CollectionMeshHeader';
import { TableFilter } from '../../../components/tables/TableFilters';
import { CollectionOptions, EntityCollection } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { loadAllCollections } from '../operations';
import { getAllCollections } from '../selectors';

import CollectionCard from './CollectionCard';
import CollectionGridComponent from './CollectionGridComponent';


const CollectionTable: React.FC<{}> = () => {
    const dispatch = useDispatch();
    const allCollections: EntityCollection = useSelector(getAllCollections);

    const [isLoading, setIsLoading] = React.useState(true);

    const filters: TableFilter[] = [
    ];

    const orders: SortFilter[] = [
        {
            name: 'Date Created',
            order: 'collection_collection.created_at',
        },
        {
            name: 'Date Updated',
            order: 'collection_collection.updated_at',
        },
        {
            name: 'Name',
            order: 'collection_collection.name',
        },
    ];

    const onUpdate = (options: CollectionOptions, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        return handleApiRequest(dispatch, dispatch(loadAllCollections(options))).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        onUpdate({}, dispatch);
    }, [dispatch]);

    return (
        <CollectionMesh
            collection={allCollections}
            isLoading={isLoading}
            onUpdate={(options: CollectionOptions) => onUpdate(options, dispatch)}
            gridComponent={CollectionGridComponent}
            leadingComponent={isBrowser ? <CollectionCard isAddCollectionCard={true} /> : undefined}
            filters={filters}
            orders={orders}
            isSearchable
            isSortable
        />
    );
};

export default CollectionTable;
