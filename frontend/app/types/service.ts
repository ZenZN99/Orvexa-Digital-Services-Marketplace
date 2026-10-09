import { IUser } from "./user";
import { IUserProfile } from "./user-profile";

export enum ServiceCategory {
  PROGRAMMING = "programming",
  DESIGN = "design",
  DIGITAL_MARKETING = "digital_marketing",
  WRITING_TRANSLATION = "writing_translation",
  VIDEO_AUDIO = "video_audio",
  BUSINESS = "business",
  DATA_ANALYSIS = "data_analysis",
  AI = "ai",
  ENGINEERING = "engineering",
  LIFESTYLE = "lifestyle",
}

export enum ServiceStatus {
  PENDING = "pending",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

export interface IService {
  id: string;
  freelancerId: string;
  category: ServiceCategory;
  title: string;
  description: string;
  features: string[];
  images: {
    url: string;
    publicId: string;
  }[];
  keywords: string[];
  price: number;
  deliveryDays: number;
  status: ServiceStatus;
  ordersCount: number;
  ratingCount: number;
  ratingAverage: number;
  reason: string | null;
  freelancer: {
    user: IUser;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
