import AuthAPI from './auth';
import CollectionsAPI from './collections';
import UploadsAPI from './uploads';

const api = {
    collections: new CollectionsAPI(),
    auth: new AuthAPI(),
    uploads: new UploadsAPI(),
};

Object.freeze(api);

export default api;
