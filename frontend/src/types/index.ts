import { Action, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { AppState } from './store';

export interface ThunkDispatchProps {
    dispatch: ThunkDispatch<AppState, {}, AnyAction>;
}

// API

export interface StatusMessage {
    content: string;
    type: StatusMessageType;
}

export enum StatusMessageType {
    Error = 1,
    Warning = 2,
    Information = 3,
    Success = 4,
}

/**
 * Describes the shape of the JSON response from API endpoints.
 */
export interface ApiResponse<D, E = {}> {
    code: number;
    payload: D;
    messages: StatusMessage[];
    metadata: {
        is_authenticated?: boolean;
    };
    errors: E;
}

/**
 * Describes the shape of the response data from endpoints that return entity collections.
 */
export interface CollectionData<D> {
    // The items that should be displayed.
    items: D[];
    // The total number of items in the (filtered) collection.
    total_count: number;
}

export type ApiPromise<D, E = {}> = Promise<ApiResponse<D, E>>;

/**
 * Describes the query parameters accepted by API endpoints that return entity collections.
 */
export interface CollectionQueryParams {
    // The number of items to be skipped over.
    length: number;
    // The maximum number of items to be returned.
    start: number;
    // The search query to be applied on the collection.
    search: string;
    // The filters to be applied on the collection.
    filters: { [key: string]: any };
    // The name of the column to sort the collection by.
    sort_by: string;
    // The sorting direction.
    order: 'asc' | 'desc';
}

export type Permissions<T extends string = 'can_update' | 'can_delete'> = {
    [key in T]: boolean;
};

declare module 'redux' {
    // Overload to add thunk support to Redux's dispatch() function.
    export interface Dispatch<A extends Action = AnyAction> {
        // tslint:disable-next-line
        <R, E>(thunk: ThunkAction<R, AppState, E, AnyAction>): R;
    }
}
