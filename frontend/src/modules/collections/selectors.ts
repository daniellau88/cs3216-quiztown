import { CollectionMiniEntity, CollectionsCardEntity, CollectionsCardMiniEntity } from '../../types/collections';
import { AppState, EntityCollection, EntitySelection, SelectionKey } from '../../types/store';
import { createEntityCollection, selectEntity, selectMiniEntity } from '../../utilities/store';

function getLocalState(state: AppState) {
    return state.collections;
}

export function getAllCollections(state: AppState): EntityCollection {
    return getLocalState(state).allCollections;
}

export function getCollectionMiniEntity(state: AppState, id: SelectionKey): EntitySelection<CollectionMiniEntity> {
    return selectMiniEntity(getLocalState(state).collections, id);
}

export function getCollectionsCardList(state: AppState, id: SelectionKey): EntityCollection {
    return (id && getLocalState(state).collectionCollectionsCards.byId[id]) || createEntityCollection();
}

export function getCollectionsCardMiniEntity(state: AppState, id: SelectionKey): EntitySelection<CollectionsCardMiniEntity> {
    return selectMiniEntity(getLocalState(state).collectionsCards, id);
}

export function getCollectionsCardEntity(state: AppState, id: SelectionKey): EntitySelection<CollectionsCardEntity> {
    return selectEntity(getLocalState(state).collectionsCards, id);
}
