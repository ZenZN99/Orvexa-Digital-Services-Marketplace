import { UserRole } from '../../../common/enums/user.enum.js';
const userMessages = [
    'Hello, I need help with my account.',
    'I have a question about one of the services.',
    'I am having trouble completing my order.',
    'Can you help me with my payment?',
    'I need help updating my profile.',
    'I have an issue with my account.',
    'I would like to report a problem.',
    'Can you help me understand how this works?',
];
const adminMessages = [
    'Hello! How can we help you today?',
    'Sure, I will be happy to help you.',
    'Let me check that for you.',
    'Thank you for providing the details.',
    'We have reviewed your request.',
    'The issue should now be resolved.',
    'Please let us know if you need anything else.',
];
export const generateSupportMessages = (conversations, createdUsers) => {
    const admin = createdUsers.find((user) => user.role === UserRole.ADMIN);
    if (!admin) {
        throw new Error('Admin user not found.');
    }
    const messages = [];
    conversations.forEach((conversation, conversationIndex) => {
        const user = createdUsers.find((user) => user.id === conversation.userId);
        if (!user) {
            return;
        }
        const messageCount = 2 + (conversationIndex % 5);
        for (let i = 0; i < messageCount; i++) {
            const isAdminMessage = i % 2 !== 0;
            messages.push({
                conversationId: conversation.id,
                senderId: isAdminMessage ? admin.id : user.id,
                message: isAdminMessage
                    ? adminMessages[(conversationIndex + i) % adminMessages.length]
                    : userMessages[(conversationIndex + i) % userMessages.length],
                attachments: [],
                isRead: conversation.status === 'closed' ? true : i !== messageCount - 1,
            });
        }
    });
    return messages;
};
//# sourceMappingURL=support-messages.js.map