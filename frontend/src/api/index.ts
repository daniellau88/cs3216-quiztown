import CollectionsAPI from './collections';

const api = {
    collections: new CollectionsAPI(),
};

Object.freeze(api);

export default api;
