import equal from 'fast-deep-equal';
import { AnyAction } from 'redux';
import { batch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { ApiPromise, CollectionData, CollectionQueryParams } from '../types';
import {
    AppState,
    CollectionDefaults,
    CollectionDelta,
    CollectionOptions,
    EntityActableMapping,
    EntityCollection,
    EntityCollectionCache,
    EntityCollectionSet,
    EntitySelection,
    EntityStore,
    SelectionKey,
    ReportStoreSet,
    ReportStore,
} from '../types/store';

const CACHE_DURATION = 120000; // 120 seconds
const DEFAULT_ITEMS_PER_PAGE = 25;
const DEFAULT_SORT_BY = 'id';
const DEFAULT_SORT_ORDER = 'asc';

interface WithId {
    id: number;
}

type Dispatchable = AnyAction | ThunkAction<any, AppState, {}, AnyAction>;

/**
 * Returns true if the two arrays contain the same objects in the same order.
 */
export function arraysEqual(a: any[], b: any[]): boolean {
    if (a === b) {
        return true;
    }
    if (a == null || b == null || a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

/**
 * Returns a new array with all `undefined` and `null` elements removed.
 */
export function removeNulls<T>(list: Array<T | null | undefined>): T[] {
    return list.filter((item) => item !== undefined && item !== null) as T[];
}

/**
 * Returns a list consisting of the IDs of all the items in the given list.
 */
export function toIds<T extends WithId>(list: T[]): number[] {
    return list.map((item) => item.id);
}

/**
 * Creates and returns an empty entity store.
 * This method is meant to be used within the reducers.
 */
export function createEntityStore<M, E extends M = M>(): EntityStore<M, E> {
    return {
        byId: {},
    };
}

/**
 * Creates and returns an empty entity collection store.
 * This method is meant to be used within the reducers.
 */
export function createEntityCollection(defaults: CollectionDefaults = {}): EntityCollection {
    return {
        ids: [],
        currentPage: 0,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        totalEntities: 0,
        totalPages: 0,
        search: '',
        filters: defaults.filters || {},
        defaults,
        sortBy: defaults.sortBy || DEFAULT_SORT_BY,
        sortOrder: defaults.sortOrder || DEFAULT_SORT_ORDER,
        lastUpdate: 0,
        cache: {},
    };
}

/**
 * Creates and returns an empty entity collection set store.
 * This method is meant to be used within the reducers.
 */
export function createEntityCollectionSet(defaults: CollectionDefaults = {}): EntityCollectionSet {
    return {
        byId: {},
        defaults,
    };
}

/**
 * Resets the given entity store to its initial empty state.
 * This method is meant to be used within the reducers.
 */
export function resetEntityStore<M, E extends M = M>(store: EntityStore<M, E>): void {
    store.byId = {};
}

/**
 * Resets the given entity collection store to its initial empty state.
 * This method is meant to be used within the reducers.
 */
export function resetEntityCollection(store: EntityCollection): void {
    store.ids = [];
    store.currentPage = 0;
    store.itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
    store.totalEntities = 0;
    store.totalPages = 0;
    store.search = '';
    store.filters = store.defaults.filters || {};
    store.sortBy = store.defaults.sortBy || DEFAULT_SORT_BY;
    store.sortOrder = store.defaults.sortOrder || DEFAULT_SORT_ORDER;
    store.lastUpdate = 0;
    store.cache = {};
}

/**
 * Resets the given entity collection set store to its initial empty state.
 * This method is meant to be used within the reducers.
 */
export function resetEntityCollectionSet(store: EntityCollectionSet): void {
    store.byId = {};
}

/**
 * Saves the given list of non-detailed entities to the given entity store. If any of the
 * entities already exist in the store, they will be merged with the existing entities.
 * This method is meant to be used within the reducers.
 */
export function saveListToStore<M extends WithId, E extends M = M>(store: EntityStore<M, E>, list: M[]): void {
    for (const entity of list) {
        saveEntityToStore(store, entity, false);
    }
}

/**
 * Saves the given (detailed) entity to the given entity store. If the given entity
 * already exists in the store, it will be merged with the existing entity.
 * This method is meant to be used within the reducers.
 */
export function saveEntityToStore<M extends WithId, E extends M = M>(
    store: EntityStore<M, E>,
    entity: E,
    isDetailed = true,
): void {
    const existing = store.byId[entity.id] || { lastFullUpdate: 0 };

    // delete all keys that are set to undefined, to avoid overriding existing values
    Object.keys(entity).forEach((key) => (entity as any)[key] === undefined && delete (entity as any)[key]);

    store.byId[entity.id] = {
        ...existing,
        ...entity,
        lastUpdate: Date.now(),
        lastFullUpdate: isDetailed ? Date.now() : existing.lastFullUpdate,
    };
}

/**
 * Saves the given changes to the given entity collection.
 * This method is meant to be used within the reducers.
 */
export function saveDeltaToCollection(store: EntityCollection, delta: CollectionDelta): void {
    Object.assign(store, delta);
}

/**
 * Saves the given changes for the given ID to the given entity collection set.
 * This method is meant to be used within the reducers.
 */
export function saveDeltaToCollectionSet(store: EntityCollectionSet, id: number, delta: CollectionDelta): void {
    if (!store.byId[id]) {
        store.byId[id] = createEntityCollection(store.defaults);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    saveDeltaToCollection(store.byId[id]!, delta);
}

/**
 * Resets the cache of the given entity.
 * This method is meant to be used within the reducers.
 */
export function resetEntityCache<M extends WithId, E extends M = M>(store: EntityStore<M, E>, id: number): void {
    if (!store.byId[id]) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    store.byId[id]!.lastFullUpdate = 1;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    store.byId[id]!.lastUpdate = 1;
}

/**
 * Resets the cache of the given entity collection.
 * This method is meant to be used within the reducers.
 */
export function resetCollectionCache(store: EntityCollection): void {
    store.cache = {};
    store.lastUpdate = 0;
}

/**
 * Resets the cache of the entity collection from the given entity collection
 * set, that is identified by the given ID.
 * This method is meant to be used within the reducers.
 */
export function resetCollectionSetCache(store: EntityCollectionSet, id: number): void {
    const collection = store.byId[id];
    if (!collection) {
        return;
    }

    collection.cache = {};
    collection.lastUpdate = 0;
}

/**
 * Resets the cache of the given report store set.
 * This method is meant to be used within the reducers.
 */
export function resetReportStoreSet<D, P>(set: ReportStoreSet<D, P>, id: number): void {
    const store = set.byId[id];
    if (!store) {
        return;
    }

    store.lastUpdate = 0;
}

/**
 * Removes the entity with the given ID from the given entity store.
 * This method is meant to be used within the reducers.
 */
export function removeFromStore<M extends WithId, E extends M = M>(store: EntityStore<M, E>, id: number): void {
    delete store.byId[id];
}

/**
 * Selects and returns the mini entity with the given ID from the given entity store.
 * This method is meant to be used within the selectors.
 */
export function selectMiniEntity<M, E extends M = M>(store: EntityStore<M, E>, id: SelectionKey): EntitySelection<M> {
    return (id && store.byId[id]) || null;
}

/**
 * For each entity in the list, saves the given mapping (actable id, id) to the given entity actable map.
 * Existing mappings in entity actable map would be overwritten.
 * This method is meant to be used within the reducers.
 */
export function saveEntityListToActableMap(map: EntityActableMapping, list: { id: number; actable_id: number }[]): void {
    list.forEach((data) => (map[data.actable_id] = data.id));
}

/**
 * Returns the (entity) id with the given entity actable map and actable id.
 * This method is meant to be used within the selectors and reducers.
 */
export function getIdFromActableId(map: EntityActableMapping, actableId: SelectionKey): SelectionKey {
    return (actableId && map[actableId]) || null;
}

/**
 * Removes the mapping associated with the given actable id from the entity actable map
 * This method is meant to be used within the reducers.
 */
export function removeFromActableMap(map: EntityActableMapping, actableId: number): void {
    delete map[actableId];
}

/**
 * Selects and returns the entity with the given ID from the given entity store.
 * This method is meant to be used within the selectors.
 */
export function selectEntity<M, E extends M = M>(store: EntityStore<M, E>, id: SelectionKey): EntitySelection<E> {
    const entity = id && store.byId[id];
    return entity && entity.lastFullUpdate > 0 ? (entity as EntitySelection<E>) : null;
}

/**
 * Batches a variable number of actions and/or operations, ensuring that they
 * only result in a single render update.
 */
export function batched(dispatch: ThunkDispatch<AppState, {}, AnyAction>, ...args: Dispatchable[]): void {
    batch(() => {
        args.forEach((arg) => dispatch(arg as any));
    });
}

/**
 * Returns the entity with the given ID. This method attempts to use the cached
 * entity obtained using the given selector if possible. If this is not possible,
 * the entity will be fetched using the `fetchData` function.
 *
 * Note that `fetchData` is responsible for storing the new entity in the relevant
 * entity store(s).
 */
export function withCachedEntity<M, E extends M = M>(
    getState: () => AppState,
    selector: (state: AppState, id: number) => EntitySelection<E>,
    id: number,
    fetchData: () => ApiPromise<any>,
): ApiPromise<E> {
    const cached = selector(getState(), id);
    if (cached && cached.lastFullUpdate > Date.now() - CACHE_DURATION) {
        return Promise.resolve({
            code: 200,
            payload: cached as any,
            messages: [],
            errors: {},
        });
    }

    return fetchData().then((response) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, data: selector(getState(), id)! };
    });
}

/**
 * Applies the given options to an entity collection and returns the updated collection.
 * Depending on the presence and validity of the cached data, the entity collection may
 * be updated, which may involve the fetching of data using the `fetchData` function.
 *
 * @param getter A function that returns the up-to-date entity collection of interest.
 * @param options An options object describing the changes to the collection.
 * @param fetchData A function that makes an API call to fetch the necessary collection
 *        data and then stores the fetched entities in the relevant entity store(s).
 * @param updateCollection A function that dispatches a Redux action to update the
 *        entity collection, using the provided delta.
 * @param maxCacheStaleness The maximum age, in milliseconds, that the cached data can be
 *        in order for it to be used for fulfilling the request. Defaults to 120 seconds.
 */
// tslint:disable-next-line
export function queryEntityCollection<D extends WithId>(
    getter: () => EntityCollection,
    options: CollectionOptions,
    fetchData: (params: CollectionQueryParams) => ApiPromise<CollectionData<D>>,
    updateCollection: (delta: CollectionDelta) => any,
    maxCacheStaleness: number = CACHE_DURATION,
): ApiPromise<EntityCollection> {
    const oldState = getter();
    const delta: CollectionDelta = {};
    const itemsPerPage = Math.max(10, Math.min(200, options.itemsPerPage || oldState.itemsPerPage));
    let page = options.page === undefined ? oldState.currentPage : options.page;
    let cache = oldState.cache;
    let shouldResetCollection = false;

    if (options.search !== undefined && options.search !== oldState.search) {
        delta.search = options.search;
        shouldResetCollection = true;
    }

    if (options.filters && !equal(options.filters, oldState.filters)) {
        delta.filters = options.filters;
        shouldResetCollection = true;
    }

    if (options.sortBy && options.sortBy !== oldState.sortBy) {
        delta.sortBy = options.sortBy;
        shouldResetCollection = true;
    }

    if (options.sortOrder && options.sortOrder !== oldState.sortOrder) {
        delta.sortOrder = options.sortOrder;
        shouldResetCollection = true;
    }

    if (shouldResetCollection) {
        cache = {};
        delta.cache = {};
        page = options.page === undefined ? 0 : options.page;
    } else if (itemsPerPage !== oldState.itemsPerPage) {
        delta.itemsPerPage = itemsPerPage;
        delta.totalPages = Math.ceil(oldState.totalEntities / itemsPerPage);
        cache = resizeCache();
        delta.cache = cache;
    }

    delta.currentPage = page;

    if (cache[page] && cache[page].lastUpdate > Date.now() - maxCacheStaleness) {
        if (page !== oldState.currentPage || itemsPerPage !== oldState.itemsPerPage) {
            delta.ids = cache[page].ids;
            delta.lastUpdate = Date.now();
            updateCollection(delta);
        }
        return Promise.resolve({
            code: 200,
            payload: getter(),
            messages: [],
            errors: {},
        });
    }

    const queryParams: CollectionQueryParams = {
        start: page * itemsPerPage,
        length: itemsPerPage,
        search: options.search === undefined ? oldState.search : options.search,
        filters: options.filters || oldState.filters,
        sort_by: options.sortBy || oldState.sortBy,
        order: options.sortOrder || oldState.sortOrder,
    };

    return fetchData(queryParams).then((response) => {
        const ids = response.payload.items.map((item) => item.id);
        delta.ids = ids;
        delta.totalEntities = response.payload.total_count;
        delta.totalPages = Math.ceil(delta.totalEntities / itemsPerPage);
        // Temp fix: Should work (Recreate it as mutable object)
        const newCache = {
            ...cache,
        };
        newCache[page] = { ids, lastUpdate: Date.now() };
        delta.cache = newCache;
        updateCollection(delta);
        return { ...response, payload: getter() };
    });
}

/**
 * Applies the given options to an entity collection and returns the updated collection.
 * Depending on the presence and validity of the cached data, the entity collection may
 * be updated, which may involve the fetching of data using the `fetchData` function.
 *
 * @param getter A function that returns an up-to-date entity collection set.
 * @param id The ID of the entity collection of interest.
 * @param options An options object describing the changes to the collection.
 * @param fetchData A function that makes an API call to fetch the necessary collection
 *        data and then stores the fetched entities in the relevant entity store(s).
 * @param updateCollectionSet A function that dispatches a Redux action to update the
 *        entity collection set, using the provided delta.
 * @param maxCacheStaleness The maximum age, in milliseconds, that the cached data can be
 *        in order for it to be used for fulfilling the request. Defaults to 120 seconds.
 */
export function queryEntityCollectionSet<D extends WithId>(
    getter: () => EntityCollectionSet,
    id: number,
    options: CollectionOptions,
    fetchData: (params: CollectionQueryParams) => ApiPromise<CollectionData<D>>,
    updateCollectionSet: (delta: CollectionDelta) => any,
    maxCacheStaleness: number = CACHE_DURATION,
): ApiPromise<EntityCollection> {
    return queryEntityCollection(
        () => {
            const store = getter();
            return store.byId[id] || createEntityCollection(store.defaults);
        },
        options,
        fetchData,
        updateCollectionSet,
        maxCacheStaleness,
    );
}

function resizeCache(): EntityCollectionCache {
    return {};
}

/**
 * Saves the given report and filters to the given report store and updates the timestamp for
 * caching. This method is meant to be used within the reducers.
 */
export function saveReportToStore<D, P>(store: ReportStore<D, P>, report: D, params: P): void {
    store.data = report;
    store.queryParams = params;
    store.lastUpdate = Date.now();
}

/**
 * Returns a report generated using the given filters. This method attempts to use the
 * cached report (obtained using the given selector) if possible. If this is not possible,
 * the report will be fetched using the `fetchData` function.
 *
 * Note that `fetchData` is responsible for storing the new report in the relevant
 * report store(s).
 */
export function withCachedReport<D, P>(
    getState: () => AppState,
    selector: (state: AppState) => ReportStore<D, P>,
    params: P,
    fetchData: () => ApiPromise<any>,
): ApiPromise<D> {
    const cached = selector(getState());
    if (cached && equal(cached.queryParams, params) && cached.lastUpdate > Date.now() - CACHE_DURATION) {
        return Promise.resolve({
            code: 200,
            payload: cached.data as any,
            messages: [],
            errors: {},
        });
    }

    return fetchData().then((response) => {
        return response; // assume that store has been updated correctly
    });
}
