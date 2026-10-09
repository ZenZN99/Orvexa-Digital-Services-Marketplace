import { ContractStatus } from '../../../common/enums/contract.enum.js';
const comments = [
    'Excellent service and very professional work.',
    'Great communication and delivered everything on time.',
    'Very satisfied with the quality of the work.',
    'The freelancer was professional and responsive.',
    'Amazing experience. I would definitely work with this freelancer again.',
    'Good quality and fast delivery.',
    'Everything was exactly as described.',
    'Very helpful and easy to work with.',
    'Excellent attention to detail.',
    'Highly recommended freelancer.',
];
export const generateReviews = (createdContracts) => {
    return createdContracts
        .filter((contract) => contract.status === ContractStatus.COMPLETED)
        .map((contract, index) => ({
        contractId: contract.id,
        serviceId: contract.serviceId,
        clientId: contract.clientId,
        freelancerId: contract.freelancerId,
        rating: 3 + (index % 3),
        comment: comments[index % comments.length],
    }));
};
//# sourceMappingURL=reviews.js.map