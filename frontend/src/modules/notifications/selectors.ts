import { Notification } from '../../types/notifications';
import { AppState } from '../../types/store';

export function getNotifications(state: AppState): Notification[] {
    return state.notifications.notifications;
}
