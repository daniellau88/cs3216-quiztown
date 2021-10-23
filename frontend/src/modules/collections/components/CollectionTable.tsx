import * as React from 'react';
import { isBrowser } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import CollectionMesh from '../../../components/tables/CollectionMesh';
import { SortFilter } from '../../../components/tables/CollectionMeshHeader';
import { TableFilter } from '../../../components/tables/TableFilters';
import { CollectionOptions, EntityCollection } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { loadAllCollections, loadAllPublicCollections } from '../operations';
import { getAllCollections, getAllPublicCollections } from '../selectors';

import CollectionCard from './CollectionCard';
import CollectionGridComponent from './CollectionGridComponent';

interface OwnProps {
    // Whether the collection for discover page.
    isDiscoverCollections?: boolean;
}

type Props = OwnProps;

const CollectionTable: React.FC<Props> = ({ isDiscoverCollections }: Props) => {
    const dispatch = useDispatch();
    const allCollections: EntityCollection = useSelector(getAllCollections);
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
        return handleApiRequest(dispatch, dispatch(loadAllCollections(options))).finally(() => {
            setIsLoading(false);
        });
    };

    const onUpdateDiscover = (options: CollectionOptions, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        return handleApiRequest(dispatch, dispatch(loadAllPublicCollections(options))).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        if (isDiscoverCollections) {
            // TODO: make the filter object const
            const publicOptions = { filters: { 'private': 1 } };
            onUpdateDiscover(publicOptions, dispatch);
        } else {
            onUpdate({}, dispatch);
        }
    }, [dispatch]);

    return (
        <CollectionMesh
            collection={isDiscoverCollections ? allPublicCollections : allCollections}
            isLoading={isLoading}
            onUpdate={(options: CollectionOptions) => onUpdate(options, dispatch)}
            gridComponent={CollectionGridComponent}
            leadingComponent={isBrowser ? <CollectionCard isAddCollectionCard={true} /> : undefined}
            filters={filters}
            orders={orders}
            isSearchable
            isSortable
            canDuplicate={isDiscoverCollections}
        />
    );
};

export default CollectionTable;
