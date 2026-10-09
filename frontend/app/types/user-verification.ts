import { IUser } from "./user";

export const UserVerificationsStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export type UserVerificationStatus =
  (typeof UserVerificationsStatus)[keyof typeof UserVerificationsStatus];

export interface IUserVerification {
  id: string;
  userId: string;
  profileImage: {
    url: string;
    publicId: string;
  } | null;
  identityDocument: {
    url: string;
    publicId: string;
  } | null;
  status: UserVerificationStatus | null;
  rejectionReason: string | null;
  reviewedBy: string | null;
  submittedAt: Date | null;
  reviewedAt: Date | null;
  user: IUser;
  createdAt?: Date;
  updatedAt?: Date;
}
