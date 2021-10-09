import { CollectionMiniEntity } from '../../types/collections';
import { AppState, EntityCollection, EntitySelection, SelectionKey } from '../../types/store';
import { selectMiniEntity } from '../../utilities/store';

function getLocalState(state: AppState) {
    return state.collections;
}

export function getAllCollections(state: AppState): EntityCollection {
    return getLocalState(state).allCollections;
}

export function getCollectionMiniEntity(state: AppState, id: SelectionKey): EntitySelection<CollectionMiniEntity> {
    return selectMiniEntity(getLocalState(state).collections, id);
}
