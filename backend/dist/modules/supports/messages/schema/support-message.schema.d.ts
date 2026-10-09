import { Model } from 'sequelize-typescript';
import { SupportConversation } from '../../coversations/schema/support-conversation.schema.js';
import { User } from '../../../users/schema/user.schema.js';
export declare class SupportMessage extends Model {
    id: string;
    conversationId: string;
    conversation: SupportConversation;
    senderId: string;
    sender: User;
    message: string | null;
    attachments: string[];
    isRead: boolean;
}
