import { SupportConversationStatus } from '../../../common/enums/support-conversation.enum.js';
import { UserRole } from '../../../common/enums/user.enum.js';
export const generateSupportConversations = (createdUsers) => {
    const admin = createdUsers.find((user) => user.role === UserRole.ADMIN);
    return createdUsers
        .filter((user) => user.role !== UserRole.ADMIN)
        .map((user, index) => {
        const isClosed = index % 4 === 0;
        return {
            userId: user.id,
            status: isClosed
                ? SupportConversationStatus.CLOSED
                : SupportConversationStatus.OPEN,
            lastMessage: isClosed
                ? 'Thank you for contacting Orvexa support.'
                : 'Hello, I need help with my account.',
            lastMessageSenderId: isClosed ? (admin?.id ?? null) : user.id,
            closedAt: isClosed ? new Date() : null,
            closedBy: isClosed ? (admin?.id ?? null) : null,
        };
    });
};
//# sourceMappingURL=support-conversations.js.map