import { IFreelancer, JobTitle, Skills } from "./freelancer";
import { UserVerificationStatus } from "./user-verification";

export enum UserRole {
  ADMIN = "admin",
  SUPPORT = "support",
  FREELANCER = "freelancer",
  CLIENT = "client",
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  refreshToken: string | null;
  isActive: boolean;
  balance: number;
  frozenBalance: number;
  lastLoginAt: Date | null;
  profile: {
    avatar: {
      url: string;
      publicId: string;
    };
    cover: {
      url: string;
      publicId: string;
    };
    bio: string;
  };
  verification: {
    status: UserVerificationStatus;
    rejectionReason: string | null;
    submittedAt: Date | null;
    profileImage: {
      url: string;
      publicId: string;
    };

    identityDocument: {
      url: string;
      publicId: string;
    };
  };
  freelancer: IFreelancer;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserStore {
  currentUser: IUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: IUser | null) => void;
  loadUser: () => void;
  logout: () => void;
}
