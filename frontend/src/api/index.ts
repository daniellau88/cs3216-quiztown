import AuthAPI from './auth';
import CardsAPI from './cards';
import CollectionsAPI from './collections';
import PublicActivitiesAPI from './publicActivities';
import UploadsAPI from './uploads';
import WebsocketPublicActivitiesAPI from './websocketPublicActivities';

const api = {
    collections: new CollectionsAPI(),
    auth: new AuthAPI(),
    uploads: new UploadsAPI(),
    cards: new CardsAPI(),
    publicActivities: new PublicActivitiesAPI(),
    websocketPublicActivities: new WebsocketPublicActivitiesAPI(),
};

Object.freeze(api);

export default api;
