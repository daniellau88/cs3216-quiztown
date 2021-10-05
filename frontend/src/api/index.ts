import AuthAPI from './auth';
import CollectionsAPI from './collections';

const api = {
    collections: new CollectionsAPI(),
    auth: new AuthAPI(),
};

Object.freeze(api);

export default api;
