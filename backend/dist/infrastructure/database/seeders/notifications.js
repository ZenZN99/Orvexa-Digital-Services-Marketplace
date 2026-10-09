import { NotificationType } from '../../../common/enums/notification.enum.js';
import { UserRole } from '../../../common/enums/user.enum.js';
const getNotificationTemplate = (type, contract) => {
    switch (type) {
        case NotificationType.BLOCK_USER:
            return {
                message: 'A user has been blocked.',
                link: null,
            };
        case NotificationType.USER_VERIFICATION:
            return {
                message: 'Your identity verification is waiting for review.',
                link: '/identity-verification',
            };
        case NotificationType.USER_VERIFICATION_APPROVED:
            return {
                message: 'Your identity verification has been approved.',
                link: '/identity-verification',
            };
        case NotificationType.USER_VERIFICATION_REJECTED:
            return {
                message: 'Your identity verification has been rejected.',
                link: '/identity-verification',
            };
        case NotificationType.SERVICE_REVIEW:
            return {
                message: 'Your service is waiting for review.',
                link: '/services/status',
            };
        case NotificationType.SERVICE_APPROVED:
            return {
                message: 'Your service has been approved and published.',
                link: '/services/status',
            };
        case NotificationType.SERVICE_REJECTED:
            return {
                message: 'Your service has been rejected.',
                link: '/services/status',
            };
        case NotificationType.CONTRACT_MESSAGE:
            return {
                message: 'You received a new message about your contract.',
                link: contract ? `/contract/${contract.id}` : '/contracts',
            };
        case NotificationType.CONTRACT_EXPIRED:
            return {
                message: 'One of your contracts has expired.',
                link: contract ? `/contract/${contract.id}` : '/contracts',
            };
        case NotificationType.CONTRACT_COMPLETED:
            return {
                message: 'Your contract has been completed successfully.',
                link: contract ? `/contract/${contract.id}` : '/contracts',
            };
        case NotificationType.CONTRACT_DELIVERED:
            return {
                message: 'A contract delivery is waiting for your review.',
                link: contract ? `/contract/${contract.id}` : '/contracts',
            };
        case NotificationType.REVIEW_CREATED:
            return {
                message: 'A new review has been created for your service.',
                link: contract ? `/review/${contract.id}` : '/reviews',
            };
        case NotificationType.CONTRACT:
            return {
                message: 'You have a new contract.',
                link: contract ? `/contract/${contract.id}` : '/contracts',
            };
        case NotificationType.PAYMENT:
            return {
                message: 'A payment has been processed successfully.',
                link: '/payments',
            };
    }
};
const notificationTypes = Object.values(NotificationType);
export const generateNotifications = (createdUsers, createdContracts) => {
    const admin = createdUsers.find((user) => user.role === UserRole.ADMIN);
    const users = createdUsers.filter((user) => user.role !== UserRole.ADMIN);
    if (!admin || users.length === 0) {
        return [];
    }
    const notifications = [];
    for (let i = 0; i < users.length; i++) {
        const receiver = users[i];
        const notificationCount = 3 + (i % 5);
        for (let j = 0; j < notificationCount; j++) {
            const type = notificationTypes[(i + j) % notificationTypes.length];
            const contract = createdContracts.length > 0
                ? createdContracts[(i + j) % createdContracts.length]
                : undefined;
            const template = getNotificationTemplate(type, contract);
            if (!template) {
                continue;
            }
            const isAdminNotification = type === NotificationType.BLOCK_USER ||
                type === NotificationType.USER_VERIFICATION ||
                type === NotificationType.SERVICE_REVIEW;
            const sender = isAdminNotification
                ? admin
                : users[(i + j + 1) % users.length];
            const usesContract = type === NotificationType.CONTRACT_MESSAGE ||
                type === NotificationType.CONTRACT_EXPIRED ||
                type === NotificationType.CONTRACT_COMPLETED ||
                type === NotificationType.CONTRACT_DELIVERED ||
                type === NotificationType.REVIEW_CREATED ||
                type === NotificationType.CONTRACT;
            notifications.push({
                senderId: sender.id,
                receiverId: receiver.id,
                targetId: usesContract ? (contract?.id ?? null) : null,
                type,
                message: template.message,
                isRead: (i + j) % 3 !== 0,
                link: template.link,
            });
        }
    }
    return notifications;
};
//# sourceMappingURL=notifications.js.map