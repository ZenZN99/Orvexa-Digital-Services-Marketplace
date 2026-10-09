import { SupportConversation } from '../../../modules/supports/coversations/schema/support-conversation.schema.js';
import { SupportMessage } from '../../../modules/supports/messages/schema/support-message.schema.js';
import { User } from '../../../modules/users/schema/user.schema.js';
export declare const generateSupportMessages: (conversations: SupportConversation[], createdUsers: User[]) => Partial<SupportMessage>[];
