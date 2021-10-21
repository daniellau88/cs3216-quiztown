import { generatePath } from 'react-router';

import { PublicActivityMiniEntity, PublicActivityType } from '../../types/publicActivities';
import routes from '../../utilities/routes';

export function getPublicActivityURL(item: PublicActivityMiniEntity): string {
    switch (item.type) {
        case PublicActivityType.CollectionImport: {
            return generatePath(routes.COLLECTIONS.IMPORT.SHOW, {
                collectionId: item.params.collection_id,
                importId: item.params.import_id,
            });
        }
    }
}
