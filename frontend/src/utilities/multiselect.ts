import { AppState, SelectionKey } from '../types/store';

/* useSelector function nested inside map gives eslint warning and potentially
 * violates react rules of hooks leading to bugs.
 * multiselect allows application of useSelector on an array of SelectionKey
 * to ensure compliance to react rules of hooks.
 * Returns key-value pairs so that the required entity can be accessed via its id.
 */

// eslint-disable-next-line
export function multiselect(selector: Function, state: AppState, ids: SelectionKey[]) {
    const kvPairs: any = {};
    ids.forEach((id) => (id ? (kvPairs[id] = selector(state, id)) : {}));
    return kvPairs;
}
