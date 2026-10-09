import { Request } from 'express';
import { User } from '../modules/users/schema/user.schema.ts';

export interface RequestWithUser extends Request {
  user: User;
}
