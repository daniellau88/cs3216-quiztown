import { PublicActivityMiniEntity } from '../../types/publicActivities';
import { AppState, EntitySelection, SelectionKey } from '../../types/store';
import { selectMiniEntity } from '../../utilities/store';

function getLocalState(state: AppState) {
    return state.publicActivities;
}

export function getRecentPublicActivities(state: AppState): number[] {
    return getLocalState(state).recentPublicActivities;
}

export function getPublicActivityMiniEntity(state: AppState, id: SelectionKey): EntitySelection<PublicActivityMiniEntity> {
    return selectMiniEntity(getLocalState(state).publicActivities, id);
}
