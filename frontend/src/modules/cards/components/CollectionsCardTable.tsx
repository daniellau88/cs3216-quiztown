import * as React from 'react';
import { isBrowser } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import CollectionMesh from '../../../components/tables/CollectionMesh';
import { SortFilter } from '../../../components/tables/CollectionMeshHeader';
import { TableFilter } from '../../../components/tables/TableFilters';
import { AppState, CollectionOptions, EntityCollection } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { loadCollectionCards } from '../operations';
import { getCollectionCardList } from '../selectors';

import CollectionsCardCard from './CollectionsCardCard';
import CollectionsCardGridComponent from './CollectionsCardGridComponent';


interface OwnProps {
    collectionId: number;
    beforeCreateCard?: () => Promise<number>;
    showAddCard: boolean;
}


const CollectionsCardTable: React.FC<OwnProps> = ({ collectionId, beforeCreateCard, showAddCard }) => {
    const dispatch = useDispatch();
    const collectionCards: EntityCollection = useSelector((state: AppState) => getCollectionCardList(state, collectionId));

    const [isLoading, setIsLoading] = React.useState(true);

    const filters: TableFilter[] = [
        {
            type: 'select-checkbox',
            key: 'flagged',
            label: 'Starred',
            options: { value: 1, label: 'Show Only Starred' },
        },
        {
            type: 'hidden',
            key: 'is_reviewed',
            label: '',
        },
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
        const queryFilters = {
            ...options.filters,
        };
        if (!options.filters?.flagged) {
            delete queryFilters.flagged;
        }
        const queryOptions: CollectionOptions = {
            ...options,
            filters: queryFilters,
        };
        return handleApiRequest(dispatch, dispatch(loadCollectionCards(collectionId, queryOptions))).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        if (collectionId != 0) {
            onUpdate(collectionCards.defaults, dispatch);
        } else {
            // Show all items
            setIsLoading(false);
        }
    }, [collectionId, dispatch]);

    return (
        <CollectionMesh
            collection={collectionCards}
            isLoading={isLoading}
            onUpdate={(options: CollectionOptions) => onUpdate(options, dispatch)}
            gridComponent={CollectionsCardGridComponent}
            leadingComponent={isBrowser && showAddCard ? <CollectionsCardCard isAddCard={true} id={collectionId} beforeRedirect={beforeCreateCard} /> : undefined}
            filters={filters}
            orders={orders}
            isSearchable
            isSortable
        />
    );
};

export default CollectionsCardTable;
