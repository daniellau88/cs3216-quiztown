import AuthAPI from './auth';
import CardsAPI from './cards';
import CollectionsAPI from './collections';
import UploadsAPI from './uploads';

const api = {
    collections: new CollectionsAPI(),
    auth: new AuthAPI(),
    uploads: new UploadsAPI(),
    cards: new CardsAPI(),
};

Object.freeze(api);

export default api;
