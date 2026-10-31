export interface IUserProfile {
  id: string;
  userId: string;
  avatar: {
    url: string;
    publicId: string;
  } | null;
  cover: {
    url: string;
    publicId: string;
  } | null;
  bio: string;
  createdAt?: Date;
  updatedAt?: Date;
}
