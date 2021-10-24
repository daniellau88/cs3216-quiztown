import * as React from 'react';
import { isBrowser } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import CollectionMesh from '../../../components/tables/CollectionMesh';
import { SortFilter } from '../../../components/tables/CollectionMeshHeader';
import { TableFilter } from '../../../components/tables/TableFilters';
import { CollectionOptions, EntityCollection } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { loadAllPublicCollections } from '../operations';
import { getAllPublicCollections } from '../selectors';

import CollectionGridComponent from './CollectionGridComponent';


const CollectionDiscoverTable: React.FC<{}> = () => {
    const dispatch = useDispatch();
    const allPublicCollections: EntityCollection = useSelector(getAllPublicCollections);

    const [isLoading, setIsLoading] = React.useState(true);

    const filters: TableFilter[] = [
    ];

    const orders: SortFilter[] = [
        {
            name: 'Date Created',
            order: 'created_at',
        },
        {
            name: 'Date Updated',
            order: 'updated_at',
        },
        {
            name: 'Name',
            order: 'name',
        },
    ];

    const onUpdate = (options: CollectionOptions, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        return handleApiRequest(dispatch, dispatch(loadAllPublicCollections(options))).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        onUpdate(allPublicCollections.defaults, dispatch);
    }, []);

    return (
        <CollectionMesh
            collection={allPublicCollections}
            isLoading={isLoading}
            onUpdate={(options: CollectionOptions) => onUpdate(options, dispatch)}
            gridComponent={CollectionGridComponent}
            filters={filters}
            orders={orders}
            isSearchable
            isSortable
        />
    );
};

export default CollectionDiscoverTable;
