import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { AuthState } from '../modules/auth/types';
import { CardsState } from '../modules/cards/types';
import { CollectionsState } from '../modules/collections/types';
import { NotificationsState } from '../modules/notifications/types';
import { PublicActivitiesState } from '../modules/publicActivities/types';
import { QuizState } from '../modules/quiz/types';

/**
 * Describes the overall shape of the application's Redux store state.
 */
export interface AppState {
    auth: AuthState;
    cards: CardsState;
    collections: CollectionsState;
    notifications: NotificationsState;
    publicActivities: PublicActivitiesState;
    quiz: QuizState;
}

export type Operation<R> = ThunkAction<Promise<R>, AppState, {}, AnyAction>;

export type NormalizeOperation = ThunkAction<void, AppState, {}, AnyAction>;

interface EntityMetadata {
    // The timestamp at which the entity was last updated, in number of milliseconds since UTC.
    lastUpdate: number;
    // The timestamp at which the full entity was last updated, in number of milliseconds since UTC.
    lastFullUpdate: number;
}

/**
 * An EntityStore is a subset of the Redux store that stores a specific type of record
 * or data, which are identified by their IDs.
 *
 * The EntityStore is designed to store data received from the API server, after they
 * have been normalized into their respective Entities (hence the name 'EntityStore').
 *
 * Entities in the store may be incomplete (i.e. non-detailed or 'mini') or complete
 * (i.e. detailed or 'full'). The parameter `M` denotes the type of incomplete
 * entities, whereas `E` denotes the type of complete entities. If such a distinction
 * between incomplete and complete entities is not necessary, the second parameter can
 * be left out.
 *
 * Note that all interactions with the EntityStore should be performed via helper
 * functions found in `utils/store.ts`.
 */
export interface EntityStore<M, E extends M = M> {
    byId: { [key: number]: (M & Partial<E> & EntityMetadata) | undefined };
}

/**
 * The type of the identifier accepted by selectors.
 */
export type SelectionKey = number | null | undefined;

/**
 * The type of the return value of selectors that selects an entity from an
 * `EntityStore` using its ID.
 */
export type EntitySelection<T> = (T & EntityMetadata) | null;

type RangeFilter<T> = {
    start?: T;
    end?: T;
};

type CollectionFilter = number | string | number[] | string[] | RangeFilter<string> | RangeFilter<number>;

interface EntityCollectionCacheEntry {
    // The cached entity IDs.
    ids: number[];
    // The timestamp at which the cache entry was last updated, in number of milliseconds since UTC.
    lastUpdate: number;
}

export type EntityCollectionCache = Record<number, EntityCollectionCacheEntry>;

/**
 * An EntityCollection is a subset of the Redux store that stores the state of a view
 * that displays a collection of entities.
 *
 * An EntityCollection provides the ability for filtering, pagination, searching, and
 * sorting of a collection of entities, provided that the relevant API endpoint and
 * backend model(s) are set up to support it.
 *
 * By itself, the EntityCollection only stores the IDs of the entities in the
 * collection. It needs to be used together with an EntityStore, which would store
 * the actual entities.
 *
 * Note that both modifying the EntityCollection and fetching collection data should
 * be performed via helper functions found in `utils/store.ts`.
 */
export interface EntityCollection {
    // The IDs of the entities that are currently displayed.
    ids: number[];
    // The current page that is being displayed. The first page is page 0.
    currentPage: number;
    // The number of items that is being displayed per page.
    itemsPerPage: number;
    // The total number of entities in the (filtered) collection.
    totalEntities: number;
    // The total number of pages in the (filtered) collection.
    totalPages: number;
    // The search query that is currently applied on the collection.
    search: string;
    // The filters that are currently applied on the collection.
    filters: { [key: string]: CollectionFilter };
    // The default filtering and sorting mode of the collection.
    defaults: CollectionDefaults;
    // The name of the column that the collection is sorted by. Defaults to `'id'`.
    sortBy: string;
    // The sorting direction. Use `'asc'` to sort in ascending order and
    // `'desc'` to sort in descending order. Defaults to `'asc'`.
    sortOrder: 'asc' | 'desc';
    // The timestamp at which the collection was last updated, in number of milliseconds since UTC.
    lastUpdate: number;
    // Contains cached entity IDs keyed by page number.
    cache: EntityCollectionCache;
}

/**
 * An EntityCollectionSet is a subset of the Redux store that stores a set of
 * entity collections.
 *
 * The EntityCollectionSet is necessary if an arbitrary number of entity collections
 * are displayed at the same time and where each of the collections can be identified
 * from among the others by an ID.
 *
 * If there are multiple entity collections that are identified by an ID, but where
 * only a single one is displayed at any point in time, then an EntityCollectionSet
 * can still be helpful in allowing their states to be independently persisted.
 * (The alternative approach is to use an EntityCollection with the ID as a filter.)
 *
 * Note that both modifying the EntityCollectionSet and fetching collection data
 * should be performed via helper functions found in `utils/store.ts`.
 */
export interface EntityCollectionSet {
    byId: { [key: number]: EntityCollection | undefined };
    // The default filtering and sorting mode of each collection.
    defaults: CollectionDefaults;
}

/**
 * Describes the options object containing default filtering and sorting options.
 */
export interface CollectionDefaults {
    // The filters that are initially applied on the collection.
    filters?: { [key: string]: CollectionFilter };
    // The name of the column the collection is initially sorted by. Defaults to `'id'`.
    sortBy?: string;
    // The initial sorting direction.
    sortOrder?: 'asc' | 'desc';
}

/**
 * Describes a change to be made to an entity collection.
 */
export type CollectionDelta = Partial<Omit<EntityCollection, 'defaults'>>;

/**
 * Describes the options object accepted by operations that modifies and returns
 * an entity collection.
 *
 * If an option is not specified, the current value will be used. However, if
 * search, filters, sortBy, or sortOrder is specified, the page number will be
 * reset to zero if it is not specified.
 */
export interface CollectionOptions {
    // The requested page number.
    page?: number;
    // The requested number of items per page.
    itemsPerPage?: number;
    // The requested search query to be applied.
    search?: string;
    // The requested filters to be applied.
    filters?: { [key: string]: CollectionFilter };
    // The name of the column to sort the collection by.
    sortBy?: string;
    // The sorting direction.
    sortOrder?: 'asc' | 'desc';
}

/** Maps actable id to the entity id
 * e.g. Client is a CvwoPerson with (entity) id = 8, actable_id = 1
 * Given the actable_id, (entity) id is returned and can be used to access the store.
 **/
export interface EntityActableMapping {
    [actableId: number]: number;
}

/**
 * A `ReportStore` is a subset of the Redux store that stores a single data item
 * along with the filters/parameters used to generate it.
 *
 * It is designed to store data received from the API server.
 *
 * Note that all interactions with the ReportStore should be performed via helper
 * functions found in `utils/store.ts`.
 *
 * TODO: Might need to add more helper functions.
 */
export interface ReportStore<D, P> {
    // The current report.
    data: D;
    // The parameters which the current report was generated based on.
    queryParams: P;
    // The timestamp at which the report was last updated, in number of milliseconds since UTC.
    lastUpdate: number;
}

export interface ReportStoreSet<D, P> {
    byId: { [key: number]: ReportStore<D, P> | undefined };
}
