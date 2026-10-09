import { Model } from 'sequelize-typescript';
import { User } from '../../users/schema/user.schema.js';
import { NotificationType } from '../../../common/enums/notification.enum.js';
export declare class Notification extends Model {
    id: string;
    senderId: string;
    sender: User;
    receiverId: string;
    receiver: User;
    targetId: string | null;
    type: NotificationType;
    message: string;
    isRead: boolean;
    link: string | null;
}
