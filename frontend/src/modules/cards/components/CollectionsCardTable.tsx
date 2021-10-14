import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import CollectionMesh from '../../../components/tables/CollectionMesh';
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
}


const CollectionsCardTable: React.FC<OwnProps> = ({ collectionId, beforeCreateCard }) => {
    const dispatch = useDispatch();
    const collectionCards: EntityCollection = useSelector((state: AppState) => getCollectionCardList(state, collectionId));

    const [isLoading, setIsLoading] = React.useState(true);

    const filters: TableFilter[] = [
    ];

    const onUpdate = (options: CollectionOptions, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        return handleApiRequest(dispatch, dispatch(loadCollectionCards(collectionId, options))).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        if (collectionId != 0) {
            onUpdate({}, dispatch);
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
            leadingComponent={<CollectionsCardCard isAddCard={true} id={collectionId} beforeRedirect={beforeCreateCard} />}
            filters={filters}
            isSearchable
            showIndex
        />
    );
};

export default CollectionsCardTable;