import { SupportConversationStatus } from '../../../common/enums/support-conversation.enum.js';
import { User } from '../../../modules/users/schema/user.schema.js';
export declare const generateSupportConversations: (createdUsers: User[]) => {
    userId: string;
    status: SupportConversationStatus;
    lastMessage: string;
    lastMessageSenderId: string | null;
    closedAt: Date | null;
    closedBy: string | null;
}[];
