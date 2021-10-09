import { CollectionMiniEntity, CollectionsCardEntity } from '../../types/collections';
import { AppState, EntityCollection, EntitySelection, SelectionKey } from '../../types/store';
import { selectEntity, selectMiniEntity } from '../../utilities/store';

function getLocalState(state: AppState) {
    return state.collections;
}

export function getAllCollections(state: AppState): EntityCollection {
    return getLocalState(state).allCollections;
}

export function getCollectionMiniEntity(state: AppState, id: SelectionKey): EntitySelection<CollectionMiniEntity> {
    return selectMiniEntity(getLocalState(state).collections, id);
}

export function getCollectionsCardList(state: AppState, id: SelectionKey): EntityCollection | null {
    return (id && getLocalState(state).collectionCollectionsCards.byId[id]) || null;
}

export function getCollectionsCardEntity(state: AppState, id: SelectionKey): EntitySelection<CollectionsCardEntity> {
    return selectEntity(getLocalState(state).collectionsCards, id);
}
