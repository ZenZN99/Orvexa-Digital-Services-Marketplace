import { IContract } from "./contract";
import { IFreelancer } from "./freelancer";
import { IService } from "./service";
import { IUser } from "./user";

export interface IReview {
  id: string;
  contractId: string;
  serviceId: string;
  clientId: string;
  freelancerId: string;
  rating: number;
  comment: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  contract: IContract;
  service: IService;
  client: IUser;
  freelancer: IFreelancer;
}
