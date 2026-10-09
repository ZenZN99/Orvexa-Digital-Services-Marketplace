export const messages = {
    auth: {
        unauthorized: 'Unauthorized',
        forbidden: 'Forbidden',
        register: {
            success: 'Account created successfully',
            failed: 'Unable to complete registration',
            invalidData: 'Invalid register data',
        },
        login: {
            success: 'Logged in successfully',
            failed: 'Invalid email or password',
            unauthorized: 'You are not authorized',
        },
        logout: {
            success: 'Logged out successfully',
            failed: 'Logout failed',
        },
        me: {
            success: 'User fetched successfully',
            notFound: 'User not found',
            unauthorized: 'Unauthorized access',
        },
        token: {
            invalid: 'Invalid or expired token',
            missing: 'Token is missing',
        },
    },
    user: {
        adminNotFound: 'Admin user not found',
        notFound: 'User not found',
        blocked: 'This account is banned.',
        getAllUsers: {
            success: 'Users fetched successfully',
            failed: 'Failed to fetch users',
        },
        getUser: {
            success: 'User fetched successfully',
            failed: 'Failed to fetch user',
        },
        block: {
            success: 'User blocked successfully',
            failed: 'Failed to block user',
        },
        updateRole: {
            success: 'User role updated successfully',
            unauthorized: 'Only administrators are allowed',
            invalidRole: 'Invalid role provided',
        },
        avatar: {
            success: 'Avatar updated successfully',
            fileRequired: 'Avatar file is required',
        },
        identity: {
            success: 'Identity submitted successfully',
            fileRequired: 'Both images are required',
            alreadyVerified: 'You are already verified',
        },
        verification: {
            invalidStatus: 'Invalid status provided',
            forbidden: 'Only administrators are allowed',
        },
        requests: {
            success: 'Verification requests fetched successfully',
            forbidden: 'Only administrators are allowed',
        },
    },
    userProfile: {
        notFound: 'User profile not found',
        update: {
            success: 'User profile updated successfully',
        },
    },
    freelancer: {
        notFound: 'Freelancer not found',
    },
    service: {
        notFound: 'Service not found',
        imagesRequired: 'Service images is required',
        create: {
            maxServices: 'You cannot have more than 15 services.',
            success: 'Service created succssfully!',
        },
        update: {
            forbidden: 'You are not authorized to update this service.',
            success: 'Service updated succssfully!',
        },
        updateStatus: {
            success: 'Service status updated successfully.',
            reasonRequired: 'A rejection reason is required.',
            alreadySameStatus: 'The service already has this status.',
        },
        destroy: {
            forbidden: 'You are not authorized to delete this service.',
            success: 'Service deleted successfully.',
            pending: 'You cannot delete a service while it is pending review.',
        },
    },
    cart: {
        notFound: 'Cart not found.',
        addItem: {
            success: 'Service added to cart successfully.',
            alreadyExists: 'This service is already in your cart.',
            cannotAddOwnService: 'You cannot add your own service to your cart.',
        },
        removeItem: {
            success: 'Service removed from cart successfully.',
        },
        itemNotFound: 'Cart item not found.',
        clear: {
            success: 'Cart cleared successfully.',
        },
    },
    order: {
        notFound: 'Order not found',
        emptyCart: 'Cannot create an order from an empty cart.',
        cannotDelete: 'Only pending payment orders can be deleted.',
        create: {
            success: 'Order created successfully.',
        },
        destroy: {
            success: 'Order deleted successfully.',
        },
    },
    payment: {
        notFound: 'payment not found',
        success: 'Payment completed successfully.',
        orderAlreadyProcessed: 'This order has already been processed.',
        insufficientBalance: 'Insufficient balance.',
        alreadyPaid: 'This order has already been paid.',
        serviceUnavailable: 'One or more services are no longer available.',
        rechargeBalance: {
            success: 'The balance has been successfully topped up.',
            invalidAmount: 'Amount must be greater than 0',
        },
    },
    contract: {
        notFound: 'Contract not found',
        expire: {
            success: 'Contract expired and payment refunded successfully.',
            alreadyProcessed: 'This contract has already been processed.',
            notDue: 'The contract deadline has not been reached yet.',
        },
        complete: {
            success: 'Service completed successfully.',
            invalidStatus: 'The contract must be delivered before it can be completed.',
            insufficientFrozenBalance: 'Insufficient frozen balance for this contract.',
        },
        deliver: {
            success: 'Service delivered successfully.',
            invalidStatus: 'The contract must be in progress before it can be delivered.',
        },
    },
    platformWallet: {
        notFound: 'Platform Wallet not found',
        withdraw: {
            insufficientBalance: 'Insufficient platform wallet balance.',
            success: 'Platform balance withdrawn successfully.',
        },
    },
    message: {
        notFound: 'Message not found',
        forbidden: 'Forbidden',
        contractClosed: 'Messages cannot be sent because the contract is no longer active.',
        empty: 'Message must contain text or at least one image.',
        create: {
            success: 'Message sent successfully.',
        },
        destroy: {
            success: 'Message deleted successfully.',
        },
    },
    supportConversation: {
        notFound: 'Support conversation not found.',
        closed: 'Support conversation is closed.',
        alreadyOpen: 'You already have an open support conversation.',
        alreadyClosed: 'Support conversation is already closed.',
        create: {
            success: 'Support conversation created successfully.',
        },
        close: {
            success: 'Support conversation closed successfully.',
        },
        open: {
            success: 'Support conversation is open.',
        },
    },
    supportMessage: {
        notFound: 'Support message not found.',
        create: {
            empty: 'Support message must contain text or at least one attachment.',
            maxAttachments: 'You can upload a maximum of 5 attachments per message.',
            success: 'Support message sent successfully.',
        },
        markAsRead: {
            success: 'Support messages marked as read successfully.',
        },
        destroy: {
            success: 'Support message deleted succssfully',
        },
    },
    notification: {
        notFound: 'Notification not found.',
        destroy: {
            success: 'Notification deleted successfully.',
        },
        markAsRead: {
            success: 'Notification marked as read successfully.',
        },
        markAllAsRead: {
            success: 'All notifications marked as read successfully.',
        },
    },
    userVerification: {
        required: 'Identity verification is required to perform this action.',
        notFound: 'User verification not found.',
        alreadyPending: 'Your verification request is already pending.',
        alreadyVerified: 'Your identity has already been verified.',
        alreadyReviewed: 'This verification request has already been reviewed.',
        rejectionReasonRequired: 'Rejection reason is required when rejecting a verification request.',
        create: {
            success: 'Verification request submitted successfully.',
        },
        resubmit: {
            success: 'Verification request resubmitted successfully.',
        },
        updateStatus: {
            success: 'User verification status updated successfully.',
        },
    },
    review: {
        notFound: 'review not found',
        create: {
            success: 'Review created successfully.',
            contractNotCompleted: 'You can only review a service after the contract has been completed successfully.',
            alreadyReviewed: 'You have already reviewed this service.',
            paymentNotCompleted: 'You cannot review this service because the payment was not completed.',
        },
    },
};
//# sourceMappingURL=messages.js.map