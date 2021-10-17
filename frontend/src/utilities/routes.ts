function getBaseURL() {
    return '';
}

const ROUTES = {
    ROOT: '/',
    AUTH: {
        LOGIN: '/about',
    },
    COLLECTIONS: {
        INDEX: '/collections',
        SHOW: '/collections/:collectionId',
        NEW: '/collections/new',
        CARD: {
            SHOW: '/collections/:collectionId/cards/:cardId',
            EDIT: '/collections/:collectionId/cards/:cardId/edit',
            NEW: '/collections/:collectionId/cards/new',
            NEWTEXT: '/collections/:collectionId/cards/newText',
            NEWIMAGE: '/collections/:collectionId/cards/newImage',
        },
    },
    CARDS: {
        SHOW_STARRED: '/cards/starred',
    },
    TEST: '/test',
};

const appendBaseUrl = <P>(obj: P) => {
    const keys = Object.keys(obj) as (keyof P)[];
    const newObj: any = {};
    keys.map((key: keyof P) => {
        if (typeof obj[key] == 'string') {
            newObj[key] = getBaseURL() + obj[key];
        } else {
            newObj[key] = appendBaseUrl(obj[key]);
        }
    });
    return newObj as P;
};

const routes = Object.freeze(appendBaseUrl(ROUTES));

export default routes;
