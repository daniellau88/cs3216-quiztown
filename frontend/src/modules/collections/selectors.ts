import { CollectionEntity, CollectionMiniEntity } from '../../types/collections';
import { AppState, EntityCollection, EntitySelection, SelectionKey } from '../../types/store';
import { selectMiniEntity, selectEntity } from '../../utilities/store';

function getLocalState(state: AppState) {
    return state.collections;
}

export function getAllCollections(state: AppState): EntityCollection {
    return getLocalState(state).allCollections;
}

export function getCollectionMiniEntity(state: AppState, id: SelectionKey): EntitySelection<CollectionMiniEntity> {
    return selectMiniEntity(getLocalState(state).collections, id);
}

export function getCollectionEntity(state: AppState, id: SelectionKey): EntitySelection<CollectionEntity> {
    return selectEntity(getLocalState(state).collections, id);
}
