import { Model } from 'sequelize-typescript';
import { User } from '../../../users/schema/user.schema.js';
import { SupportConversationStatus } from '../../../../common/enums/support-conversation.enum.js';
export declare class SupportConversation extends Model {
    id: string;
    userId: string;
    user: User;
    status: SupportConversationStatus;
    lastMessage: string;
    lastMessageSenderId: string | null;
    lastMessageSender: User;
    closedAt: Date | null;
    closedBy: string | null;
    closedByUser: User;
}
