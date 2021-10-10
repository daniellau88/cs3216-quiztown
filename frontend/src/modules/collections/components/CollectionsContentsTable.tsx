import { Typography } from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import CollectionMesh from '../../../components/tables/CollectionMesh';
import { TableFilter } from '../../../components/tables/TableFilters';
import { AppState, CollectionOptions, EntityCollection } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { loadCollectionContents } from '../operations';
import { getCollectionsCardList } from '../selectors';

import CollectionGridComponent from './CollectionGridComponent';


const CollectionContentsTable: React.FC<{collectionId:number}> = ({ collectionId }) => {
    const dispatch = useDispatch();
    const allCollections: EntityCollection|null = useSelector((state: AppState) => getCollectionsCardList(state, collectionId));

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

    if (!allCollections) {
        return (
            <Typography>
                You dont have any cards in this collections yet, start adding cards here!
            </Typography>
        );
    }

    return (
        <CollectionMesh
            collection={allCollections}
            isLoading={isLoading}
            onUpdate={(options: CollectionOptions) => onUpdate(options, dispatch)}
            gridComponent={CollectionGridComponent}
            leadingComponent={CollectionGridComponent}
            filters={filters}
            isSearchable
            showIndex
        />
    );
};

export default CollectionContentsTable;
