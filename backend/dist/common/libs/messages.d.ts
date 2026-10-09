export declare const messages: {
    auth: {
        unauthorized: string;
        forbidden: string;
        register: {
            success: string;
            failed: string;
            invalidData: string;
        };
        login: {
            success: string;
            failed: string;
            unauthorized: string;
        };
        logout: {
            success: string;
            failed: string;
        };
        me: {
            success: string;
            notFound: string;
            unauthorized: string;
        };
        token: {
            invalid: string;
            missing: string;
        };
    };
    user: {
        adminNotFound: string;
        notFound: string;
        blocked: string;
        getAllUsers: {
            success: string;
            failed: string;
        };
        getUser: {
            success: string;
            failed: string;
        };
        block: {
            success: string;
            failed: string;
        };
        updateRole: {
            success: string;
            unauthorized: string;
            invalidRole: string;
        };
        avatar: {
            success: string;
            fileRequired: string;
        };
        identity: {
            success: string;
            fileRequired: string;
            alreadyVerified: string;
        };
        verification: {
            invalidStatus: string;
            forbidden: string;
        };
        requests: {
            success: string;
            forbidden: string;
        };
    };
    userProfile: {
        notFound: string;
        update: {
            success: string;
        };
    };
    freelancer: {
        notFound: string;
    };
    service: {
        notFound: string;
        imagesRequired: string;
        create: {
            maxServices: string;
            success: string;
        };
        update: {
            forbidden: string;
            success: string;
        };
        updateStatus: {
            success: string;
            reasonRequired: string;
            alreadySameStatus: string;
        };
        destroy: {
            forbidden: string;
            success: string;
            pending: string;
        };
    };
    cart: {
        notFound: string;
        addItem: {
            success: string;
            alreadyExists: string;
            cannotAddOwnService: string;
        };
        removeItem: {
            success: string;
        };
        itemNotFound: string;
        clear: {
            success: string;
        };
    };
    order: {
        notFound: string;
        emptyCart: string;
        cannotDelete: string;
        create: {
            success: string;
        };
        destroy: {
            success: string;
        };
    };
    payment: {
        notFound: string;
        success: string;
        orderAlreadyProcessed: string;
        insufficientBalance: string;
        alreadyPaid: string;
        serviceUnavailable: string;
        rechargeBalance: {
            success: string;
            invalidAmount: string;
        };
    };
    contract: {
        notFound: string;
        expire: {
            success: string;
            alreadyProcessed: string;
            notDue: string;
        };
        complete: {
            success: string;
            invalidStatus: string;
            insufficientFrozenBalance: string;
        };
        deliver: {
            success: string;
            invalidStatus: string;
        };
    };
    platformWallet: {
        notFound: string;
        withdraw: {
            insufficientBalance: string;
            success: string;
        };
    };
    message: {
        notFound: string;
        forbidden: string;
        contractClosed: string;
        empty: string;
        create: {
            success: string;
        };
        destroy: {
            success: string;
        };
    };
    supportConversation: {
        notFound: string;
        closed: string;
        alreadyOpen: string;
        alreadyClosed: string;
        create: {
            success: string;
        };
        close: {
            success: string;
        };
        open: {
            success: string;
        };
    };
    supportMessage: {
        notFound: string;
        create: {
            empty: string;
            maxAttachments: string;
            success: string;
        };
        markAsRead: {
            success: string;
        };
        destroy: {
            success: string;
        };
    };
    notification: {
        notFound: string;
        destroy: {
            success: string;
        };
        markAsRead: {
            success: string;
        };
        markAllAsRead: {
            success: string;
        };
    };
    userVerification: {
        required: string;
        notFound: string;
        alreadyPending: string;
        alreadyVerified: string;
        alreadyReviewed: string;
        rejectionReasonRequired: string;
        create: {
            success: string;
        };
        resubmit: {
            success: string;
        };
        updateStatus: {
            success: string;
        };
    };
    review: {
        notFound: string;
        create: {
            success: string;
            contractNotCompleted: string;
            alreadyReviewed: string;
            paymentNotCompleted: string;
        };
    };
};
