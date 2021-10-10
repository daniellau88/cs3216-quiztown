import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import CollectionMesh from '../../../components/tables/CollectionMesh';
import { TableFilter } from '../../../components/tables/TableFilters';
import { AppState, CollectionOptions, EntityCollection } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { loadCollectionContents } from '../operations';
import { getCollectionsCardList } from '../selectors';

import CollectionsCard from './CollectionsCard';
import CollectionsCardGridComponent from './CollectionsCardGridComponent';


const CollectionContentsTable: React.FC<{collectionId:number}> = ({ collectionId }) => {
    const dispatch = useDispatch();
    const allCollections: EntityCollection = useSelector((state: AppState) => getCollectionsCardList(state, collectionId));

    const [isLoading, setIsLoading] = React.useState(true);

    const filters: TableFilter[] = [
    ];

    const onUpdate = (options: CollectionOptions, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        return handleApiRequest(dispatch, dispatch(loadCollectionContents(collectionId, options))).finally(() => {
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
            gridComponent={CollectionsCardGridComponent}
            leadingComponent={<CollectionsCard isAddCard={true} id={collectionId}/>}
            filters={filters}
            isSearchable
            showIndex
        />
    );
};

export default CollectionContentsTable;
