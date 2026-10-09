import { NotificationType } from '../../../common/enums/notification.enum.js';
import { Contract } from '../../../modules/contracts/schema/contract.schema.js';
import { User } from '../../../modules/users/schema/user.schema.js';
export declare const generateNotifications: (createdUsers: User[], createdContracts: Contract[]) => {
    senderId: string;
    receiverId: string;
    targetId: string | null;
    type: NotificationType;
    message: string;
    isRead: boolean;
    link: string | null;
}[];
